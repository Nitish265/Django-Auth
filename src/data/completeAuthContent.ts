export const completeAuthContent = {
  introduction: {
    title: "Complete Django Authentication System",
    subtitle: "Production-Ready Authentication with MongoDB + MySQL",
    description: "A comprehensive Django REST API authentication system with advanced security features, OTP verification, token management, and admin controls. Built with MongoDB for user data and MySQL for Django internals.",
    features: [
      "🔐 Secure OTP-based signup with auto-deletion",
      "🛡️ Advanced login protection with lockout mechanisms", 
      "⏰ Auto-logout after inactivity using MongoDB TTL",
      "🔄 Soft delete and restore functionality",
      "👑 Admin blacklisting and user management",
      "📱 Email/SMS OTP delivery system"
    ]
  },

  whatWereBuilding: {
    title: "What we're building (features)",
    features: [
      {
        title: "Signup with unique username/email/phone",
        details: [
          "Role + full name + password + confirm password",
          "Send OTP to verify signup",
          "OTP expires after 10 minutes (auto delete via MongoDB TTL)",
          "Resend OTP allowed after 2 minutes (old OTP deleted)",
          "OTP is tied to the user; can't be used by others",
          "If user stays unverified for 10 minutes, delete the user automatically (via MongoDB TTL)"
        ],
        icon: "👤",
        color: "from-blue-500 to-cyan-500"
      },
      {
        title: "Login/Logout with tokens stored in MongoDB",
        details: [
          "After 10 wrong password attempts → lock login for 10 minutes",
          "Logout from current device or all devices",
          "Auto-logout after 10 days of inactivity (no API calls) via MongoDB TTL"
        ],
        icon: "🔑",
        color: "from-green-500 to-emerald-500"
      },
      {
        title: "Forgot password via OTP",
        details: [
          "OTP is separate from signup OTP and can't be reused",
          "When password is reset, logout from all devices"
        ],
        icon: "🔒",
        color: "from-purple-500 to-pink-500"
      },
      {
        title: "Delete account (soft delete)",
        details: [
          "Soft delete to a deleted_users collection",
          "Admin can restore users from deleted"
        ],
        icon: "🗑️",
        color: "from-red-500 to-orange-500"
      },
      {
        title: "Blacklist/unblacklist users (admin-only)",
        details: [
          "Blacklisted users cannot log in or use existing tokens"
        ],
        icon: "⚡",
        color: "from-yellow-500 to-amber-500"
      }
    ]
  },

  techStack: {
    title: "Tech stack and why",
    technologies: [
      {
        name: "Django + DRF",
        reason: "easy API building and validation",
        icon: "🐍",
        color: "from-green-600 to-green-400"
      },
      {
        name: "PyMongo",
        reason: "talk to MongoDB directly (no ORM complications)",
        icon: "🍃",
        color: "from-green-500 to-lime-400"
      },
      {
        name: "MySQL",
        reason: "default Django tables (no app data there)",
        icon: "🐬",
        color: "from-blue-600 to-blue-400"
      },
      {
        name: "MongoDB TTL indexes",
        reason: "automatic time-based deletions",
        icon: "⏰",
        color: "from-purple-600 to-purple-400"
      },
      {
        name: "Custom Token Auth",
        reason: "simple tokens stored in Mongo, easy to revoke/expire",
        icon: "🔐",
        color: "from-red-600 to-red-400"
      }
    ]
  },

  setupSteps: [
    {
      step: 0,
      title: "Install dependencies",
      description: "Use a virtual environment (recommended)",
      commands: [
        "# Windows:",
        "py -m venv venv",
        "venv\\Scripts\\activate",
        "",
        "# macOS/Linux:",
        "python3 -m venv venv", 
        "source venv/bin/activate",
        "",
        "# Install packages:",
        "pip install django djangorestframework pymongo python-dotenv mysqlclient"
      ]
    },
    {
      step: 1,
      title: "Create project and app",
      description: "Initialize Django project structure",
      commands: [
        "django-admin startproject core",
        "cd core",
        "python manage.py startapp accounts"
      ]
    },
    {
      step: 2,
      title: "Environment variables (.env)",
      description: "Create a .env file in the root (same level as manage.py)",
      commands: [
        "SECRET_KEY=your-django-secret-key",
        "DEBUG=True",
        "ALLOWED_HOSTS=*",
        "MYSQL_NAME=your_db_name",
        "MYSQL_USER=your_user",
        "MYSQL_PASSWORD=your_password",
        "MYSQL_HOST=127.0.0.1",
        "MYSQL_PORT=3306",
        "MONGO_URI=mongodb://localhost:27017",
        "MONGO_DB_NAME=myappdb",
        "OTP_LENGTH=6",
        "OTP_COOLDOWN_SECONDS=120",
        "OTP_TTL_SECONDS=600",
        "TOKEN_INACTIVITY_TTL_SECONDS=864000",
        "LOGIN_LOCK_MINUTES=10",
        "MAX_FAILED_LOGINS=10"
      ]
    }
  ],

  projectStructure: {
    title: "Your project structure will look like",
    structure: [
      {
        name: "core/",
        type: "folder",
        children: [
          {
            name: "core/",
            type: "folder", 
            children: [
              { name: "settings.py", type: "file", description: "All settings (MySQL, Mongo, DRF auth, OTP timers)" },
              { name: "urls.py", type: "file", description: "Routes '/api/...' to accounts app URLs" },
              { name: "asgi.py", type: "file", description: "Entry points when you deploy" },
              { name: "wsgi.py", type: "file", description: "Entry points when you deploy" }
            ]
          },
          {
            name: "accounts/",
            type: "folder",
            children: [
              { name: "apps.py", type: "file", description: "Runs when Django starts, creates Mongo indexes" },
              { name: "urls.py", type: "file", description: "Maps endpoint paths to view classes" },
              { name: "views.py", type: "file", description: "All your API endpoints (DRF APIViews)" },
              { name: "authentication.py", type: "file", description: "Custom auth class to check tokens in Mongo" },
              { name: "serializers.py", type: "file", description: "DRF serializers that validate request data" },
              { name: "repositories.py", type: "file", description: "The only place that talks to MongoDB directly" },
              { name: "mongo.py", type: "file", description: "Creates Mongo client and collection handles" },
              { name: "indexes.py", type: "file", description: "Creates indexes in MongoDB (unique + TTL)" },
              {
                name: "utils/",
                type: "folder",
                children: [
                  { name: "security.py", type: "file", description: "Hash passwords, tokens, OTPs securely" },
                  { name: "otp.py", type: "file", description: "Generate numeric OTP codes" },
                  { name: "senders.py", type: "file", description: "Email/SMS sending (placeholders)" }
                ]
              }
            ]
          },
          { name: "manage.py", type: "file", description: "Django management commands" }
        ]
      },
      { name: ".env", type: "file", description: "Your secrets and config (you create)" }
    ]
  },

  apiEndpoints: [
    {
      method: "POST",
      endpoint: "/api/auth/signup",
      description: "Create a new user (unverified), send signup OTP, and set auto-delete in 10 minutes",
      example: `curl -X POST http://localhost:8000/api/auth/signup -H "Content-Type: application/json" -d '{
  "username":"alice",
  "email":"alice@example.com",
  "phone":"1234567890",
  "full_name":"Alice Liddell",
  "role":"user",
  "password":"TopSecret123",
  "confirm_password":"TopSecret123"
}'`
    },
    {
      method: "POST", 
      endpoint: "/api/auth/signup/resend-otp",
      description: "Resend signup OTP after a 2-minute cooldown. Old OTP is deleted",
      example: `curl -X POST http://localhost:8000/api/auth/signup/resend-otp -H "Content-Type: application/json" -d '{
  "identifier":"alice"
}'`
    },
    {
      method: "POST",
      endpoint: "/api/auth/signup/verify-otp", 
      description: "Verify the signup OTP. If correct, mark user as verified and delete the OTP instantly",
      example: `curl -X POST http://localhost:8000/api/auth/signup/verify-otp -H "Content-Type: application/json" -d '{
  "identifier":"alice",
  "otp":"123456"
}'`
    },
    {
      method: "POST",
      endpoint: "/api/auth/login",
      description: "Log in with username/email/phone and password. Returns Bearer token",
      example: `curl -X POST http://localhost:8000/api/auth/login -H "Content-Type: application/json" -d '{
  "identifier":"alice",
  "password":"TopSecret123"
}'`
    },
    {
      method: "POST",
      endpoint: "/api/auth/logout",
      description: "Logout current device: delete current token only",
      example: `curl -X POST http://localhost:8000/api/auth/logout -H "Authorization: Bearer YOUR_TOKEN"`
    },
    {
      method: "POST",
      endpoint: "/api/auth/logout-all",
      description: "Logout from ALL devices: delete all tokens for this user",
      example: `curl -X POST http://localhost:8000/api/auth/logout-all -H "Authorization: Bearer YOUR_TOKEN"`
    },
    {
      method: "POST",
      endpoint: "/api/auth/forgot-password/request-otp",
      description: "Request a password reset OTP. Requires verified user",
      example: `curl -X POST http://localhost:8000/api/auth/forgot-password/request-otp -H "Content-Type: application/json" -d '{
  "identifier":"alice"
}'`
    },
    {
      method: "POST",
      endpoint: "/api/auth/forgot-password/verify-and-reset",
      description: "Verify password reset OTP and set a new password. After resetting, log out from all devices",
      example: `curl -X POST http://localhost:8000/api/auth/forgot-password/verify-and-reset -H "Content-Type: application/json" -d '{
  "identifier":"alice",
  "otp":"123456", 
  "new_password":"NewPass123",
  "confirm_password":"NewPass123"
}'`
    },
    {
      method: "DELETE",
      endpoint: "/api/user",
      description: "Soft-delete your own account: move to deleted_users and remove from users",
      example: `curl -X DELETE http://localhost:8000/api/user -H "Authorization: Bearer YOUR_TOKEN"`
    },
    {
      method: "POST",
      endpoint: "/api/admin/users/restore",
      description: "Restore a user from deleted_users by identifier (admin-only)",
      example: `curl -X POST http://localhost:8000/api/admin/users/restore -H "Authorization: Bearer ADMIN_TOKEN" -H "Content-Type: application/json" -d '{
  "identifier":"alice"
}'`
    },
    {
      method: "POST",
      endpoint: "/api/admin/users/blacklist",
      description: "Blacklist a user by identifier. This logs them out from all devices (admin-only)",
      example: `curl -X POST http://localhost:8000/api/admin/users/blacklist -H "Authorization: Bearer ADMIN_TOKEN" -H "Content-Type: application/json" -d '{
  "identifier":"alice",
  "reason":"spam"
}'`
    },
    {
      method: "POST",
      endpoint: "/api/admin/users/unblacklist",
      description: "Remove a user from blacklist (admin-only)",
      example: `curl -X POST http://localhost:8000/api/admin/users/unblacklist -H "Authorization: Bearer ADMIN_TOKEN" -H "Content-Type: application/json" -d '{
  "identifier":"alice"
}'`
    },
    {
      method: "GET",
      endpoint: "/api/me",
      description: "A simple endpoint to test auth and see who you are",
      example: `curl http://localhost:8000/api/me -H "Authorization: Bearer YOUR_TOKEN"`
    }
  ],

  howItWorks: {
    title: "How it all works together (plain English)",
    flows: [
      {
        title: "When someone signs up",
        steps: [
          "We create a user in Mongo with is_verified = false and set delete_at = now + 10 minutes",
          "We create an OTP record tied to that user and send it by email or SMS",
          "Mongo DB will automatically delete the user after 10 minutes if they never verify (TTL on users.delete_at)",
          "The OTP also auto-deletes after 10 minutes (TTL on otps.created_at)",
          "If they ask for a new OTP, we check they waited 2 minutes before sending a fresh one",
          "We delete the old OTP and refresh delete_at to give them another 10 minutes",
          "When they verify OTP, we mark them verified and remove delete_at, so Mongo won't delete them"
        ]
      },
      {
        title: "Login",
        steps: [
          "Only verified, not-blacklisted users can log in",
          "If they fail 10 times, we lock them for 10 minutes",
          "If they succeed, we create a token stored in Mongo with last_activity=now",
          "On every authenticated request, our auth class updates last_activity (keeps them logged in)",
          "Mongo automatically deletes (logs out) tokens with no activity for 10 days (TTL on tokens.last_activity)"
        ]
      },
      {
        title: "Logout",
        steps: [
          "Delete current token (logout only this device)",
          "Or delete all tokens (logout from all devices)"
        ]
      },
      {
        title: "Forgot password",
        steps: [
          "Verified user requests OTP (cooldown 2 minutes, expires 10 minutes)",
          "They verify OTP and provide a new password in the same call",
          "If correct, we delete the OTP, set the new password, and force logout from all devices by deleting tokens"
        ]
      },
      {
        title: "Delete account",
        steps: [
          "Move user doc from users to deleted_users (so we can restore if needed)",
          "Delete all tokens"
        ]
      },
      {
        title: "Admin",
        steps: [
          "Can restore a deleted user (unless someone else took their username/email/phone)",
          "Can blacklist/unblacklist users. Blacklisting logs them out immediately and blocks login"
        ]
      }
    ]
  }
};