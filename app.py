from ai_util import run_model
from flask import Flask, render_template, request, redirect, url_for, send_from_directory, jsonify
import os
import tempfile
from PIL import Image, ExifTags
import json
import yaml

# import the config file
with open('config.yaml') as f:
    config_data = yaml.load(f, Loader=yaml.FullLoader)['types']

app = Flask(__name__)


# Correct image rotation for photos taken with mobile phones.
def rotate_image(image_path):
    image = Image.open(image_path)
    try:
        for orientation in ExifTags.TAGS.keys():
            if ExifTags.TAGS[orientation] == 'Orientation':
                break
        exif = dict(image._getexif().items())

        if exif[orientation] == 3:
            image = image.rotate(180, expand=True)
        elif exif[orientation] == 6:
            image = image.rotate(270, expand=True)
        elif exif[orientation] == 8:
            image = image.rotate(90, expand=True)
        image.save(image_path)
        image.close()
    except (AttributeError, KeyError, IndexError):
        # cases: image don't have getexif
        pass


# Main page
@app.route('/')
def index():
    return render_template('index.html')


# Upload the image to a temporary folder and pass it to the AI model.
@app.route('/upload', methods=['POST'])
def upload():
    files = request.files.getlist('files')
    image_paths = []
    # Save the input images to temp dir
    temp_dir = tempfile.mkdtemp()

    for file in files:
        if file:
            filename = file.filename
            filepath = os.path.join(temp_dir, filename)
            file.save(filepath)
            rotate_image(filepath)  # Rotate the image if necessary
            image_paths.append(filepath)

    # Run the AI Model
    results = run_model(image_paths)

    # Convert results to a JSON-serializable format
    serialized_results = []

    # result images with bounding boxes
    result_paths = []
    for i, r in enumerate(results):
        temp_result = []
        # Save already stored cls information to prevent duplication.
        past_classes = []
        for idx, cls in enumerate(r.boxes.cls.numpy()):
            cls = int(cls)
            if cls in past_classes:
                continue
            past_classes.append(cls)
            temp = config_data[cls]
            temp['confidence'] = float(r.boxes.conf.numpy()[idx])
            temp_result.append(temp)
        serialized_results.append(temp_result)

        # Plot results image
        im_bgr = r.plot(conf=False)  # BGR-order numpy array
        im_rgb = Image.fromarray(im_bgr[..., ::-1])  # RGB-order PIL image

        # Save the result images
        temp_filename = str(i) + ".jpg"
        result_filepath = os.path.join(temp_dir, temp_filename)
        im_rgb.save(result_filepath)
        result_paths.append(result_filepath)

    return jsonify({"success": True, "image_paths": result_paths, "temp_dir": temp_dir, "results": serialized_results})


@app.route('/temp_uploads/<path:filename>')
def temp_uploaded_file(filename):
    temp_dir = request.args.get('temp_dir')
    return send_from_directory(temp_dir, filename)


# Detection results page
@app.route('/detect')
def detect():
    temp_dir = request.args.get('temp_dir')
    images = request.args.get('images').split(',')
    image_urls = [url_for('temp_uploaded_file', filename=os.path.basename(image), temp_dir=temp_dir) for image in images]
    results = json.loads(request.args.get('results', '[]'))

    return render_template('detect.html', images=image_urls, results=results)


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
