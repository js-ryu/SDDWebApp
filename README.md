# Web Application for Skin Disease Detection

Web application beta for CTU(Can Tho University) X DGIST(Daegu Gyeongbuk Institute of Science and Technology) IT Project.

## Requirements

- Python3
- ultralytics
- Flask
- pillow
- PyYAML

**They can be installed all at once with the following command**

`pip install -r requirements.txt`

## About

A web application using Flask.

Accessible via `localhost:5000` in a web browser.

Designed to be responsive, making it usable on mobile devices, tablet PCs, and more.

## How to Use (for Users)

1. Access via `localhost(or IP address):5000` in a web browser.

2. Upload the images you want to analyze in the 'Upload Photos to Detect' section on the left. (Drag & Drop is available. On mobile devices, you can click the 'browse' button to take a photo and upload it directly.)

3. Check the uploaded images in the 'Uploaded Photos' section on the right. You can delete an image by clicking the 'X' button.

4. Click the 'Detect!' button at the bottom to execute.

5. After loading, you will be redirected to the 'Detection Results' page.

6.
- The resulting image with the bounding box drawn will be displayed at the top.
- Switch images by clicking the arrow buttons located on the left and right sides of the result image, or by using the left and right arrow keys on the keyboard.
- At the bottom, a list of recognized diseases along with their definitions, causes, prevention, and treatment information will be displayed.

## Code Information (for Developers)

### How to execute

`python app.py`

### app.py

Main code for a web application.

Implement server-side logic using Flask.

#### Line 9-11

Import `config.yaml` file.

This file stores data to be used in the section explaining results on the 'Detection Results' page.

Check here for detailed explanation.

#### Line 112-113

The section that runs the web application. Currently, it is set to `debug=True`. You can configure it by referring to Flask's arguments.

#### Line 38-41

Function handling the main page (`/`).

Renders `templates/index.html`.

#### Line 44-92

Function that saves the uploaded image to a temporary folder (lines 47-58) and sends it to the AI model (lines 60-61).

The Yolo V8 model returns various information about objects, including an image with bounding boxes drawn.

Inference is done through `ai_utils.py`, and you can refer here for a detailed explanation of that code.

The returned information is then converted to JSON format, and the image with bounding boxes is saved in the temporary folder.

#### Line 101-109

Function handling the result page (`/detect`).

Receives information processed by the `upload()` function and renders it based on `templates/detect.html`.

### config.yaml

Store data to be used in the section explaining results on the 'Detection Results' page.

- It should be written according to the index order of the trained model's classes (0: Blackhead, 1: Nodule, 2: Papule, 3: Pustule, 4: Whitehead).
- Write the content for definition, causes, prevention, and treatment to be displayed on the results page.
- If you modify the data structure, adjust the code accordingly:
    - Lines 120-138 in `templates/detect.html`.
    - Lines 76-79 in `app.py`.
    
### ai_utils.py

Function to run the AI model.

- Set the path for the model (.pt file) at line 6: `model = YOLO("./model/yolov8n.pt")`
    - Currently, the .pt file for the skin disease detection model cannot be stored, so a sample model of Yolo V8 is used.

- Specify `classes=[0,1,2,3,4]` at line 9 to match the number of classes with the skin disease model.
    - Therefore, it can recognize {0: 'person', 1: 'bicycle', 2: 'car', 3: 'motorcycle', 4: 'airplane'}, which are mapped to Blackhead, Nodule, Papule, Pustule, and Whitehead, respectively.

### 기타

- HTML code for page rendering:
    - `templates/index.html`
    - `templates/detect.html`

- CSS code for design elements:
    - `static/css/style.css`
    - `static/css/detect.css`

- JavaScript code for client-side operations:
    - `static/js/scripts.js`
    - `static/js/detect.js`

