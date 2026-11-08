import React, { useState, useEffect, useRef } from 'react';

// Keep the original base shape configuration fixed as our math reference point
const BASE_SHAPE = [
  { x: 0, y: 0 },
  { x: 3, y: 0 },
  { x: 3, y: 2 },
  { x: 1, y: 2 },
  { x: 1, y: 4 },
  { x: 0, y: 4 }
];

export default function VectorVisualizer() {
  // This state holds the active coordinates actively drawn on our canvas screen
  const [coordinates, setCoordinates] = useState(BASE_SHAPE);

  // Initialize with a standard 90-degree counter-clockwise rotation matrix
  const [matrixA, setMatrixA] = useState([
    [0, -1],
    [1, 0]
  ]);

  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  const CANVAS_SIZE = 400;
  const GRID_SCALE = 40; // 1 unit in math data = 40 pixels on screen

  // Automatically redraw the graph grid and vectors whenever coordinates change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // 1. Clear previous drawings
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
    
    // 2. Establish Origin (0,0) right in the center of our canvas frame
    const cx = CANVAS_SIZE / 2;
    const cy = CANVAS_SIZE / 2;

    // 3. Draw Grid Lines (Background layout)
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += GRID_SCALE) {
      // Vertical grid lines
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, CANVAS_SIZE); ctx.stroke();
      // Horizontal grid lines
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(CANVAS_SIZE, i); ctx.stroke();
    }

    // 4. Draw Core X and Y Cartesian Axis Lines
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(CANVAS_SIZE, cy); ctx.stroke(); // X-Axis
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, CANVAS_SIZE); ctx.stroke(); // Y-Axis

    // 5. Draw Transformed Mathematics Polygon Shape
    if (coordinates.length > 0) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.3)'; // Sky blue tint filling
      ctx.strokeStyle = '#38bdf8'; // Solid blue frame border
      ctx.lineWidth = 3;

      ctx.beginPath();
      // Invert Y axis multiplication because pixel arrays calculate top-down instead of bottom-up
      ctx.moveTo(cx + coordinates[0].x * GRID_SCALE, cy - coordinates[0].y * GRID_SCALE);
      
      for (let i = 1; i < coordinates.length; i++) {
        ctx.lineTo(cx + coordinates[i].x * GRID_SCALE, cy - coordinates[i].y * GRID_SCALE);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Draw distinct tracking anchor nodes at coordinate points
      ctx.fillStyle = '#f43f5e'; // Rose points
      coordinates.forEach(v => {
        ctx.beginPath();
        ctx.arc(cx + v.x * GRID_SCALE, cy - v.y * GRID_SCALE, 5, 0, 2 * Math.PI);
        ctx.fill();
      });
    }
  }, [coordinates]);

  const handleMatrixChange = (row, col, value) => {
    const updatedMatrix = [...matrixA];
    updatedMatrix[row][col] = parseFloat(value) || 0;
    setMatrixA(updatedMatrix);
  };

  const handleTransformSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Crucial: Always send BASE_SHAPE to avoid multiplying numbers into infinity on consecutive clicks
        body: JSON.stringify({ vectors: BASE_SHAPE, matrix: matrixA })
      });
      
      const transformedData = await response.json();
      
      if (transformedData.status === 'success') {
        setCoordinates(transformedData.transformed_vectors);
      }
    } catch (error) {
      console.error("Connection matrix issue:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '32px', padding: '32px', maxWidth: '900px', margin: '0 auto', backgroundColor: '#1e293b', color: '#ffffff', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', alignItems: 'center', fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Visual Workspace Canvas Layout Column */}
      <div>
        <canvas 
          ref={canvasRef} 
          width={CANVAS_SIZE} 
          height={CANVAS_SIZE} 
          style={{ backgroundColor: '#0f172a', borderRadius: '12px', border: '2px solid #475569' }}
        />
      </div>

      {/* Numerical and Interaction Input Column Panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '400px' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#ffffff', margin: '0 0 4px 0', letterSpacing: '-0.025em' }}>Linear Transformation Engine</h2>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: '0 0 24px 0' }}>Visualize vector math computations in real-time.</p>
          
          <p style={{ fontSize: '0.875rem', color: '#cbd5e1', fontWeight: '600', margin: '0 0 8px 0' }}>Transformation Matrix Array (A):</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 75px)', gap: '10px', marginBottom: '24px' }}>
            {matrixA.map((row, rIdx) => 
              row.map((val, cIdx) => (
                <input
                  key={`${rIdx}-${cIdx}`}
                  type="number"
                  step="0.1"
                  value={val}
                  onChange={(e) => handleMatrixChange(rIdx, cIdx, e.target.value)}
                  style={{ width: '75px', padding: '10px', textAlign: 'center', backgroundColor: '#0f172a', color: '#ffffff', border: '1px solid #475569', borderRadius: '8px', fontSize: '1.1rem', fontWeight: '500' }}
                />
              ))
            )}
          </div>

          <div style={{ backgroundColor: '#0f172a', padding: '16px', borderRadius: '12px', border: '1px solid #334155' }}>
            <p style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 'bold', trackingLetter: '0.05em', margin: '0 0 10px 0', textTransform: 'uppercase' }}>Data Vectors (x, y):</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.85rem', fontFamily: 'monospace', color: '#e2e8f0' }}>
              {coordinates.slice(0, 6).map((v, idx) => (
                <div key={idx} style={{ backgroundColor: '#1e293b', padding: '6px 10px', borderRadius: '6px', border: '1px solid #334155' }}>
                  <span style={{ color: '#f43f5e', fontWeight: 'bold' }}>P{idx+1}:</span> [{v.x.toFixed(1)}, {v.y.toFixed(1)}]
                </div>
              ))}
            </div>
          </div>
        </div>

        <button 
          onClick={handleTransformSubmit} 
          disabled={loading}
          style={{ width: '100%', backgroundColor: loading ? '#475569' : '#2563eb', color: '#ffffff', fontWeight: 'bold', padding: '14px', borderRadius: '8px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '1rem', transition: 'background-color 0.2s ease', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)' }}
        >
          {loading ? "Processing NumPy Transformation..." : "Compute Matrix Multiplication (Ax)"}
        </button>
      </div>

    </div>
  );
}
