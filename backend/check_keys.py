import os
from dotenv import load_dotenv

load_dotenv()

openai_key = os.getenv("OPENAI_API_KEY")
sarvam_key = os.getenv("SARVAM_API_KEY")
google_key = os.getenv("GOOGLE_API_KEY")

print(f"OPENAI_API_KEY present: {bool(openai_key)}")
print(f"SARVAM_API_KEY present: {bool(sarvam_key)}")
print(f"GOOGLE_API_KEY present: {bool(google_key)}")
