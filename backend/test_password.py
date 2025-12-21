"""
Script to test common passwords against a hash.

This tries common passwords to see if any match the hash.
Note: This is a brute-force approach and may not find the password.
"""

import sys
from werkzeug.security import check_password_hash

# Fix Unicode encoding for Windows console
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

def test_password_hash():
    """Test common passwords against a hash."""
    if len(sys.argv) < 2:
        print("Usage: python test_password.py <hash>")
        print("\nExample:")
        print('  python test_password.py "scrypt:32768:8:1$..."')
        sys.exit(1)
    
    password_hash = sys.argv[1]
    
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
        # Empty
        '',
    ]
    
    print("=" * 60)
    print("Testing Common Passwords")
    print("=" * 60)
    print(f"\nHash: {password_hash[:50]}...")
    print("\nTrying common passwords...\n")
    
    found = False
    for password in common_passwords:
        try:
            if check_password_hash(password_hash, password):
                print(f"[MATCH FOUND!]")
                print(f"  Password: '{password}'")
                found = True
                break
        except Exception as e:
            continue
    
    if not found:
        print("X No match found with common passwords.")
        print("\nThe password is not in the common password list.")
        print("You'll need to reset the password instead.")
        print("\nTo reset password for user 'a':")
        print("  python manage_users.py reset a")
    
    print("=" * 60)

if __name__ == "__main__":
    test_password_hash()

