from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename
from flask import send_from_directory
from pdf2image import convert_from_path
import os


UPLOAD_FOLDER = '../src/flowcharts'
ALLOWED_EXTENSIONS = {'pdf', 'json'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = b'\xf39M\x89\xc7s-Y\xfa\x80\x0c\x04\x10WD\xe8\x05d\xe3\xdd\xd4A\x8f\xf3'


def has_filetype(filename, filetype):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() == filetype


@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if request.form["password"] != "password":
            return "Error"
        # check if the post request has the file part
        if 'file' not in request.files:
            print('file no part')
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and has_filetype(file.filename, "pdf"):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            #print(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            print(UPLOAD_FOLDER + '/' + filename)

            images = convert_from_path(UPLOAD_FOLDER + '/' + filename)
            for img in images:
                img.save(os.path.join(
                    app.config['UPLOAD_FOLDER'], filename.replace('pdf', 'jpg')))

            os.remove(UPLOAD_FOLDER + '/' + filename)
            return "ok"

    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
      <input type=password name=password>
    </form>
    '''


@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)
