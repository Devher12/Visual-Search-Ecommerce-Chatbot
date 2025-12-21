# Backend Dependencies Explanation

This document explains the major dependencies used in the backend application and why specific versions were chosen.

## Core Web Framework

### Flask (3.0.0)
- **Purpose**: Lightweight WSGI web framework for building REST API endpoints
- **Usage**: Main application framework, handles HTTP requests/responses, routing
- **Why this version**: Stable 3.0 release with improved async support and security updates
- **Major features used**: 
  - `Flask()` app initialization
  - `@app.route()` decorators
  - `request`, `jsonify` for handling requests/responses

### Flask-CORS (4.0.0)
- **Purpose**: Enables Cross-Origin Resource Sharing (CORS) for frontend-backend communication
- **Usage**: Allows React frontend (running on different port) to make API calls to Flask backend
- **Why this version**: Compatible with Flask 3.0, latest stable 4.x release
- **Critical for**: Preventing CORS errors when frontend calls backend API

### Flask-JWT-Extended (4.6.0)
- **Purpose**: JWT (JSON Web Token) authentication and authorization
- **Usage**: 
  - Secures API endpoints with `@jwt_required()` decorator
  - Creates access tokens on login
  - Validates tokens on protected routes
- **Why this version**: Latest stable 4.x, compatible with Flask 3.0
- **Security**: Handles token expiration, validation, and error responses

## Image Processing

### Pillow (10.1.0)
- **Purpose**: Python Imaging Library for image manipulation
- **Usage**: 
  - Processes uploaded images from multipart/form-data
  - Converts base64 strings to PIL Image objects
  - Converts images to RGB format
- **Why this version**: Latest stable release with security patches
- **File size**: ~10MB, essential for image handling

## Machine Learning & Deep Learning

### PyTorch (2.0.1)
- **Purpose**: Deep learning framework for neural networks
- **Usage**: 
  - Loads ResNet50 pretrained model
  - Generates 2048-dimensional image embeddings
  - Runs inference on CPU (no GPU required)
- **Why this version**: Stable 2.0.x release, compatible with torchvision 0.15.2
- **File size**: ~500MB (CPU-only version)
- **Note**: Can be upgraded to 2.1.1+ if needed, but requires matching torchvision version

### Torchvision (0.15.2)
- **Purpose**: Computer vision models and image preprocessing
- **Usage**: 
  - Provides `models.resnet50()` with ImageNet pretrained weights
  - Image transforms (Resize, CenterCrop, Normalize) matching ImageNet standards
- **Why this version**: Must match PyTorch 2.0.1 for compatibility
- **Critical for**: Loading ResNet50 model and preprocessing images correctly
- **Note**: Version must match torch version (e.g., torch 2.0.1 → torchvision 0.15.2)

### NumPy (1.26.4)
- **Purpose**: Fundamental package for numerical computing
- **Usage**: 
  - Array operations for embeddings
  - Required by both FAISS and PyTorch
  - Handles CID mapping arrays
- **Why this version**: Latest stable 1.26.x, compatible with all ML libraries
- **File size**: ~20MB
- **Note**: Core dependency - many packages depend on NumPy

## Similarity Search

### FAISS-CPU (1.7.4)
- **Purpose**: Facebook AI Similarity Search library for efficient vector search
- **Usage**: 
  - Performs fast similarity search on 2048-dimensional image embeddings
  - Uses L2 distance metric
  - Maps search results to product IDs
- **Why this version**: Latest stable CPU-only version (no GPU required)
- **File size**: ~50MB
- **Performance**: Can search millions of vectors in milliseconds
- **Note**: Requires NumPy, handles large-scale similarity search efficiently

## Database

### PyMongo (4.6.0)
- **Purpose**: Official MongoDB Python driver
- **Usage**: 
  - Connects to MongoDB database
  - Queries product collection for search results
  - Manages user authentication collection
- **Why this version**: Latest stable, includes connection pooling and async support
- **Configuration**: Requires `MONGO_URI` environment variable
- **Note**: Handles all database operations, no ORM needed

## Utilities

### Requests (2.31.0)
- **Purpose**: HTTP library for making web requests
- **Usage**: Downloads product images from Cloudinary URLs in `rebuild_faiss_index.py`
- **Why this version**: Latest stable with security updates
- **File size**: ~1MB
- **Note**: Only used in index rebuilding script, not in main API

### Python-Dotenv (1.0.0)
- **Purpose**: Loads environment variables from `.env` file
- **Usage**: Manages configuration (MongoDB URI, JWT secret, database names)
- **Why this version**: Latest stable, simple and reliable
- **File size**: <1MB
- **Security**: Keeps sensitive credentials out of code

## Production Server

### Gunicorn (21.2.0)
- **Purpose**: Production WSGI HTTP server for Unix
- **Usage**: Runs Flask app in production (Docker, Cloud Run, etc.)
- **Why this version**: Latest stable, production-ready
- **Note**: Optional for local development (use `flask run` instead), required for deployment
- **Configuration**: Used in Dockerfile with port binding

## Removed Dependencies

### ❌ scipy
- **Status**: Removed - Not imported or used anywhere in the codebase
- **Previous version**: Was listed but never used
- **Impact**: No functionality lost

### ❌ bcrypt
- **Status**: Removed - Not used; application uses `werkzeug.security` instead
- **Previous version**: Was listed but never imported
- **Alternative**: Flask's bundled `werkzeug.security` provides `generate_password_hash()` and `check_password_hash()`
- **Impact**: No functionality lost, using Flask's built-in security

## Version Compatibility Matrix

| Package | Version | Compatible With |
|---------|---------|----------------|
| Flask | 3.0.0 | Python 3.8+ |
| Flask-CORS | 4.0.0 | Flask 2.0+ |
| Flask-JWT-Extended | 4.6.0 | Flask 2.0+ |
| PyTorch | 2.0.1 | Python 3.8+, NumPy 1.21+ |
| Torchvision | 0.15.2 | PyTorch 2.0.1 |
| NumPy | 1.26.4 | Python 3.9+ |
| FAISS-CPU | 1.7.4 | NumPy 1.19+ |
| PyMongo | 4.6.0 | Python 3.7+ |

## Installation Notes

1. **PyTorch Installation**: For CPU-only builds (recommended for deployment):
   ```bash
   pip install torch==2.0.1 torchvision==0.15.2 --index-url https://download.pytorch.org/whl/cpu
   ```

2. **FAISS-CPU**: May require system libraries on some platforms:
   - Linux: Usually works out of the box
   - macOS: May need Homebrew libraries
   - Windows: Pre-built wheels available

3. **Virtual Environment**: Always use a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. **Production Deployment**: 
   - Use `gunicorn` for production (included in requirements)
   - Set environment variables via `.env` file or deployment platform
   - Ensure MongoDB connection is configured

## Total Installation Size

Approximate total size of all dependencies: **~600-700MB**
- PyTorch: ~500MB (largest dependency)
- NumPy: ~20MB
- FAISS-CPU: ~50MB
- Others: ~30MB combined

## Security Considerations

- All packages are pinned to specific versions for reproducibility
- Regular security updates should be reviewed and tested before upgrading
- Flask-JWT-Extended handles secure token generation and validation
- Werkzeug (bundled with Flask) provides secure password hashing
