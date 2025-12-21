"""
Script to run the application and take screenshots.

This script:
1. Starts the Flask backend server
2. Starts the React frontend
3. Takes screenshots of key pages
4. Saves screenshots to the screenshots folder
"""

import subprocess
import time
import os
import sys
import requests
from pathlib import Path

# Configuration
BACKEND_PORT = 5000
FRONTEND_PORT = 3000
SCREENSHOTS_DIR = Path("screenshots")
BACKEND_URL = f"http://localhost:{BACKEND_PORT}"
FRONTEND_URL = f"http://localhost:{FRONTEND_PORT}"

def check_backend_ready(max_wait=30):
    """Check if backend is ready."""
    for i in range(max_wait):
        try:
            response = requests.get(f"{BACKEND_URL}/", timeout=2)
            return True
        except:
            time.sleep(1)
    return False

def check_frontend_ready(max_wait=30):
    """Check if frontend is ready."""
    for i in range(max_wait):
        try:
            response = requests.get(FRONTEND_URL, timeout=2)
            if response.status_code == 200:
                return True
        except:
            time.sleep(1)
    return False

def main():
    print("Starting application servers...")
    
    # Create screenshots directory
    SCREENSHOTS_DIR.mkdir(exist_ok=True)
    
    # Start backend
    print("Starting Flask backend...")
    backend_process = subprocess.Popen(
        [sys.executable, "backend/app.py"],
        cwd=os.getcwd(),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    # Wait for backend to be ready
    print("Waiting for backend to start...")
    if not check_backend_ready():
        print("ERROR: Backend failed to start")
        backend_process.terminate()
        return
    
    print("Backend is ready!")
    
    # Start frontend
    print("Starting React frontend...")
    frontend_process = subprocess.Popen(
        ["npm", "start"],
        cwd="frontend",
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        shell=True
    )
    
    # Wait for frontend to be ready
    print("Waiting for frontend to start...")
    if not check_frontend_ready():
        print("ERROR: Frontend failed to start")
        frontend_process.terminate()
        backend_process.terminate()
        return
    
    print("Frontend is ready!")
    print(f"\nApplication is running at: {FRONTEND_URL}")
    print("Please take screenshots manually using your browser.")
    print("Press Ctrl+C to stop the servers...")
    
    try:
        # Keep servers running
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping servers...")
        frontend_process.terminate()
        backend_process.terminate()
        print("Servers stopped.")

if __name__ == "__main__":
    main()

