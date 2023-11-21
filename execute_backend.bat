@echo off
pip install virtualenv
virtualenv backend -p python3.11
cd backend
call Scripts\activate
pip install -r requirements.txt
python server.py
cmd /k