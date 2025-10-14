# Environment Setup for Next.js App

## Creating .env.local file

You mentioned you already created the `.env.local` file. Make sure it contains these variables:

```env
# ============================================
# MongoDB Configuration
# ============================================
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/resume-analyzer

# For MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume-analyzer?retryWrites=true&w=majority

# ============================================
# JWT Secret Key
# ============================================
# IMPORTANT: Change this to a secure random string
# Generate using: openssl rand -base64 32
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# ============================================
# Flask ML Service Configuration
# ============================================
ML_SERVICE_URL=http://localhost:5000

# ============================================
# Next.js Configuration
# ============================================
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Generate a Secure JWT Secret

### On Windows (PowerShell)
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### On macOS/Linux
```bash
openssl rand -base64 32
```

### Or use Node.js
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## MongoDB Connection String Examples

### Local MongoDB
```
mongodb://localhost:27017/resume-analyzer
```

### MongoDB with Authentication
```
mongodb://username:password@localhost:27017/resume-analyzer
```

### MongoDB Atlas (Cloud)
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/resume-analyzer?retryWrites=true&w=majority
```

**Note:** Replace `username`, `password`, and cluster details with your actual MongoDB credentials.

## Verify Configuration

After creating `.env.local`, restart your Next.js dev server:

```bash
# Kill the current dev server (Ctrl+C)
npm run dev
```

## Security Reminders

1. ✅ `.env.local` is already in `.gitignore` - never commit it
2. ✅ Use a strong, random JWT_SECRET
3. ✅ Keep MongoDB credentials secure
4. ✅ Use different secrets for development and production

## Troubleshooting

### "MONGODB_URI environment variable not defined"
- Make sure `.env.local` exists in the `findnaukari/` directory (same level as `package.json`)
- Restart the Next.js dev server after creating `.env.local`

### "JWT_SECRET environment variable not defined"
- Add `JWT_SECRET=your-secret-key` to `.env.local`
- Restart the Next.js dev server

### "Cannot connect to MongoDB"
- Check if MongoDB is running: `mongod` (local) or verify Atlas connection
- Verify the `MONGODB_URI` connection string is correct
- Check firewall settings


