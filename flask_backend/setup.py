import os

print("********************************** NOTE ***********************************")
print("  NOTE: Make sure you've activated the virtual environment first!")
print("  1. python3 -m venv venv ")
print("  2. /venv/Scripts/activate (Unix) or venv\Scripts\activate.bat (Windows)")
print("***************************************************************************")

def run(command):
    print("Running command: " + command)
    os.system(command)

print("Installing dependencies...")
run("pip3 install -r requirements.txt")

from passlib.hash import sha256_crypt

PASSWORD_FILE = '../PASSWORD_HASH_DO_NOT_COMMIT'

def change_password(newPassword):
    with open(PASSWORD_FILE, 'w') as f:
        f.write(sha256_crypt.hash(newPassword))

print("\nEnter a password to set as the advisor password.")
print("`password` is fine in development, but a very long, random password should be used in prod (since it is saved in a bookmark rather than entered by the advisor)")
password = input("> ")

change_password(password)

print(f"Password changed to '{password}'. Advisor view (keep secret - do not share with students) available at https://ecsadvising.utdallas.edu/degreeaudit/#{password}")
print(f"Student view accessible at https://ecsadvising.utdallas.edu/degreeaudit/")

print("")

print("The flask application can serve the production-compiled React application -- make sure to do `yarn && yarn build` first from the project root directory")
print("Alternatively, `yarn && yarn start` (from the project root directory) can still be used for development builds (note that the flask server must also be running for the frontend to function properly) ")
print("Either way, the backend can be started by doing:")
print(" 1.  ./venv/Scripts/activate (Unix) or venv\Scripts\activate.bat (Windows) ")
print(" 2.  flask run")