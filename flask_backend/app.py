from flask import Flask, flash, request, redirect, url_for
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
from flask import send_from_directory
from pdf2image import convert_from_path
from pathlib import Path
from os import path
from flask_cors import CORS, cross_origin
import os
from passlib.hash import sha256_crypt

# ^^Go through the above libraries and utilize pip install <libraryname> in the virtual environment to run the flask server

UPLOAD_FOLDER = '../src/flowcharts'
ALLOWED_EXTENSIONS = {'pdf', 'json'}
JSON_FOLDER = Path('../src/json')

PASSWORD_FILE = '../PASSWORD_HASH_DO_NOT_COMMIT'

# Reference used: https://blog.miguelgrinberg.com/post/how-to-deploy-a-react--flask-project
# -----------------------
# **  DEPLOYMENT NOTE  **
# -----------------------
# The arguments static_folder and static_url_path below make Flask serve the React app
# You need to run yarn build for this to work
# Also, UTD may decide to deploy the React app separately from the Flask app
# depending on their web infrastructure (Apache, etc.)
#
# UTD OIT STAFF: Change the line below to Flask(__name__) to disable Flask statically serving the React app
# (and also delete the '/' route below it)
app = Flask(__name__, static_folder='../build', static_url_path='/')
@app.route('/')
def index():
    return app.send_static_file('index.html')

# CORS needed in development if you want to host the Flask backend and React frontend separately (i.e., if you're doing yarn start instead of yarn build)
# However, it's not necessarily needed in production (and the office of information security might not like it in prod)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = b'\xf39M\x89\xc7s-Y\xfa\x80\x0c\x04\x10WD\xe8\x05d\xe3\xdd\xd4A\x8f\xf3'

# Not currently used in this file, see setup.py
def change_password(newPassword):
    with open(PASSWORD_FILE, 'w') as f:
        f.write(sha256_crypt.encrypt(newPassword))

# uncomment to set password
#change_password("password goes here")


##########################
# Password authentication:
# There is one advisor password (no username) that advisors can use to do advisor-only tasks (e.g. upload flowchart PDFs)
# They don't enter it in manually. Rather, they bookmark a special form of the URL to the site that has #PASSWORD_WOULD_GO_HERE at the end (i.e. #password if the password is password)
# The client then strips/hides this part from the URL (so that onlookers can't see it) and stores it in a variable to use whenever making requests that need privileged access

def is_correct_password(password):
    if not path.exists(PASSWORD_FILE):
        return 'Advisor password not set.', 500
    with open(PASSWORD_FILE) as f:
        correctPasswordHash = f.read()
        return sha256_crypt.verify(password, correctPasswordHash)


def change_password(newPassword):
    with open(PASSWORD_FILE, 'w') as f:
        f.write(sha256_crypt.encrypt(newPassword))

# uncomment to set password
#change_password("password goes here")


def is_correct_password(password):
    if not path.exists(PASSWORD_FILE):
        return 'Advisor password not set.', 500
    with open(PASSWORD_FILE) as f:
        correctPasswordHash = f.read()
        return sha256_crypt.verify(password, correctPasswordHash)


def has_filetype(filename, filetype):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() == filetype

# Flask documentation about HTTP requests on Node.js servers w/ CORs middleware https://flask-cors.readthedocs.io/en/latest/

# Used to serve flowcharts to students, as well as for advisors to upload flowcharts
@app.route('/api/pdf', methods=['GET', 'POST'])
@cross_origin()
def upload_file():
    if request.method == 'POST':
        if not is_correct_password(request.form["password"]):
            return "Unauthorized: incorrect password", 401
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
        if file and has_filetype(file.filename, "pdf") and request.form["flowchartName"]:
            filename = secure_filename(request.form["flowchartName"] + ".pdf") # name sanitized here
            print(f"Upload file: {file.filename} (rename to {filename})")
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            #print(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            print(UPLOAD_FOLDER + '/' + filename)

            print("Starting conversion...")
            images = convert_from_path(UPLOAD_FOLDER + '/' + filename)
            for img in images:
                img_path = os.path.join(app.config['UPLOAD_FOLDER'], filename.replace('pdf', 'png'))
                img.save(img_path)
            print(f"Conversion complete. Saved to {img_path}")
            os.remove(UPLOAD_FOLDER + '/' + filename) # delete image now that pdf is saved
            return "ok"

# Serves the position info JSON to students (i.e., for a given flowchart, the JSON position and naming data for all the course boxes that React uses)
# Also API for advisor portal to update this data
@app.route('/api/json', methods=['GET', 'POST'])
@cross_origin()
def pixelInfo():
    if request.method == 'POST':
        filePath = JSON_FOLDER/request.form["filename"]
        if not is_correct_password(request.form["password"]):
            return "Unauthorized: incorrect password", 401
        with open(filePath, 'w') as f:
            f.write(request.form["body"])
            return "ok"
    if request.method == 'GET':
        # https://stackoverflow.com/questions/11774265/how-do-you-get-a-query-string-on-flask
        filePath = JSON_FOLDER/request.args.get("filename")
        if(not path.exists(filePath)):
            return "[]"
        else:
            with open(filePath, 'r') as f:
                return f.read()

# Boilerplate, not used
# Can be removed if desired
@app.route('/api/img/<filename>', methods=['GET'])
@cross_origin()
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)
