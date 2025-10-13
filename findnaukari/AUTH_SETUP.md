# Authentication Setup Guide

## MongoDB Database Configuration

### Environment Variables

Make sure your `.env.local` file contains the following variables:

```env
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/findnaukari
# OR for MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/findnaukari

# JWT Secret (use a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Environment
NODE_ENV=development
```

### Project Structure

```
findnaukari/
├── src/
│   ├── lib/
│   │   └── mongodb.js          # MongoDB connection utility
│   ├── models/
│   │   └── User.js             # User schema with role-based fields
│   ├── auth/
│   │   ├── login.js            # Login business logic
│   │   └── signup.js           # Signup business logic
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.jsx    # Login UI with API integration
│   │   │   └── signup/
│   │   │       └── page.jsx    # Signup UI with API integration
│   │   └── api/
│   │       └── auth/
│   │           ├── login/
│   │           │   └── route.js   # Login API endpoint
│   │           └── signup/
│   │               └── route.js   # Signup API endpoint
```

### User Data Model

#### Student Fields
- `name`: Full name
- `email`: Email address (unique)
- `password`: Hashed password
- `role`: "student"
- `headline`: Professional headline (e.g., "Frontend Developer | React | Node.js")
- `topSkills`: Array of skills
- `experienceYears`: Years of experience (number)

#### Recruiter Fields
- `name`: Full name
- `email`: Email address (unique)
- `password`: Hashed password
- `role`: "recruiter"
- `company`: Company name
- `position`: Job position/title
- `hiringFocus`: Hiring focus areas (optional)

### Features Implemented

1. **Role-Based Authentication**: Separate flows for students and recruiters
2. **Password Hashing**: Using bcryptjs for secure password storage
3. **JWT Tokens**: Secure authentication with 7-day expiry
4. **HTTP-Only Cookies**: Tokens stored securely in cookies
5. **Form Validation**: Client-side and server-side validation
6. **Error Handling**: User-friendly error messages
7. **Responsive UI**: Mobile-friendly design matching hero section colors

### API Endpoints

#### POST /api/auth/signup
Creates a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student",
  "headline": "Full Stack Developer",
  "topSkills": "React, Node.js, MongoDB",
  "experienceYears": 2
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "headline": "Full Stack Developer",
    "topSkills": ["React", "Node.js", "MongoDB"],
    "experienceYears": 2
  }
}
```

#### POST /api/auth/login
Authenticates an existing user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    ...
  }
}
```

### Next Steps

1. **Install MongoDB** locally or create a **MongoDB Atlas** account
2. **Update `.env.local`** with your MongoDB URI and JWT secret
3. **Run the development server**: `npm run dev`
4. **Test the auth flow**:
   - Visit `/signup` to create an account
   - Visit `/login` to sign in
5. **Create dashboard pages**:
   - `/dashboard/student` - Student dashboard
   - `/dashboard/recruiter` - Recruiter dashboard

### Testing the Setup

You can test if MongoDB is connected by:
1. Starting your Next.js app: `npm run dev`
2. Opening the browser console
3. Going to `/signup` and creating a test account
4. Check your MongoDB database for the new user

### Security Notes

- **Never commit `.env.local`** to version control
- Use a **strong JWT_SECRET** in production (32+ characters)
- Enable **MongoDB authentication** in production
- Use **HTTPS** in production for secure cookie transmission
- Implement **rate limiting** for API endpoints
- Add **email verification** for production use

