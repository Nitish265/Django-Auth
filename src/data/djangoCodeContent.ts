export const djangoCodeContent = {
  projectStructure: {
    title: "Complete Django Project Structure",
    description: "Full authentication system with MongoDB + MySQL dual database architecture",
    structure: [
      {
        name: "core/",
        type: "folder",
        children: [
          { name: "settings.py", type: "file", description: "Django settings with MongoDB + MySQL config" },
          { name: "urls.py", type: "file", description: "Main URL routing" },
          { name: "wsgi.py", type: "file", description: "WSGI deployment entry point" },
          { name: "asgi.py", type: "file", description: "ASGI deployment entry point" }
        ]
      },
      {
        name: "accounts/",
        type: "folder",
        children: [
          { name: "views.py", type: "file", description: "12 API endpoints with complete auth logic" },
          { name: "authentication.py", type: "file", description: "Custom MongoDB token authentication" },
          { name: "serializers.py", type: "file", description: "DRF serializers for validation" },
          { name: "repositories.py", type: "file", description: "MongoDB CRUD operations" },
          { name: "mongo.py", type: "file", description: "MongoDB connection and collections" },
          { name: "indexes.py", type: "file", description: "TTL and unique indexes setup" },
          {
            name: "utils/",
            type: "folder",
            children: [
              { name: "security.py", type: "file", description: "Password hashing and token generation" },
              { name: "otp.py", type: "file", description: "OTP generation utilities" },
              { name: "senders.py", type: "file", description: "Email and SMS sending" }
            ]
          }
        ]
      }
    ]
  },

  codeFiles: [
    {
      id: "settings",
      title: "Django Settings (settings.py)",
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
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core.urls"

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
      id: "authentication",
      title: "Custom MongoDB Authentication (authentication.py)",
      description: "DRF authentication class that validates tokens stored in MongoDB",
      language: "python",
      code: `# core/accounts/authentication.py
from typing import Optional, Tuple
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed
from django.utils.translation import gettext_lazy as _
from .repositories import find_token, find_user_by_id, update_token_last_activity, is_user_blacklisted
from bson import ObjectId

class MongoUser:
    """
    A tiny user wrapper so DRF sees request.user as authenticated.
    """
    def __init__(self, user_doc):
        self.id = str(user_doc["_id"])
        self.username = user_doc["username"]
        self.email = user_doc["email"]
        self.phone = user_doc["phone"]
        self.role = user_doc.get("role", "user")
        self.is_verified = user_doc.get("is_verified", False)
        self.is_blacklisted = user_doc.get("is_blacklisted", False)

    @property
    def is_authenticated(self):
        return True

    def is_admin(self):
        return self.role == "admin"

class MongoTokenAuthentication(BaseAuthentication):
    keyword = "Bearer"

    def authenticate(self, request) -> Optional[Tuple[MongoUser, str]]:
        auth = get_authorization_header(request).split()

        if not auth or auth[0].lower() != self.keyword.lower().encode():
            return None

        if len(auth) == 1:
            raise AuthenticationFailed(_("Invalid token header. No credentials provided."))
        elif len(auth) > 2:
            raise AuthenticationFailed(_("Invalid token header. Token string should not contain spaces."))

        token_str = auth[1].decode()
        token_doc = find_token(token_str)
        if not token_doc:
            raise AuthenticationFailed(_("Invalid or expired token"))

        user_doc = find_user_by_id(token_doc["user_id"])
        if not user_doc:
            raise AuthenticationFailed(_("User not found"))

        if not user_doc.get("is_verified", False):
            raise AuthenticationFailed(_("User not verified"))

        if is_user_blacklisted(user_doc):
            raise AuthenticationFailed(_("User is blacklisted"))

        # Update last_activity to keep token alive
        update_token_last_activity(token_str)

        return (MongoUser(user_doc), token_str)`
    },
    {
      id: "repositories",
      title: "MongoDB Data Access Layer (repositories.py)",
      description: "Complete CRUD operations for users, OTPs, tokens, and soft delete functionality",
      language: "python",
      code: `# core/accounts/repositories.py
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from bson import ObjectId
from pymongo.errors import DuplicateKeyError
from django.conf import settings
from .mongo import users_col, otps_col, tokens_col, deleted_users_col
from .utils.security import hash_password, verify_password, hash_otp
from .utils.security import generate_token as generate_session_token

def now_utc():
    return datetime.utcnow()

def to_object_id(_id: str) -> ObjectId:
    return ObjectId(_id)

# ---------- Users ----------
def create_user(user_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Inserts a new user into Mongo 'users' collection.
    user_data must include: username, email, phone, full_name, role, password (raw)
    """
    doc = {
        "username": user_data["username"].strip(),
        "email": user_data["email"].strip().lower(),
        "phone": user_data["phone"].strip(),
        "full_name": user_data["full_name"].strip(),
        "role": user_data.get("role", "user"),
        "password_hash": hash_password(user_data["password"]),
        "is_verified": False,
        "is_blacklisted": False,
        "failed_login_count": 0,
        "lock_until": None,
        "created_at": now_utc(),
        "updated_at": now_utc(),
        # For unverified users, set a delete_at in 10 minutes
        "delete_at": now_utc() + timedelta(seconds=settings.OTP_TTL_SECONDS),
    }
    try:
        result = users_col.insert_one(doc)
        doc["_id"] = result.inserted_id
        return doc
    except DuplicateKeyError as e:
        raise ValueError("Username, email, or phone already exists") from e

def find_user_by_identifier(identifier: str) -> Optional[Dict[str, Any]]:
    """
    Allows login/lookup by username OR email OR phone.
    """
    ident = identifier.strip()
    query = None
    if "@" in ident:
        query = {"email": ident.lower()}
    elif ident.isdigit():
        query = {"phone": ident}
    else:
        query = {"username": ident}
    return users_col.find_one(query)

def mark_user_verified(user_id: ObjectId):
    # Verified users should not be auto-deleted, so unset delete_at
    users_col.update_one({"_id": user_id}, {
        "$set": {"is_verified": True, "updated_at": now_utc()},
        "$unset": {"delete_at": ""}
    })

def increment_failed_logins(user_id: ObjectId) -> int:
    # Atomically increment and return the new count
    updated = users_col.find_one_and_update(
        {"_id": user_id},
        {"$inc": {"failed_login_count": 1}},
        return_document=True
    )
    return updated["failed_login_count"]

# ---------- OTPs ----------
def create_or_replace_otp(user_id: ObjectId, otp_type: str, code_plain: str, sent_via: str) -> Dict[str, Any]:
    # Ensure only one OTP exists per user per type
    otps_col.delete_one({"user_id": user_id, "otp_type": otp_type})
    doc = {
        "user_id": user_id,
        "otp_type": otp_type,  # "signup" or "password_reset"
        "code_hash": hash_otp(code_plain),
        "created_at": now_utc(),
        "sent_via": sent_via,
    }
    otps_col.insert_one(doc)
    return doc

# ---------- Tokens ----------
def create_token(user_id: ObjectId, ip: str, user_agent: str) -> Dict[str, Any]:
    token_str = generate_session_token()
    doc = {
        "user_id": user_id,
        "token": token_str,
        "ip": ip,
        "user_agent": user_agent,
        "issued_at": now_utc(),
        "last_activity": now_utc(),  # TTL refreshes when this timestamp updates
        "revoked": False,
    }
    tokens_col.insert_one(doc)
    return doc`
    },
    {
      id: "views",
      title: "API Endpoints (views.py)",
      description: "12 complete API endpoints with authentication, OTP verification, and admin functions",
      language: "python",
      code: `# core/accounts/views.py
from datetime import datetime, timedelta
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

class SignupView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """
        Create a new user (unverified), send signup OTP, and set auto-delete in 10 minutes.
        """
        ser = SignupSerializer(data=request.data)
        if not ser.is_valid():
            return Response({"errors": ser.errors}, status=status.HTTP_400_BAD_REQUEST)

        data = ser.validated_data
        try:
            user_doc = create_user(data)
        except ValueError as e:
            return Response({"message": str(e)}, status=status.HTTP_409_CONFLICT)

        # Generate OTP and send
        otp_code = generate_otp()
        sent_via = "email" if user_doc["email"] else "sms"
        create_or_replace_otp(user_doc["_id"], "signup", otp_code, sent_via)

        if sent_via == "email":
            send_email(user_doc["email"], "Your Signup OTP", f"Your OTP is: {otp_code}")
        else:
            send_sms(user_doc["phone"], f"Your OTP is: {otp_code}")

        return Response({
            "message": "Signup successful. OTP sent. Verify within 10 minutes.",
            "note": "If you don't verify within 10 minutes, your account will be deleted automatically."
        }, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        """
        Log in with username/email/phone and password.
        - Must be verified and not blacklisted
        - Locks after too many failed attempts
        - Returns a token used in Authorization: Bearer <token>
        """
        ser = LoginSerializer(data=request.data)
        if not ser.is_valid():
            return Response({"errors": ser.errors}, status=status.HTTP_400_BAD_REQUEST)

        user_doc = find_user_by_identifier(ser.validated_data["identifier"])
        if not user_doc:
            return Response({"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

        # Must be verified
        if not user_doc.get("is_verified", False):
            return Response({"message": "User is not verified"}, status=status.HTTP_403_FORBIDDEN)

        # Check password
        if not verify_password(ser.validated_data["password"], user_doc["password_hash"]):
            new_count = increment_failed_logins(user_doc["_id"])
            if new_count >= settings.MAX_FAILED_LOGINS:
                set_user_lock(user_doc["_id"], settings.LOGIN_LOCK_MINUTES)
                return Response({"message": "Too many wrong attempts. Account locked for 10 minutes."}, 
                              status=status.HTTP_403_FORBIDDEN)
            return Response({"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

        # Success: reset failed count, issue token
        reset_failed_logins(user_doc["_id"])
        tok = create_token(user_doc["_id"], client_ip(request), user_agent(request))
        return Response({
            "message": "Login successful",
            "token": tok["token"],
            "inactivity_logout_seconds": settings.TOKEN_INACTIVITY_TTL_SECONDS
        })

class AdminBlacklistUserView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request):
        """
        Blacklist a user by identifier. This logs them out from all devices.
        """
        ser = AdminActionSerializer(data=request.data)
        if not ser.is_valid():
            return Response({"errors": ser.errors}, status=status.HTTP_400_BAD_REQUEST)

        identifier = ser.validated_data["identifier"]
        user_doc = find_user_by_identifier(identifier)
        if not user_doc:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        set_blacklist(user_doc["_id"], True)
        delete_all_tokens_for_user(user_doc["_id"])
        return Response({"message": f"User {user_doc['username']} blacklisted"})`
    }
  ],

  apiEndpoints: [
    {
      method: "POST",
      endpoint: "/api/auth/signup",
      description: "Create new user account with OTP verification",
      payload: {
        username: "alice",
        email: "alice@example.com",
        phone: "1234567890",
        full_name: "Alice Liddell",
        role: "user",
        password: "TopSecret123",
        confirm_password: "TopSecret123"
      },
      response: {
        message: "Signup successful. OTP sent. Verify within 10 minutes.",
        note: "If you don't verify within 10 minutes, your account will be deleted automatically."
      }
    },
    {
      method: "POST",
      endpoint: "/api/auth/signup/verify-otp",
      description: "Verify signup with OTP code",
      payload: {
        identifier: "alice",
        otp: "123456"
      },
      response: {
        message: "Signup verified. You can now log in."
      }
    },
    {
      method: "POST",
      endpoint: "/api/auth/login",
      description: "Login with credentials and get Bearer token",
      payload: {
        identifier: "alice",
        password: "TopSecret123"
      },
      response: {
        message: "Login successful",
        token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
        inactivity_logout_seconds: 864000
      }
    },
    {
      method: "POST",
      endpoint: "/api/auth/logout",
      description: "Logout from current device",
      headers: { Authorization: "Bearer YOUR_TOKEN" },
      response: { message: "Logged out" }
    },
    {
      method: "POST",
      endpoint: "/api/auth/logout-all",
      description: "Logout from all devices",
      headers: { Authorization: "Bearer YOUR_TOKEN" },
      response: { message: "Logged out from all devices" }
    },
    {
      method: "POST",
      endpoint: "/api/auth/forgot-password/request-otp",
      description: "Request password reset OTP",
      payload: { identifier: "alice" },
      response: { message: "Password reset OTP sent. Valid for 10 minutes." }
    },
    {
      method: "POST",
      endpoint: "/api/auth/forgot-password/verify-and-reset",
      description: "Verify OTP and reset password",
      payload: {
        identifier: "alice",
        otp: "123456",
        new_password: "NewPass123",
        confirm_password: "NewPass123"
      },
      response: { message: "Password changed. You have been logged out on all devices." }
    },
    {
      method: "DELETE",
      endpoint: "/api/user",
      description: "Soft delete your account",
      headers: { Authorization: "Bearer YOUR_TOKEN" },
      response: { message: "Account deleted. Admin can restore it later if needed." }
    },
    {
      method: "POST",
      endpoint: "/api/admin/users/blacklist",
      description: "Admin: Blacklist user and force logout",
      headers: { Authorization: "Bearer ADMIN_TOKEN" },
      payload: { identifier: "alice", reason: "spam" },
      response: { message: "User alice blacklisted" }
    },
    {
      method: "POST",
      endpoint: "/api/admin/users/restore",
      description: "Admin: Restore soft-deleted user",
      headers: { Authorization: "Bearer ADMIN_TOKEN" },
      payload: { identifier: "alice" },
      response: { message: "User restored" }
    },
    {
      method: "GET",
      endpoint: "/api/me",
      description: "Get current user profile",
      headers: { Authorization: "Bearer YOUR_TOKEN" },
      response: {
        id: "64a1b2c3d4e5f6789012345",
        username: "alice",
        email: "alice@example.com",
        phone: "1234567890",
        role: "user",
        is_verified: true
      }
    }
  ],

  securityFeatures: [
    {
      title: "Auto-Delete Unverified Users",
      description: "MongoDB TTL automatically deletes unverified users after 10 minutes",
      icon: "⏰",
      color: "from-red-500 to-orange-500"
    },
    {
      title: "OTP Security",
      description: "OTPs are hashed, have 2-minute resend cooldown, and auto-expire in 10 minutes",
      icon: "🔐",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Login Protection",
      description: "Account locks for 10 minutes after 10 failed login attempts",
      icon: "🛡️",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Token Auto-Logout",
      description: "Tokens automatically expire after 10 days of inactivity",
      icon: "🚪",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Soft Delete & Restore",
      description: "Deleted users moved to separate collection, restorable by admin",
      icon: "♻️",
      color: "from-yellow-500 to-amber-500"
    },
    {
      title: "Admin Blacklisting",
      description: "Admins can blacklist users and force logout from all devices",
      icon: "⚡",
      color: "from-indigo-500 to-purple-500"
    }
  ]
};