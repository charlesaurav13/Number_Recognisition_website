from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL = tf.keras.models.load_model('handsdigit.h5')

CLASS_NAMES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

@app.get("/ping")
async def ping():
    return "Hello, I am alive"

def read_file_as_image(data) -> np.ndarray:
    image = np.array(Image.open(BytesIO(data)).convert("L").resize((28, 28)))
    image = image/255.0
    return image

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, 0)
    
    prediction = MODEL.predict(img_batch)
    predicted_class = CLASS_NAMES[prediction.argmax()]
    confidence = (prediction.max())*100
    confidence = "{:.2f}".format(confidence)

    return {
        "class": predicted_class,
        "confidence": confidence
    }

if __name__ == "__main__":
    uvicorn.run(app, host='localhost', port=5555)
