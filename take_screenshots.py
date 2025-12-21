"""
Script to take screenshots of the running application.

This script uses Selenium to automate browser and take screenshots.
Make sure the backend and frontend servers are running before executing this script.
"""

import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from pathlib import Path

# Configuration
FRONTEND_URL = "http://localhost:3000"
SCREENSHOTS_DIR = Path("screenshots")
SCREENSHOTS_DIR.mkdir(exist_ok=True)

def setup_driver():
    """Setup Chrome WebDriver with options."""
    chrome_options = Options()
    chrome_options.add_argument("--headless")  # Run in background
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")
    
    try:
        driver = webdriver.Chrome(options=chrome_options)
        return driver
    except Exception as e:
        print(f"Error setting up Chrome driver: {e}")
        print("Make sure ChromeDriver is installed and in PATH")
        return None

def take_screenshot(driver, url, filename, wait_selector=None, wait_time=5):
    """Navigate to URL and take screenshot."""
    try:
        print(f"Navigating to {url}...")
        driver.get(url)
        
        # Wait for page to load
        if wait_selector:
            try:
                WebDriverWait(driver, wait_time).until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, wait_selector))
                )
            except:
                print(f"Warning: Element {wait_selector} not found, proceeding anyway...")
        
        time.sleep(2)  # Additional wait for animations
        
        screenshot_path = SCREENSHOTS_DIR / filename
        driver.save_screenshot(str(screenshot_path))
        print(f"Screenshot saved: {screenshot_path}")
        return True
    except Exception as e:
        print(f"Error taking screenshot of {url}: {e}")
        return False

def main():
    """Main function to take all screenshots."""
    print("Setting up browser...")
    driver = setup_driver()
    
    if not driver:
        print("Failed to setup browser. Please install ChromeDriver.")
        print("Alternative: Use browser MCP tools or take screenshots manually.")
        return
    
    try:
        # Screenshot 1: Login/Auth Page
        print("\n=== Taking screenshot: Auth Page ===")
        take_screenshot(
            driver,
            FRONTEND_URL,
            "01_auth_page.png",
            wait_selector=".auth-container"
        )
        
        # Note: For other pages, you would need to:
        # 1. Login first (interact with form)
        # 2. Navigate to other pages
        # This requires more complex automation
        
        print("\n=== Screenshots completed ===")
        print(f"Screenshots saved in: {SCREENSHOTS_DIR.absolute()}")
        
    except Exception as e:
        print(f"Error during screenshot process: {e}")
    finally:
        driver.quit()
        print("Browser closed.")

if __name__ == "__main__":
    print("=" * 50)
    print("Screenshot Automation Script")
    print("=" * 50)
    print("\nNOTE: Make sure both servers are running:")
    print("  - Backend: http://localhost:5000")
    print("  - Frontend: http://localhost:3000")
    print("\nStarting screenshot process...\n")
    
    main()

