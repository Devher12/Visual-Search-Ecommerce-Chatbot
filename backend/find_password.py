"""
Script to find the password for a user by testing against their hash.

This script connects to MongoDB and tests common passwords for a given username.
"""

import sys
import os
from werkzeug.security import check_password_hash
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables from project root
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env_path = os.path.join(project_root, '.env')
load_dotenv(dotenv_path=env_path)

# Fix Unicode encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def find_user_password(username):
    """Find password for a user by testing common passwords."""
    mongo_uri = os.getenv('MONGO_URI')
    if not mongo_uri:
        print("ERROR: MONGO_URI environment variable not set.")
        print("Please check your .env file.")
        sys.exit(1)
    
    try:
        client = MongoClient(mongo_uri)
        # Get database name from URI or use default
        from urllib.parse import urlparse
        parsed_uri = urlparse(mongo_uri)
        db_name = parsed_uri.path.strip('/') if parsed_uri.path.strip('/') else 'test'
        if not db_name:
            db_name = 'test'
        db = client[db_name]
        users_collection = db.users
        
        user = users_collection.find_one({"username": username})
        
        if not user:
            print(f"User '{username}' not found in database.")
            print("\nAvailable usernames:")
            all_users = users_collection.find({}, {"username": 1})
            for u in all_users:
                print(f"  - {u.get('username', 'N/A')}")
            sys.exit(1)
        
        password_hash = user.get('password')
        if not password_hash:
            print(f"User '{username}' has no password hash.")
            sys.exit(1)
        
        print("=" * 60)
        print(f"Finding Password for User: {username}")
        print("=" * 60)
        print(f"\nHash: {password_hash[:50]}...")
        print("\nTesting common passwords...\n")
        
        # Common passwords to try
        common_passwords = [
            # Single characters
            'a', 'A', '1', '0',
            # Common short passwords
            '123', '1234', '12345', '123456',
            'password', 'Password', 'PASSWORD',
            'test', 'Test', 'TEST',
            'admin', 'Admin', 'ADMIN',
            'user', 'User', 'USER',
            # Common patterns
            'abc', 'abc123', 'password123',
            'test123', 'admin123',
            # Username-based
            username, username.lower(), username.upper(),
            username + '123', username + '1',
            # Empty
            '',
        ]
        
        found = False
        for password in common_passwords:
            try:
                if check_password_hash(password_hash, password):
                    print(f"[MATCH FOUND!]")
                    print(f"  Username: '{username}'")
                    print(f"  Password: '{password}'")
                    found = True
                    break
            except Exception as e:
                continue
        
        if not found:
            print("X No match found with common passwords.")
            print("\nThe password is not in the common password list.")
            print("You'll need to reset the password instead.")
            print(f"\nTo reset password for user '{username}':")
            print(f"  python manage_users.py reset {username}")
        
        print("=" * 60)
        
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python find_password.py <username>")
        print("\nExample:")
        print("  python find_password.py a")
        sys.exit(1)
    
    username = sys.argv[1]
    find_user_password(username)

