"""
Quick test script to verify MongoDB connection.
"""
import os
import sys
from dotenv import load_dotenv

# Load .env from project root
project_root = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(project_root, '.env')

print(f"Loading .env from: {env_path}")
print(f"File exists: {os.path.exists(env_path)}")

# Try multiple ways to load
load_dotenv(dotenv_path=env_path, override=True)
load_dotenv(override=True)

# Check MONGO_URI
mongo_uri = os.getenv('MONGO_URI')
print(f"\nMONGO_URI found: {bool(mongo_uri)}")
if mongo_uri:
    print(f"MONGO_URI (first 50 chars): {mongo_uri[:50]}...")
    
    # Try to connect
    try:
        sys.path.append(os.path.join(project_root, 'backend'))
        from models import similarity_module as similarity
        
        users_collection = similarity.get_users_collection()
        if users_collection:
            print("\n✓ MongoDB connection successful!")
            print(f"Database: {similarity.MONGO_DB_NAME}")
            print(f"Users collection: {similarity.MONGO_USERS_COLLECTION_NAME}")
            
            # List users
            users = users_collection.find({}, {"username": 1})
            user_list = list(users)
            if user_list:
                print(f"\nFound {len(user_list)} user(s):")
                for user in user_list:
                    print(f"  - {user['username']}")
            else:
                print("\nNo users found. You can create one with:")
                print("  python backend/manage_users.py create testuser testpass123")
        else:
            print("\n✗ Failed to connect to MongoDB")
    except Exception as e:
        print(f"\n✗ Error: {e}")
else:
    print("\n✗ MONGO_URI not found in environment")
    print("\nPlease check your .env file contains:")
    print("MONGO_URI=mongodb+srv://username:password@cluster...")

