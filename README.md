# Linear Algebra & Vector Transformation Engine

A high-performance decoupled full-stack application that visualizes core linear algebra operations in real-time.

## Tech Stack
* **Frontend:** React, HTML5 Canvas API, Tailwind CSS, Vite
* **Backend:** Python, FastAPI, NumPy, Pydantic, Uvicorn

## Features Completed
* **Dynamic Canvas Grid:** Engineered an asymmetric 2D Cartesian coordinate vector polygon grid that visually re-renders transformations.
* **Mathematical Compute Engine:** Implemented a FastAPI endpoint processing matrix multiplication (\(Ax = b\)) using high-performance NumPy arrays.
* **Secure Handshakes:** Bypassed standard browser security barriers using integrated CORS middleware configurations.
* **State Management:** Implemented decoupled state handling using a fixed base shape reference to prevent compounding transformation values into infinity on consecutive triggers.

## Project Structure
```text
├── matrix-backend/         # Python FastAPI server & NumPy math module
└── matrix-visualizer/      # React Vite frontend & Canvas dashboard
```

## Getting Started

### 1. Run the Backend
Navigate into the backend directory, activate your environment, and start the Uvicorn server:
```bash
cd matrix-backend
uvicorn main:app --reload --port 8080
```

### 2. Run the Frontend
Open a separate terminal window, navigate into the frontend directory, and fire up the Vite development server:
```bash
cd matrix-visualizer
# Note: If on Windows PowerShell, run: powershell -ExecutionPolicy Bypass
npm run dev
```

Once both servers are live, open your browser to `http://localhost:5173` to test out core linear transformations like rotations, scaling, and shears.
