from passlib.context import CryptContext
try:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    hash = pwd_context.hash("secret")
    print(f"Hash success: {hash}")
    verify = pwd_context.verify("secret", hash)
    print(f"Verify success: {verify}")
except Exception as e:
    print(f"Error: {e}")
