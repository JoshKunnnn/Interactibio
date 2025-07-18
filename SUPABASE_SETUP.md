# Supabase Setup Guide

## 📋 Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - **Name**: `interactibio-quiz-system`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your location
6. Click "Create new project"

## 🔑 Step 2: Get Your API Keys

1. Once your project is created, go to **Project Settings** (gear icon)
2. Navigate to **API** section
3. You'll find two important values:
   - **Project URL**: `https://your-project.supabase.co`
   - **anon/public key**: `eyJhbGciOiJIUzI1NiI...` (long string)

## 🌍 Step 3: Set Up Environment Variables

1. In your project root, create a file named `.env`
2. Add the following content (replace with your actual values):

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

## 📝 Step 4: Add .env to .gitignore

Make sure your `.env` file is in your `.gitignore` to keep your keys secure:

```gitignore
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

## ✅ Step 5: Test Connection

After setting up your `.env` file, restart your development server:

```bash
npm start
```

## 🚨 Important Security Notes

- **Never commit your `.env` file** to version control
- **Keep your keys secure** - they provide access to your database
- **Use environment variables** in production deployment
- **Regenerate keys** if they're ever compromised

## 🔄 Next Steps

Once your Supabase project is set up:
1. We'll create the database schema
2. Configure authentication providers
3. Set up storage buckets for images
4. Test the connection

---

**Need help?** Check the [Supabase documentation](https://supabase.com/docs) or let me know if you encounter any issues! 