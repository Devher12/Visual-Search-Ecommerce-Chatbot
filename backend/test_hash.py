"""
Test a specific password hash against common passwords.
"""

import sys
from werkzeug.security import check_password_hash

# Fix Unicode encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

# The hash you provided
PASSWORD_HASH = "scrypt:32768:8:1$2tC1GdF0M78MLVf8$2e5ac37159a2e11474682ca8619b3c4ef9c58165b9348760d225c719ddf38be95a0006e074b1385ae2cd1489b664b7fe1afb3778e23ab0aaf229ee94f6ea7a9b"

# Extended list of common passwords
COMMON_PASSWORDS = [
    # Single characters
    'a', 'A', '1', '0', 'b', 'B', 'c', 'C',
    # Common short passwords
    '123', '1234', '12345', '123456', '1234567', '12345678',
    'password', 'Password', 'PASSWORD', 'pass', 'Pass',
    'test', 'Test', 'TEST', 'testing',
    'admin', 'Admin', 'ADMIN', 'administrator',
    'user', 'User', 'USER', 'username',
    # Common patterns
    'abc', 'abc123', 'password123', 'test123', 'admin123',
    'qwerty', 'qwerty123', 'letmein', 'welcome',
    # Common variations
    'password1', 'Password1', 'admin1', 'test1',
    '123456a', 'a123456', 'password12',
    # Empty
    '',
]

def test_hash():
    """Test the hash against common passwords."""
    print("=" * 60)
    print("Testing Password Hash")
    print("=" * 60)
    print(f"\nHash: {PASSWORD_HASH[:50]}...")
    print("\nTesting common passwords...\n")
    
    found = False
    for password in COMMON_PASSWORDS:
        try:
            if check_password_hash(PASSWORD_HASH, password):
                print(f"[MATCH FOUND!]")
                print(f"  Password: '{password}'")
                found = True
                break
        except Exception as e:
            continue
    
    if not found:
        print("X No match found with common passwords.")
        print("\nThe password is not in the common password list.")
        print("You'll need to reset the password using:")
        print("  python manage_users.py reset a")
    
    print("=" * 60)

if __name__ == "__main__":
    test_hash()

