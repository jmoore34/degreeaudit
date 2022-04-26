# Degree Audit Tool

[![Made with Python](https://img.shields.io/badge/Python-Flask-blue?logo=python&logoColor=white)](https://python.org "Go to Python homepage")
[![Made with TypeScript](https://img.shields.io/badge/TypeScript-React-blue?logo=typescript&logoColor=white)](https://typescriptlang.org "Go to TypeScript homepage")

## What is it?

This is a full-stack web application that allows students to easily plan out their course progresson and share their plan with their academic advisor. It was comissoned by the UTD Engineering and Computer Science Advising Department and implemented in TypeScript (React) and Python (Flask).

### Student View

Students are able to create a persistent degree plan by annotating flowcharts uploaded by advisors. Then, they can easily export their plan as a PNG or PDF file. 

![firefox_0ZwHinDc1d](https://user-images.githubusercontent.com/1783464/165188808-123bad3a-fe6a-4f80-978b-9f426208fb85.gif)

### Advisor View

Advisors are able to upload blank PDF flowcharts which the app will then store as an image. Then, the advisors can use an easy drag-and-drop interface to create, move, resize, rename, and delete class overlays. Students will then automatically be able to interact with the class overlays in the flowcharts. Advisors can also test the flowcharts by stepping into Student View.

![firefox_pps9ohVwGh](https://user-images.githubusercontent.com/1783464/165189173-b4553fbd-7225-4b1f-821c-69c5384d240d.gif)


## Setup

Run the following commands to get started:

1. `cd flask_backend`
2. `python3 -m venv venv`
3. `/venv/Scripts/activate` (Unix) or `venv/Scripts/activate.bat` (Windows)
4. `python3 setup.py`

`setup.py` runs a series of setup commands. If need be, however, you can run these commands manually.
