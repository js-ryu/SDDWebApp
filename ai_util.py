from ultralytics import YOLO


def run_model(images):
    # Load a model
    model = YOLO("./model/yolov8n.pt")  # Set the path to the model file(.pt).

    # Run batched inference on a list of images
    results = model.predict(images, classes=[0,1,2,3,4]) # Set class from 0 to 4 to use the sample Yolo model.

    return results
