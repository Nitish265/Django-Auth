export const djangoCodeFiles = [
  {
    id: "env",
    title: "Environment Variables (.env)",
    description: "Configuration file with all secrets and settings",
    language: "bash",
    code: `SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=*
MYSQL_NAME=your_db_name
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=myappdb
OTP_LENGTH=6
OTP_COOLDOWN_SECONDS=120
OTP_TTL_SECONDS=600
TOKEN_INACTIVITY_TTL_SECONDS=864000
LOGIN_LOCK_MINUTES=10
MAX_FAILED_LOGINS=10`
  },
  {
    id: "settings",
    title: "Django Settings (core/settings.py)",
    description: "Complete Django configuration with MongoDB + MySQL dual database setup",
    language: "python",
    code: `# core/core/settings.py
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
DEBUG = os.getenv("DEBUG", "True") == "True"
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "*").split(",")

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",   # Needed for hashers and admin
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "accounts",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",  # DRF doesn't need sessions, but Django admin does
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",  # For browsable API; for pure APIs you can disable CSRF on views
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core.urls"
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {"context_processors": [
            "django.template.context_processors.debug",
            "django.template.context_processors.request",
            "django.contrib.auth.context_processors.auth",
            "django.contrib.messages.context_processors.messages",
        ]},
    },
]
WSGI_APPLICATION = "core.wsgi.application"

# MySQL for Django internal use (not for app data)
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": os.getenv("MYSQL_NAME"),
        "USER": os.getenv("MYSQL_USER"),
        "PASSWORD": os.getenv("MYSQL_PASSWORD"),
        "HOST": os.getenv("MYSQL_HOST", "127.0.0.1"),
        "PORT": os.getenv("MYSQL_PORT", "3306"),
        "OPTIONS": {"charset": "utf8mb4"},
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# DRF: use our custom Mongo token authentication
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "accounts.authentication.MongoTokenAuthentication",
    ]
}

# Our Mongo config passed to the app
MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "myappdb")

# App-level constants (fallbacks if .env missing)
OTP_LENGTH = int(os.getenv("OTP_LENGTH", "6"))
OTP_COOLDOWN_SECONDS = int(os.getenv("OTP_COOLDOWN_SECONDS", "120"))
OTP_TTL_SECONDS = int(os.getenv("OTP_TTL_SECONDS", "600"))
TOKEN_INACTIVITY_TTL_SECONDS = int(os.getenv("TOKEN_INACTIVITY_TTL_SECONDS", "864000"))  # 10 days
LOGIN_LOCK_MINUTES = int(os.getenv("LOGIN_LOCK_MINUTES", "10"))
MAX_FAILED_LOGINS = int(os.getenv("MAX_FAILED_LOGINS", "10"))`
  },
  {
    id: "apps",
    title: "App Configuration (accounts/apps.py)",
    description: "Runs when Django starts and ensures MongoDB indexes are created",
    language: "python",
    code: `# core/accounts/apps.py
from django.apps import AppConfig

class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "accounts"

    def ready(self):
        # When the app starts, ensure MongoDB indexes exist.
        from .indexes import ensure_mongo_indexes
        ensure_mongo_indexes()`
  },
  {
    id: "mongo",
    title: "MongoDB Connection (accounts/mongo.py)",
    description: "Creates a global MongoDB client and exposes collection handles",
    language: "python",
    code: `# core/accounts/mongo.py
from django.conf import settings
from pymongo import MongoClient

# Create a global Mongo client once
_client = MongoClient(settings.MONGO_URI)
db = _client[settings.MONGO_DB_NAME]

# Our collections (like tables)
users_col = db["users"]
otps_col = db["otps"]
tokens_col = db["tokens"]
deleted_users_col = db["deleted_users"]`
  },
  {
    id: "indexes",
    title: "MongoDB Indexes (accounts/indexes.py)",
    description: "Creates unique constraints and TTL indexes for automatic cleanup",
    language: "python",
    code: `# core/accounts/indexes.py
from datetime import timedelta
from pymongo import ASCENDING
from django.conf import settings
from .mongo import users_col, otps_col, tokens_col, deleted_users_col

def ensure_mongo_indexes():
    # USERS
    # Unique constraints so duplicates can't be inserted
    users_col.create_index([("username", ASCENDING)], unique=True, name="uniq_username")
    users_col.create_index([("email", ASCENDING)], unique=True, name="uniq_email")
    users_col.create_index([("phone", ASCENDING)], unique=True, name="uniq_phone")

    # TTL to delete UNVERIFIED users after 10 minutes:
    # We set a field "delete_at" only for unverified users; when verified, we unset it.
    # expireAfterSeconds=0 means delete exactly at the time in delete_at.
    users_col.create_index([("delete_at", ASCENDING)], expireAfterSeconds=0, name="ttl_unverified_delete")

    # OTPS
    # Ensure one OTP per user per type (signup or password_reset)
    otps_col.create_index([("user_id", ASCENDING), ("otp_type", ASCENDING)], unique=True, name="uniq_user_type")
    # Auto-delete OTPs after OTP_TTL_SECONDS (e.g., 600 seconds = 10 minutes)
    otps_col.create_index([("created_at", ASCENDING)], expireAfterSeconds=settings.OTP_TTL_SECONDS, name="ttl_otp")

    # TOKENS
    # Token strings must be unique
    tokens_col.create_index([("token", ASCENDING)], unique=True, name="uniq_token")
    # Auto-delete tokens after X seconds of no activity (we update last_activity on every request)
    tokens_col.create_index([("last_activity", ASCENDING)], expireAfterSeconds=settings.TOKEN_INACTIVITY_TTL_SECONDS, name="ttl_token_inactivity")

    # DELETED_USERS: no special index required, but you could add on username/email/phone for admin lookups`
  },
  {
    id: "security",
    title: "Security Utilities (accounts/utils/security.py)",
    description: "Password hashing, token generation, and OTP security functions",
    language: "python",
    code: `# core/accounts/utils/security.py
import secrets
import hmac
import hashlib
from django.contrib.auth.hashers import make_password, check_password
from django.conf import settings

def hash_password(raw_password: str) -> str:
    # Uses Django's secure password hashing (PBKDF2 by default)
    return make_password(raw_password)

def verify_password(raw_password: str, hashed_password: str) -> bool:
    return check_password(raw_password, hashed_password)

def generate_token() -> str:
    # A random, URL-safe token string. Treat it like a password.
    return secrets.token_urlsafe(32)

def hash_otp(code: str) -> str:
    # We hash OTP with HMAC-SHA256 so even if DB is leaked, OTPs aren't readable
    secret = settings.SECRET_KEY.encode("utf-8")
    return hmac.new(secret, code.encode("utf-8"), hashlib.sha256).hexdigest()

def constant_time_compare(a: str, b: str) -> bool:
    # Compare in constant time to avoid timing attacks
    return hmac.compare_digest(a, b)`
  },
  {
    id: "otp",
    title: "OTP Generator (accounts/utils/otp.py)",
    description: "Generates secure numeric OTP codes",
    language: "python",
    code: `# core/accounts/utils/otp.py
import random
from django.conf import settings

def generate_otp(length: int = None) -> str:
    # Example: "123456" (always numeric, easier for users)
    length = length or settings.OTP_LENGTH
    return "".join(str(random.randint(0, 9)) for _ in range(length))`
  },
  {
    id: "senders",
    title: "Message Senders (accounts/utils/senders.py)",
    description: "Email and SMS sending utilities (placeholder implementations)",
    language: "python",
    code: `# core/accounts/utils/senders.py
# These are simple placeholders. Replace with real email/SMS providers in production.

def send_email(to_email: str, subject: str, body: str):
    # Replace with: SendGrid / SES / SMTP
    print(f"[EMAIL to {to_email}] {subject}\\n{body}")

def send_sms(to_phone: str, body: str):
    # Replace with: Twilio / other SMS provider
    print(f"[SMS to {to_phone}] {body}")`
  }
];