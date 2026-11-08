import numpy as np

def apply_linear_transformation(input_vectors, transform_matrix):
    """
    input_vectors: List of points [[x1, y1], [x2, y2], ...]
    transform_matrix: 2x2 transformation grid [[a, b], [c, d]]
    """
    V = np.array(input_vectors).T  # Shape: (2, N)
    A = np.array(transform_matrix) # Shape: (2, 2)
    
    # Execute Matrix Multiplication: Ax
    transformed_V = np.dot(A, V)
    
    # Return as an array of structured coordinate dictionaries for the JSON API
    return [{"x": float(pt[0]), "y": float(pt[1])} for pt in transformed_V.T]
