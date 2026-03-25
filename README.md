# 🖐️ AI-Based Palmistry Prediction System

> A web application that simulates palmistry using computer vision and rule-based AI — built with React, Flask, and OpenCV.

![Python](https://img.shields.io/badge/Python-3.8+-blue?style=flat-square&logo=python)
![Flask](https://img.shields.io/badge/Flask-2.x-black?style=flat-square&logo=flask)
![React](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)
![OpenCV](https://img.shields.io/badge/OpenCV-4.x-green?style=flat-square&logo=opencv)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

---

## 📌 Overview

This project is a full-stack web application that accepts a palm image from the user, processes it using **OpenCV** for edge detection and line analysis, and generates **AI-simulated predictions** for personality, career, and love life using rule-based logic.

> ⚠️ Disclaimer: This application does **not** perform real palmistry. Predictions are simulated using computer vision techniques and predefined rules for educational purposes.

---

## ✨ Features

- 📤 Upload palm image from browser
- 🔍 Grayscale conversion + edge detection (Canny algorithm)
- 📊 Line density analysis to drive predictions
- 🔮 Predictions across 3 categories: **Love**, **Career**, **Personality**
- 🖼️ View processed (edge-detected) image alongside results
- ⚡ Fast response with loading state feedback

---

## 🧱 System Architecture

```
┌─────────────────────┐         ┌──────────────────────────┐
│     React Frontend  │  POST   │     Flask Backend         │
│  (Upload + Results) │────────▶│  /analyze endpoint        │
│                     │◀────────│  OpenCV Processing        │
│  Displays:          │  JSON   │  Rule-based Predictions   │
│  - Processed image  │         └──────────────────────────┘
│  - Prediction cards │
└─────────────────────┘
```

---

## 🗂️ Project Structure

```
palmistry-app/
│
├── palmistry-backend/
│   ├── app.py              # Flask server + image processing logic
│   └── requirements.txt    # Python dependencies
│
├── palmistry-frontend/
│   ├── public/
│   └── src/
│       ├── App.js           # Root component + state management
│       └── components/
│           ├── Upload.js    # Image upload UI
│           └── Results.js   # Processed image + prediction cards
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm

---

### 1. Clone the Repository

```bash
git clone https://github.com/anirudhg-07/PalmOracle-Palmistry.git
cd palmistry-ai
```

---

### 2. Run the Backend

```bash
cd palmistry-backend
pip install -r requirements.txt
python app.py
```

Backend runs on **http://localhost:5000**

---

### 3. Run the Frontend

```bash
cd palmistry-frontend
npm install
npm start
```

Frontend runs on **http://localhost:3000**

---

## 📦 Dependencies

### Backend (`requirements.txt`)

```
flask
flask-cors
opencv-python
numpy
```

### Frontend

```
react
axios
```

---

## ⚙️ How It Works

1. User uploads a palm image via the React UI
2. Image is sent as a `multipart/form-data` POST request to `/analyze`
3. Flask receives the image and passes it to OpenCV
4. OpenCV converts to **grayscale** → applies **Canny edge detection**
5. Line density (ratio of edge pixels to total pixels) is calculated
6. A **rule-based system** maps density ranges to predictions
7. Processed image (base64) + predictions are returned as JSON
8. React renders the results on screen

---

## 🤖 AI Techniques Used

| Technique | Purpose |
|---|---|
| **Computer Vision** | Detect palm lines via edge detection |
| **Rule-Based System** | Map line patterns to personality predictions |
| **Randomization** | Add variation to generated prediction text |

> No deep learning or trained models are used — this project simulates AI behavior using classical image processing.

---

## 📸 Screenshots

> *(Add screenshots of your app here after building)*

| Upload Screen | Results Screen |
|---|---|
| ![upload](#) | ![results](#) |

---

## ⚠️ Limitations

- Predictions are not scientifically or astrologically accurate
- Accuracy depends on image quality and lighting
- Uses fixed rule thresholds, not a trained ML model

---

## 🔭 Future Enhancements

- [ ] Deep learning model for real palm line detection
- [ ] User login and prediction history
- [ ] Mobile-responsive design
- [ ] Multilingual support
- [ ] Confidence score for predictions

---

## 👨‍💻 Author

**G Anirudh**
SRM Institute of Science and Technology

---

## 📄 License

This project is licensed under the MIT License.
