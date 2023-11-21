import React, { useRef, useState } from 'react';
import axios from 'axios';

const DrawingArea = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [data,setData] = useState("")

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 5;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setData("")
  };
  
  const submitDrawing = () => {
    const canvas = canvasRef.current;
    const timestamp = new Date().getTime();
    canvas.toBlob((blob) => {
      const formData = new FormData();
      formData.append('file', blob);
      axios.post(`http://127.0.0.1:5555/predict?timestamp=${timestamp}`, formData)
        .then((response) => {
          setData(response.data)
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }, 'image/png');
  };

  return (
    <div className="App">
      <h1>Digit Recognition Website </h1>
      <div className="contain">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        width={400}
        height={400}
      />
      </div>
      <div className="buttons">
        <button id="clear" onClick={clearCanvas}>
          Clear
        </button>
        <button id="submit" onClick={submitDrawing}>
          Predict
        </button>
      </div>
      <h2>{data?.class ? <span>The image is {data.class} with {data.confidence} probability</span> : null}</h2>
    </div>
  );
};

export default DrawingArea;
