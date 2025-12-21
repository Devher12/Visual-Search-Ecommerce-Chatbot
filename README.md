# 🎯 Visual Product Search AI

**A full-stack AI-powered visual search application that enables users to find products using image similarity search powered by deep learning and vector similarity algorithms.**

This project demonstrates advanced computer vision techniques using ResNet50 CNN for feature extraction, FAISS for efficient similarity search, and a modern React-Flask architecture. The system processes product images to generate high-dimensional embeddings and performs real-time similarity matching to help users discover visually similar products from a database of thousands of items.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Live Demo](#live-demo)
- [Project Architecture](#project-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Mathematical Foundations](#mathematical-foundations)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [How to Run](#how-to-run)
- [API Endpoints](#api-endpoints)
- [Rebuilding the FAISS Index](#rebuilding-the-faiss-index)
- [Performance Metrics](#performance-metrics)
- [Future Enhancements](#future-enhancements)

---

## 🎯 Overview

**Visual Product Search AI** is an intelligent e-commerce search system that allows users to find products by uploading an image or entering text queries. The application leverages state-of-the-art deep learning models to extract visual features from images and performs efficient similarity search across a large product catalog.

### For Recruiters

This project showcases expertise in **deep learning, computer vision, and full-stack development**. It implements a production-ready visual search system using ResNet50 for feature extraction, FAISS for scalable similarity search, and modern web technologies (React, Flask) for the user interface. The system demonstrates understanding of **CNN architectures, vector embeddings, similarity metrics, and efficient indexing algorithms** for real-time search applications.

---

## ✨ Key Features

- 🔍 **Visual Similarity Search**: Upload an image to find visually similar products using deep learning embeddings
- 📝 **Text-Based Search**: Search products by keywords across multiple fields (title, category, material, etc.)
- 🎨 **Modern UI/UX**: Responsive React frontend with Tailwind CSS styling
- 🔐 **JWT Authentication**: Secure user authentication and session management
- ⚡ **High Performance**: FAISS-based vector search for sub-second query responses
- 📊 **Real-time Results**: Instant product recommendations with similarity scores
- 🖼️ **Image Processing**: Automatic image preprocessing and feature extraction
- 🗄️ **MongoDB Integration**: Scalable NoSQL database for product catalog management

---

## 🎬 Live Demo

### Application Screenshots

#### Login Page
The login page displays sign-in credentials for the authorised role to use the system.

![Login Page](screenshots/login.png)

#### Visual Search Interface
Users can upload an image or enter text queries to find similar products. The interface provides an intuitive drag-and-drop image upload area and a text search field.

![Visual Search Page](screenshots/home.png)

#### Search Results
After uploading an image or entering a query, the system displays matching products with similarity scores. Results are presented in a responsive grid layout showing product images and details.

![Search Results](screenshots/image.png)

#### Product Details
Clicking on a product card expands to show detailed information including category, material, closure type, and similarity percentage for visual search results.

![Product Details](screenshots/similar.png)

### Demo Features Showcased

- ✅ **Responsive Design**: Works seamlessly on desktop and mobile devices
- ✅ **Real-time Search**: Instant results with similarity scores
- ✅ **Image Upload**: Drag-and-drop or click to upload product images
- ✅ **Text Search**: Keyword-based search across product attributes
- ✅ **Similarity Scores**: Visual indication of match quality

---

## 🏗️ Project Architecture

### Visual Search Pipeline

The visual search system follows a sophisticated multi-stage pipeline:

```
User Image Upload
    ↓
Image Preprocessing (Resize, Normalize)
    ↓
ResNet50 Feature Extraction (2048-dim embedding)
    ↓
FAISS Vector Similarity Search (L2 Distance)
    ↓
Product Ranking & Filtering
    ↓
MongoDB Product Details Retrieval
    ↓
JSON Response with Similarity Scores
```

### 1. **Image Embedding Generation**

The system uses **ResNet50**, a 50-layer deep residual neural network pretrained on ImageNet, to extract high-dimensional feature vectors from product images.

**Process:**
- Input images are preprocessed to 224×224 pixels and normalized using ImageNet statistics
- The ResNet50 model (with classification layer removed) generates **2048-dimensional feature vectors**
- These embeddings capture visual patterns, textures, colors, and shapes that are semantically meaningful for similarity matching

**Mathematical Representation:**

For an input image $I$, the embedding $E$ is generated as:

$$E = \text{ResNet50}(I) \in \mathbb{R}^{2048}$$

where $E$ represents the feature vector capturing visual characteristics of the image.

### 2. **Vector Indexing with FAISS**

All product images are preprocessed and their embeddings are stored in a **FAISS (Facebook AI Similarity Search) index** for efficient similarity queries.

**Index Structure:**
- **Index Type**: Flat L2 (Euclidean distance)
- **Vector Dimension**: 2048 (ResNet50 output)
- **Index Size**: Supports thousands of product embeddings
- **Storage**: Binary format (`faiss_index.bin`) for fast loading

### 3. **Similarity Search Algorithm**

When a user uploads a query image, the system:

1. **Extracts embedding** from the query image using ResNet50
2. **Performs FAISS search** to find the $k$ nearest neighbors
3. **Calculates similarity scores** using distance metrics
4. **Retrieves product details** from MongoDB for matched products

**Distance Metrics:**

The system uses **L2 (Euclidean) distance** to measure similarity between embeddings:

$$d(\mathbf{q}, \mathbf{p}) = \sqrt{\sum_{i=1}^{2048} (q_i - p_i)^2}$$

where:
- $\mathbf{q}$ is the query embedding vector
- $\mathbf{p}$ is a product embedding vector
- Lower distance indicates higher similarity

**Similarity Score Conversion:**

Distance is converted to a similarity score (0-1 range) using:

$$\text{similarity} = \frac{1}{1 + d(\mathbf{q}, \mathbf{p})}$$

This ensures that:
- Distance = 0 → Similarity = 1.0 (identical)
- Distance → ∞ → Similarity → 0 (completely different)

**Alternative: Cosine Similarity**

For comparison, cosine similarity measures the angle between vectors:

$$\text{cos}(\theta) = \frac{\mathbf{A} \cdot \mathbf{B}}{\|\mathbf{A}\| \|\mathbf{B}\|} = \frac{\sum_{i=1}^{n} A_i B_i}{\sqrt{\sum_{i=1}^{n} A_i^2} \sqrt{\sum_{i=1}^{n} B_i^2}}$$

where:
- $\mathbf{A} \cdot \mathbf{B}$ is the dot product
- $\|\mathbf{A}\|$ and $\|\mathbf{B}\|$ are the L2 norms

### 4. **System Components**

```
┌─────────────────┐
│  React Frontend │  ← User Interface (Image Upload, Results Display)
└────────┬────────┘
         │ HTTP/REST
         ↓
┌─────────────────┐
│  Flask Backend  │  ← API Server (Request Handling, Authentication)
└────────┬────────┘
         │
    ┌────┴────┐
    ↓         ↓
┌─────────┐ ┌──────────────┐
│ ResNet50│ │  FAISS Index │  ← ML Components (Feature Extraction, Similarity Search)
└─────────┘ └──────┬───────┘
                   │
                   ↓
            ┌──────────────┐
            │   MongoDB    │  ← Database (Product Catalog, User Data)
            └──────────────┘
```

---

## 🛠️ Tech Stack

### **Backend**
- **Python 3.10+**: Core programming language
- **Flask 3.0.0**: Lightweight web framework for REST API
- **Flask-CORS 4.0.0**: Cross-origin resource sharing support
- **Flask-JWT-Extended 4.6.0**: JWT-based authentication
- **PyMongo 4.6.0**: MongoDB database driver

### **Machine Learning & Computer Vision**
- **PyTorch 2.0.1**: Deep learning framework
- **Torchvision 0.15.2**: Pre-trained models and image transforms
- **ResNet50**: 50-layer CNN for feature extraction (2048-dim embeddings)
- **FAISS-CPU 1.7.4**: Facebook AI Similarity Search library
- **NumPy 1.26.4**: Numerical computing and array operations
- **Pillow 10.1.0**: Image processing and manipulation

### **Frontend**
- **React 19.1.0**: UI library for building interactive interfaces
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **JWT-Decode**: JWT token parsing

### **Database & Storage**
- **MongoDB**: NoSQL database for product catalog and user data
- **FAISS Index**: Binary vector index for fast similarity search

### **DevOps & Tools**
- **Python-dotenv 1.0.0**: Environment variable management
- **Gunicorn 21.2.0**: Production WSGI server
- **Docker**: Containerization support

---

## 📁 Project Structure

```
Final_Project/
│
├── backend/                    # Flask API Server
│   ├── app.py                 # Main Flask application with API endpoints
│   ├── requirements.txt       # Python dependencies
│   ├── rebuild_faiss_index.py # Script to rebuild FAISS index from MongoDB
│   ├── manage_users.py        # User management utility
│   ├── Dockerfile             # Docker container configuration
│   └── DEPENDENCIES.md        # Detailed dependency documentation
│
├── frontend/                   # React Frontend Application
│   ├── src/
│   │   ├── App.jsx            # Main application component
│   │   ├── AuthContext.jsx    # Authentication context provider
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ProductCard.jsx
│   │   │   ├── Notification.jsx
│   │   │   └── ProductDetailModal.jsx
│   │   └── pages/             # Page components
│   │       ├── HomePage.jsx
│   │       ├── AuthPage.jsx
│   │       └── VisualSearchPage.jsx
│   ├── public/                # Static assets
│   └── package.json           # Node.js dependencies
│
├── models/                     # Machine Learning Modules
│   ├── feature_extraction.py  # ResNet50 model loading and feature extraction
│   ├── vector_index.py        # FAISS index management
│   ├── similarity_search.py   # Similarity search algorithms
│   ├── similarity_module.py   # Main ML interface (backward compatibility)
│   └── REFACTORING_NOTES.md   # ML code refactoring documentation
│
├── data/                       # Data Files (Git-ignored)
│   ├── faiss_index.bin        # FAISS vector index (large file)
│   └── cid_map.npy            # Product ID mapping array
│
├── docs/                       # Additional documentation
├── screenshots/                # Project screenshots
│
├── .env                        # Environment variables (Git-ignored)
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

---

## 📐 Mathematical Foundations

### **Euclidean Distance (L2 Norm)**

The primary distance metric used for similarity search:

$$d(\mathbf{x}, \mathbf{y}) = \sqrt{\sum_{i=1}^{n} (x_i - y_i)^2} = \|\mathbf{x} - \mathbf{y}\|_2$$

### **Cosine Similarity**

Alternative similarity measure based on vector angle:

$$\text{similarity} = \cos(\theta) = \frac{\mathbf{x} \cdot \mathbf{y}}{\|\mathbf{x}\| \|\mathbf{y}\|} = \frac{\sum_{i=1}^{n} x_i y_i}{\sqrt{\sum_{i=1}^{n} x_i^2} \sqrt{\sum_{i=1}^{n} y_i^2}}$$

### **Feature Vector Normalization**

Embeddings are normalized to unit vectors for consistent similarity calculations:

$$\hat{\mathbf{x}} = \frac{\mathbf{x}}{\|\mathbf{x}\|_2}$$

---

## 📋 Prerequisites

Before running the application, ensure you have:

- **Python 3.10+** installed
- **Node.js 16+** and **npm** installed
- **MongoDB** database (local or Atlas cloud)
- **Git** for version control

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Final_Project
```

### 2. Backend Setup

#### Create Virtual Environment

```bash
python -m venv venv

# On Windows
venv\Scripts\activate

# On macOS/Linux
source venv/bin/activate
```

#### Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

#### Configure Environment Variables

Create a `.env` file in the project root:

```env
# MongoDB Configuration
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGO_DB_NAME=zappos_products
MONGO_COLLECTION_NAME=products
MONGO_USERS_COLLECTION_NAME=users

# JWT Configuration
JWT_SECRET_KEY=your-secret-key-here-change-in-production
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

---

## ▶️ How to Run

### **Development Mode**

#### Start Backend Server

```bash
cd backend
python app.py
```

The Flask server will start on `http://localhost:5000`

#### Start Frontend Development Server

```bash
cd frontend
npm start
```

The React app will open at `http://localhost:3000`

### **Production Mode**

#### Backend (using Gunicorn)

```bash
cd backend
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

#### Frontend (build static files)

```bash
cd frontend
npm run build
# Serve the build/ directory with a web server
```

---

## 🔌 API Endpoints

### **Authentication**

- `POST /signup` - Register a new user
- `POST /login` - Authenticate and receive JWT token

### **Search**

- `POST /api/visual-search` - Visual similarity search (requires JWT)
  - **Request**: Multipart form with image file or JSON with base64 image
  - **Response**: Array of similar products with similarity scores
  - **Query Params**: `k` (number of results, default: 50)

- `POST /api/text-search` - Text-based product search (requires JWT)
  - **Request**: JSON with `query` field
  - **Response**: Array of matching products

### **Example Request (Visual Search)**

```bash
curl -X POST http://localhost:5000/api/visual-search \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@product_image.jpg" \
  -G -d "k=10"
```

---

## 🔄 Rebuilding the FAISS Index

To rebuild the FAISS index from MongoDB product data:

```bash
cd backend
python rebuild_faiss_index.py
```

This script:
1. Connects to MongoDB
2. Downloads product images
3. Generates embeddings using ResNet50
4. Builds and saves the FAISS index to `data/faiss_index.bin`
5. Saves product ID mapping to `data/cid_map.npy`

**Note**: This process may take time depending on the number of products.

---

## 📊 Performance Metrics

- **Feature Extraction**: ~50-100ms per image (CPU)
- **Similarity Search**: <10ms for 2850 products (FAISS)
- **End-to-End Query**: ~200-300ms (including image processing)
- **Index Size**: ~23MB for 2850 products (2048-dim vectors)

---

## 🔮 Future Enhancements

- [ ] GPU acceleration for faster feature extraction
- [ ] Advanced FAISS index types (IVF, HNSW) for larger datasets
- [ ] Multi-modal search (combine image + text queries)
- [ ] User preference learning and personalized recommendations
- [ ] Real-time index updates for new products
- [ ] Advanced filtering (price, category, brand)
- [ ] Image quality assessment and preprocessing
- [ ] A/B testing framework for model comparison


---

## 👤 Author

**Muhammad Humza Majeed**  
*Computer Science / Artificial Intelligence*

---

## 🙏 Acknowledgments

- **ResNet50**: Deep residual networks by Microsoft Research
- **FAISS**: Facebook AI Similarity Search library
- **ImageNet**: Large-scale image database for pretraining
- **MongoDB**: NoSQL database platform

---

**Built using Python, PyTorch, React, and Flask**
