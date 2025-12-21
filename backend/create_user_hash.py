"""
Script to generate a password hash for creating users directly in MongoDB.

This generates the same password hash format that the Flask app uses.
"""

import sys
import os
from werkzeug.security import generate_password_hash

def create_password_hash():
    """Generate password hash for MongoDB user creation."""
    if len(sys.argv) < 3:
        print("Usage: python create_user_hash.py <username> <password>")
        print("\nExample:")
        print("  python create_user_hash.py admin admin123")
        sys.exit(1)
    
    username = sys.argv[1]
    password = sys.argv[2]
    
    # Generate hash using the same method as Flask app
    hashed_password = generate_password_hash(password)
    
    print("=" * 60)
    print("MongoDB User Document")
    print("=" * 60)
    print("\nCopy this JSON and paste it into MongoDB:")
    print("-" * 60)
    print("{")
    print(f'  "username": "{username}",')
    print(f'  "password": "{hashed_password}"')
    print("}")
    print("-" * 60)
    print("\nOr use this MongoDB insert command:")
    print("-" * 60)
    print(f'db.users.insertOne({{')
    print(f'  "username": "{username}",')
    print(f'  "password": "{hashed_password}"')
    print(f'}})')
    print("-" * 60)
    print(f"\nUser credentials:")
    print(f"   Username: {username}")
    print(f"   Password: {password}")
    print(f"   (Use these to login!)")

if __name__ == "__main__":
    create_password_hash()

