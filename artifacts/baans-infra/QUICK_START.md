# 🚀 BAANS INFRA - Quick Start Guide

## ⚡ Get Started in 5 Minutes

### 1. Create Supabase Project (2 minutes)
1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Choose a name, database password, and region
4. Wait for project to initialize

### 2. Set Up Database (1 minute)
1. In Supabase Dashboard, go to **SQL Editor**
2. Open the file `supabase-setup.sql` from this project
3. Copy all contents and paste into SQL Editor
4. Click **Run** to execute

### 3. Create Storage Buckets (1 minute)
1. Go to **Storage** in Supabase Dashboard
2. Click **New Bucket**
3. Create bucket: `project-images` (make it **Public**)
4. Create bucket: `team-images` (make it **Public**)

### 4. Create Admin User (30 seconds)
1. Go to **Authentication > Users**
2. Click **Add User**
3. Enter email: `admin@baansinfra.com` (or your email)
4. Enter password: (choose a strong password)
5. Click **Create User**

### 5. Configure Environment (30 seconds)
1. In Supabase Dashboard, go to **Settings > API**
2. Copy your **Project URL**
3. Copy your **anon public** key
4. Create `.env` file in project root:
```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 6. Install & Run (1 minute)
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

### 7. Access Admin Panel
1. Open browser to `http://localhost:5173/admin`
2. Login with your admin credentials
3. Start adding projects and team members!

---

## 🎯 What You Get

✅ **7 Sample Projects** already in the code  
✅ **Fully Working Navigation** (navbar + footer)  
✅ **Admin Panel** at `/admin`  
✅ **Image Compression** (automatic, max 1MB)  
✅ **Supabase Backend** (database + storage)  
✅ **Responsive Design** (mobile, tablet, desktop)  

---

## 📋 Admin Panel Features

### Manage Projects (`/admin/projects`)
- Add new projects with details
- Upload cover image + gallery images
- Edit existing projects
- Delete projects
- All images auto-compressed

### Manage Team (`/admin/team`)
- Add team members
- Upload member photos
- Set display order
- Edit member info
- Delete members

---

## 🔑 Default Admin Credentials

After creating your admin user in Supabase:
- **URL**: `http://localhost:5173/admin`
- **Email**: (the email you created)
- **Password**: (the password you set)

---

## 📁 Important Files

- `supabase-setup.sql` - Database setup script
- `.env` - Your Supabase credentials (create this)
- `.env.example` - Template for .env file
- `IMPLEMENTATION_GUIDE.md` - Full documentation

---

## 🐛 Common Issues

**"Cannot connect to Supabase"**
- Check your .env file has correct URL and key
- Ensure .env is in the project root
- Restart dev server after creating .env

**"Images not uploading"**
- Verify storage buckets are created
- Make sure buckets are set to Public
- Check storage policies are applied (run SQL script)

**"Can't login to admin"**
- Verify admin user exists in Supabase Auth
- Check email/password are correct
- Clear browser cache and try again

---

## 🎨 Customization

### Change Site Content
Edit `src/data/data.ts` for:
- Site name and contact info
- Footer content
- Static project data (fallback)

### Change Colors
Edit `src/index.css` for:
- Color scheme
- Typography
- Spacing

### Add More Pages
1. Create new file in `src/pages/`
2. Add route in `src/App.tsx`
3. Add link in navbar/footer

---

## 🚀 Deploy to Production

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

**Important**: Add environment variables in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## 📞 Need Help?

1. Check `IMPLEMENTATION_GUIDE.md` for detailed docs
2. Review `supabase-setup.sql` for database structure
3. Check browser console for error messages
4. Verify Supabase Dashboard for data/storage issues

---

## ✅ Checklist

- [ ] Supabase project created
- [ ] Database tables created (run SQL script)
- [ ] Storage buckets created (project-images, team-images)
- [ ] Admin user created
- [ ] .env file configured
- [ ] Dependencies installed (`pnpm install`)
- [ ] Dev server running (`pnpm dev`)
- [ ] Admin panel accessible (`/admin`)
- [ ] Can add projects and team members

---

**You're all set! Start building with BAANS INFRA! 🌿**
