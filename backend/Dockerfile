FROM python:3.10-slim-buster

WORKDIR /app

# Install system dependencies needed for PyTorch, Pillow, etc.
# build-essential and gfortran are crucial for compiling some Python package dependencies
# libffi-dev is needed for bcrypt (dependency of PyNaCl which bcrypt uses)
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    build-essential \
    gfortran \
    libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements.txt and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu

# Copy FAISS index and CID map.
# IMPORTANT: Ensure 'faiss_index.bin' and 'cid_map.npy' are in the same directory
# as your Dockerfile.
COPY faiss_index.bin .
COPY cid_map.npy .

# Copy your application code
COPY similarity_module.py .
COPY app.py .

# Cloud Run expects the application to listen on the port defined by the PORT environment variable.
# Default is 8080.
ENV PORT 8080
ENV KMP_DUPLICATE_LIB_OK=TRUE # Essential for PyTorch on some systems

# Command to run the Flask application using Gunicorn
# Using the shell form to ensure $PORT environment variable is expanded.
CMD gunicorn --bind 0.0.0.0:$PORT app:app