export const tutorialContent = {
  hero: {
    title: "Master Django REST API Authentication",
    subtitle: "Build a cinematic, secure auth system with MongoDB, MySQL, JWT, and OTP verification",
    description: "A complete guide to building production-ready authentication with Django REST Framework"
  },
  
  sections: [
    {
      id: "setup",
      title: "Environment Setup",
      description: "Configure your development environment with all necessary dependencies",
      envVars: [
        "DJANGO_SECRET_KEY=your-super-secret-key-here",
        "DJANGO_DEBUG=False",
        "DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1",
        "",
        "MYSQL_HOST=localhost",
        "MYSQL_PORT=3306",
        "MYSQL_DB=django_auth_db",
        "MYSQL_USER=your_mysql_user",
        "MYSQL_PASSWORD=your_mysql_password",
        "",
        "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/",
        "MONGODB_DBNAME=authdb",
        "",
        "EMAIL_HOST=smtp.gmail.com",
        "EMAIL_PORT=587",
        "EMAIL_HOST_USER=your_email@example.com",
        "EMAIL_HOST_PASSWORD=your_app_password",
        "EMAIL_USE_TLS=True",
        "",
        "JWT_ACCESS_TTL_MIN=15",
        "JWT_REFRESH_TTL_DAYS=7",
        "OTP_TTL_MIN=10",
        "OTP_RESEND_COOLDOWN_MIN=2",
        "LOGIN_LOCKOUT_THRESHOLD=10",
        "LOGIN_LOCKOUT_TTL_MIN=10",
        "INACTIVITY_LOGOUT_DAYS=10"
      ]
    },
    {
      id: "models",
      title: "Database Models",
      description: "Design MongoDB collections and Django models for secure user management",
      collections: [
        {
          name: "users",
          fields: ["_id", "email", "password_hash", "is_verified", "is_blacklisted", "created_at", "token_version"],
          description: "Main user collection in MongoDB"
        },
        {
          name: "otps",
          fields: ["_id", "user_id", "otp_hash", "kind", "expires_at", "created_at"],
          description: "OTP storage with automatic expiry"
        },
        {
          name: "deleted_users",
          fields: ["_id", "original_data", "deleted_at", "deleted_by"],
          description: "Soft-deleted users for restoration"
        }
      ]
    },
    {
      id: "otp-lifecycle",
      title: "OTP Lifecycle",
      description: "Understanding the complete OTP verification flow",
      steps: [
        {
          title: "Generate OTP",
          description: "6-digit random OTP generated securely",
          code: "otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])"
        },
        {
          title: "Hash & Store",
          description: "OTP is hashed and stored with TTL",
          code: "otp_hash = make_password(otp)\nstore_otp(user_id, otp_hash, expires_at)"
        },
        {
          title: "Send Email",
          description: "OTP sent via SMTP to user's email",
          code: "send_mail('Your OTP', f'Code: {otp}', from_email, [user.email])"
        },
        {
          title: "Auto-Expire",
          description: "OTP automatically deleted after 10 minutes",
          code: "# MongoDB TTL index handles automatic deletion"
        }
      ]
    },
    {
      id: "auth-flows",
      title: "Authentication Flows",
      description: "Complete signup, verification, login, and logout implementation",
      flows: [
        {
          name: "Signup",
          endpoints: ["/api/auth/signup/"],
          description: "User registration with email verification"
        },
        {
          name: "Verify OTP",
          endpoints: ["/api/auth/verify-otp/"],
          description: "Email verification using OTP"
        },
        {
          name: "Login",
          endpoints: ["/api/auth/login/"],
          description: "Secure login with rate limiting"
        },
        {
          name: "Logout",
          endpoints: ["/api/auth/logout/", "/api/auth/logout-all/"],
          description: "Single and all-device logout"
        }
      ]
    }
  ],
  
  codeExamples: {
    djangoSettings: `# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': os.getenv('MYSQL_DB'),
        'USER': os.getenv('MYSQL_USER'),
        'PASSWORD': os.getenv('MYSQL_PASSWORD'),
        'HOST': os.getenv('MYSQL_HOST'),
        'PORT': os.getenv('MYSQL_PORT'),
    }
}

# MongoDB connection
MONGODB_URI = os.getenv('MONGODB_URI')
MONGODB_DBNAME = os.getenv('MONGODB_DBNAME')`,
    
    userModel: `# models.py
from pymongo import MongoClient
from django.contrib.auth.hashers import make_password, check_password
import datetime

class UserManager:
    def __init__(self):
        self.client = MongoClient(settings.MONGODB_URI)
        self.db = self.client[settings.MONGODB_DBNAME]
        self.users = self.db.users
        self.otps = self.db.otps
        self.deleted_users = self.db.deleted_users
    
    def create_user(self, email, password):
        user_data = {
            'email': email,
            'password_hash': make_password(password),
            'is_verified': False,
            'is_blacklisted': False,
            'created_at': datetime.datetime.utcnow(),
            'token_version': 1
        }
        return self.users.insert_one(user_data)`,
    
    otpGeneration: `# otp_utils.py
import random
import hashlib
from datetime import datetime, timedelta

def generate_otp():
    return ''.join([str(random.randint(0, 9)) for _ in range(6)])

def store_otp(user_id, otp, kind='verification'):
    otp_hash = make_password(otp)
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    otp_data = {
        'user_id': user_id,
        'otp_hash': otp_hash,
        'kind': kind,
        'expires_at': expires_at,
        'created_at': datetime.utcnow()
    }
    
    # Remove existing OTPs for this user and kind
    db.otps.delete_many({'user_id': user_id, 'kind': kind})
    return db.otps.insert_one(otp_data)`
  },
  
  apiEndpoints: [
    {
      method: "POST",
      endpoint: "/api/auth/signup/",
      description: "Register a new user account",
      payload: { email: "user@example.com", password: "securepassword123" },
      response: { message: "User created. Please verify your email.", user_id: "64a1b2c3d4e5f6789012345" }
    },
    {
      method: "POST",
      endpoint: "/api/auth/verify-otp/",
      description: "Verify email with OTP code",
      payload: { user_id: "64a1b2c3d4e5f6789012345", otp: "123456" },
      response: { message: "Email verified successfully", is_verified: true }
    },
    {
      method: "POST",
      endpoint: "/api/auth/login/",
      description: "User login with credentials",
      payload: { email: "user@example.com", password: "securepassword123" },
      response: { message: "Login successful", access_token: "eyJ0eXAiOiJKV1QiLCJhbGc...", refresh_token: "eyJ0eXAiOiJKV1QiLCJhbGc..." }
    }
  ],
  
  faq: [
    {
      question: "Why use MongoDB for users and MySQL for Django?",
      answer: "MongoDB provides flexible schema for user data and built-in TTL for OTPs, while MySQL handles Django's internal tables efficiently."
    },
    {
      question: "How secure is the OTP system?",
      answer: "OTPs are hashed before storage, automatically expire in 10 minutes, and have resend cooldowns to prevent abuse."
    },
    {
      question: "What happens during soft delete?",
      answer: "User data is moved to deleted_users collection with metadata, allowing restoration while removing from active users."
    }
  ],
  
  glossary: [
    { term: "OTP", definition: "One-Time Password - A temporary code used for verification" },
    { term: "TTL", definition: "Time To Live - Automatic expiration of database records" },
    { term: "JWT", definition: "JSON Web Token - Secure token format for authentication" },
    { term: "Hash", definition: "One-way encryption of sensitive data like passwords" },
    { term: "Soft Delete", definition: "Marking records as deleted without permanent removal" }
  ]
};