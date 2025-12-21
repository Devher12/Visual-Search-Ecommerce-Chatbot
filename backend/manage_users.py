"""
User management utility script.

This script helps manage user accounts:
- List all registered users
- Reset a user's password
- Create a new test user
- Delete a user account

Usage:
    python manage_users.py list                    # List all users
    python manage_users.py reset <username>        # Reset password for user
    python manage_users.py create <username> <pwd> # Create new user
    python manage_users.py delete <username>      # Delete user
"""

import os
import sys
import getpass

from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv

# Add parent directory to path
project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_root)

# Load environment variables from project root FIRST (before importing similarity_module)
env_path = os.path.join(project_root, '.env')
if os.path.exists(env_path):
    load_dotenv(dotenv_path=env_path, override=True)
else:
    # Try loading from current directory and parent
    load_dotenv(override=True)
    load_dotenv(dotenv_path='../.env', override=True)

# Now import similarity_module (which also loads .env, but we've already loaded it)
from models import similarity_module as similarity

# Verify MONGO_URI is loaded
if not os.getenv('MONGO_URI'):
    print(f"WARNING: MONGO_URI not found. Checked: {env_path}")
    print(f"Current working directory: {os.getcwd()}")
    print(f"Project root: {project_root}")
    sys.exit(1)


def list_users():
    """List all registered users (usernames only, no passwords)."""
    try:
        users_collection = similarity.get_users_collection()
        if users_collection is None:
            print("ERROR: Cannot connect to MongoDB users collection.")
            return

        users = users_collection.find({}, {"username": 1, "_id": 0})
        user_list = list(users)

        if not user_list:
            print("No users found in database.")
        else:
            print(f"\nFound {len(user_list)} user(s):")
            print("-" * 50)
            for i, user in enumerate(user_list, 1):
                print(f"{i}. {user['username']}")
            print("-" * 50)

    except Exception as error:
        print(f"ERROR: {error}")


def reset_password(username):
    """Reset password for a user."""
    try:
        users_collection = similarity.get_users_collection()
        if users_collection is None:
            print("ERROR: Cannot connect to MongoDB users collection.")
            return

        # Check if user exists
        user = users_collection.find_one({"username": username})
        if not user:
            print(f"ERROR: User '{username}' not found.")
            return

        # Get new password
        print(f"\nResetting password for user: {username}")
        new_password = getpass.getpass("Enter new password: ")
        confirm_password = getpass.getpass("Confirm new password: ")

        if new_password != confirm_password:
            print("ERROR: Passwords do not match.")
            return

        if not new_password:
            print("ERROR: Password cannot be empty.")
            return

        # Update password
        hashed_password = generate_password_hash(new_password)
        users_collection.update_one(
            {"username": username},
            {"$set": {"password": hashed_password}}
        )

        print(f"✓ Password reset successfully for user '{username}'")

    except Exception as error:
        print(f"ERROR: {error}")


def create_user(username, password=None):
    """Create a new user account."""
    try:
        users_collection = similarity.get_users_collection()
        if users_collection is None:
            print("ERROR: Cannot connect to MongoDB users collection.")
            return

        # Check if user already exists
        if users_collection.find_one({"username": username}):
            print(f"ERROR: User '{username}' already exists.")
            return

        # Get password if not provided
        if not password:
            password = getpass.getpass("Enter password: ")
            confirm_password = getpass.getpass("Confirm password: ")

            if password != confirm_password:
                print("ERROR: Passwords do not match.")
                return

        if not password:
            print("ERROR: Password cannot be empty.")
            return

        # Create user
        hashed_password = generate_password_hash(password)
        users_collection.insert_one({
            "username": username,
            "password": hashed_password
        })

        print(f"✓ User '{username}' created successfully")
        print(f"  Username: {username}")
        print(f"  Password: {'*' * len(password)}")

    except Exception as error:
        print(f"ERROR: {error}")


def delete_user(username):
    """Delete a user account."""
    try:
        users_collection = similarity.get_users_collection()
        if users_collection is None:
            print("ERROR: Cannot connect to MongoDB users collection.")
            return

        # Check if user exists
        user = users_collection.find_one({"username": username})
        if not user:
            print(f"ERROR: User '{username}' not found.")
            return

        # Confirm deletion
        confirm = input(f"Are you sure you want to delete user '{username}'? (yes/no): ")
        if confirm.lower() != 'yes':
            print("Deletion cancelled.")
            return

        # Delete user
        users_collection.delete_one({"username": username})
        print(f"✓ User '{username}' deleted successfully")

    except Exception as error:
        print(f"ERROR: {error}")


def main():
    """Main function to handle command line arguments."""
    if len(sys.argv) < 2:
        print(__doc__)
        return

    command = sys.argv[1].lower()

    if command == "list":
        list_users()

    elif command == "reset":
        if len(sys.argv) < 3:
            print("ERROR: Please provide username.")
            print("Usage: python manage_users.py reset <username>")
            return
        reset_password(sys.argv[2])

    elif command == "create":
        if len(sys.argv) < 3:
            print("ERROR: Please provide username.")
            print("Usage: python manage_users.py create <username> [password]")
            return
        password = sys.argv[3] if len(sys.argv) > 3 else None
        create_user(sys.argv[2], password)

    elif command == "delete":
        if len(sys.argv) < 3:
            print("ERROR: Please provide username.")
            print("Usage: python manage_users.py delete <username>")
            return
        delete_user(sys.argv[2])

    else:
        print(f"ERROR: Unknown command '{command}'")
        print(__doc__)


if __name__ == "__main__":
    print("=" * 50)
    print("User Management Utility")
    print("=" * 50)
    main()

