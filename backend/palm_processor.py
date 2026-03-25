import cv2
import numpy as np
import base64
from PIL import Image
import io


def process_palm(image_bytes: bytes) -> dict:
    """
    Process a palm image using OpenCV.
    Returns edge-detected image (base64) and line metrics.
    """
    # Decode image from bytes
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        raise ValueError("Could not decode image. Please upload a valid image file.")

    # Resize for consistent processing
    height, width = img.shape[:2]
    max_dim = 600
    if max(height, width) > max_dim:
        scale = max_dim / max(height, width)
        img = cv2.resize(img, (int(width * scale), int(height * scale)))

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Enhance contrast
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(gray)

    # Gaussian blur to reduce noise
    blurred = cv2.GaussianBlur(enhanced, (5, 5), 0)

    # Canny edge detection to find palm lines
    edges = cv2.Canny(blurred, threshold1=40, threshold2=100)

    # Morphological operations to connect nearby lines
    kernel = np.ones((2, 2), np.uint8)
    edges_clean = cv2.dilate(edges, kernel, iterations=1)
    edges_clean = cv2.erode(edges_clean, kernel, iterations=1)

    # Create a visually appealing edge image (colored glow on dark background)
    edge_colored = np.zeros((edges_clean.shape[0], edges_clean.shape[1], 3), dtype=np.uint8)
    # Gold/amber glow for palm lines
    edge_colored[edges_clean > 0] = [0, 180, 255]  # BGR: orange-gold

    # Blend with a dimmed version of original for context
    original_dim = cv2.addWeighted(img, 0.15, np.zeros_like(img), 0.85, 0)
    result_image = cv2.add(original_dim, edge_colored)

    # Add a subtle purple tint to dark areas
    purple_overlay = np.zeros_like(result_image)
    purple_overlay[edges_clean == 0] = [30, 5, 20]  # subtle purple for background
    result_image = cv2.add(result_image, purple_overlay)

    # ---- Encode result image to base64 ----
    _, buffer = cv2.imencode('.jpg', result_image, [cv2.IMWRITE_JPEG_QUALITY, 90])
    edge_base64 = base64.b64encode(buffer).decode('utf-8')

    # ---- Extract metrics for prediction ----
    h, w = edges_clean.shape
    total_pixels = h * w

    # Overall edge density
    edge_density = float(np.sum(edges_clean > 0)) / total_pixels

    # Find contours (individual line segments)
    contours, _ = cv2.findContours(edges_clean, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    line_count = len(contours)

    # Region-based analysis (top = heart line zone, mid = head line, bottom = life line)
    top_third = edges_clean[:h // 3, :]
    mid_third = edges_clean[h // 3: 2 * h // 3, :]
    bot_third = edges_clean[2 * h // 3:, :]

    heart_density = float(np.sum(top_third > 0)) / (top_third.size + 1)
    head_density = float(np.sum(mid_third > 0)) / (mid_third.size + 1)
    life_density = float(np.sum(bot_third > 0)) / (bot_third.size + 1)

    # Long line detection (contours with large arc length)
    long_lines = sum(1 for c in contours if cv2.arcLength(c, False) > 30)

    return {
        "edge_image_base64": edge_base64,
        "metrics": {
            "edge_density": round(edge_density, 4),
            "line_count": line_count,
            "long_lines": long_lines,
            "heart_density": round(heart_density, 4),
            "head_density": round(head_density, 4),
            "life_density": round(life_density, 4),
        }
    }
