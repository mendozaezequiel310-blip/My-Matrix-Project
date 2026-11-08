from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
# Import the function you wrote in your second file
from transform_engine import apply_linear_transformation

app = FastAPI(title="Linear Algebra Transformation Engine")

class Vector2D(BaseModel):
    x: float
    y: float

class TransformationRequest(BaseModel):
    vectors: List[Vector2D]
    matrix: List[List[float]]

# Enable CORS so your React frontend can communicate with this backend securely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, change this to your specific React URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/transform")
async def transform_vectors(payload: TransformationRequest):
    # Simplify the math processing by calling your modular engine directly
    input_points = [[pt.x, pt.y] for pt in payload.vectors]
    
    output_vectors = apply_linear_transformation(input_points, payload.matrix)
    
    return {"status": "success", "transformed_vectors": output_vectors}
