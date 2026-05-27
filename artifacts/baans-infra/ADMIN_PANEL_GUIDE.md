# 🎛️ BAANS INFRA - Admin Panel User Guide

## Overview

The admin panel allows you to manage all content on the BAANS INFRA website without touching any code. This guide shows you exactly how to use each feature.

---

## 🔐 Accessing the Admin Panel

### Step 1: Navigate to Admin
Open your browser and go to:
```
http://localhost:5173/admin
```
(Or your production URL: `https://yourdomain.com/admin`)

### Step 2: Login
- Enter your admin email
- Enter your password
- Click "Login"

**Note**: Admin users must be created in Supabase Dashboard under Authentication > Users

---

## 🏠 Admin Dashboard

After logging in, you'll see the main dashboard with two options:

```
┌─────────────────────────────────────────────────────────────┐
│                     ADMIN DASHBOARD                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────┐    ┌──────────────────────┐      │
│  │  Manage Projects     │    │  Manage Team         │      │
│  │                      │    │                      │      │
│  │  Add, edit, or       │    │  Update team member  │      │
│  │  remove projects     │    │  information and     │      │
│  │  from the portfolio  │    │  photos              │      │
│  └──────────────────────┘    └──────────────────────┘      │
│                                                              │
│  [Logout]                                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Managing Projects

### Viewing All Projects

Click "Manage Projects" to see all existing projects:

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Dashboard          MANAGE PROJECTS   [+ Add Project]│
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ [Image]  Bamboo Villa, Goa                             │ │
│  │          Assagao, North Goa • Villas • 2023            │ │
│  │          A private Bali-inspired villa...              │ │
│  │          [Edit] [Delete]                               │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ [Image]  Riverside Yoga Retreat, Rishikesh             │ │
│  │          Rishikesh, Uttarakhand • Pavilions • 2024     │ │
│  │          Perched on the banks of the Ganges...         │ │
│  │          [Edit] [Delete]                               │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### Adding a New Project

#### Step 1: Click "+ Add Project"

A form will appear with all required fields:

```
┌─────────────────────────────────────────────────────────────┐
│                      ADD NEW PROJECT                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Project Name *          Slug (URL) *                        │
│  [________________]      [________________]                  │
│                                                              │
│  Location *              State *                             │
│  [________________]      [________________]                  │
│                                                              │
│  Type *                  Year *                              │
│  [Resorts ▼]            [2024________]                       │
│                                                              │
│  Duration *              Size *                              │
│  [________________]      [________________]                  │
│                                                              │
│  Description *                                               │
│  [________________________________________________]          │
│  [________________________________________________]          │
│  [________________________________________________]          │
│                                                              │
│  Tags (comma-separated)                                      │
│  [________________________________________________]          │
│                                                              │
│  Cover Image *                                               │
│  [Choose File]                                               │
│  Images will be automatically compressed to max 1MB          │
│                                                              │
│  Gallery Images                                              │
│  [Choose Files]                                              │
│                                                              │
│  [Create Project]  [Cancel]                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### Step 2: Fill in the Form

**Required Fields (marked with *):**

1. **Project Name**
   - Example: "Bamboo Villa, Goa"
   - This appears as the project title

2. **Slug (URL)**
   - Example: "bamboo-villa-goa"
   - Auto-generated from name (lowercase, dashes)
   - Used in URL: `/projects/bamboo-villa-goa`

3. **Location**
   - Example: "Assagao, North Goa"
   - City and region

4. **State**
   - Example: "Goa"
   - State name

5. **Type**
   - Select from dropdown:
     - Resorts
     - Villas
     - Pavilions & Commercial
     - Rammed Earth

6. **Year**
   - Example: "2024"
   - Completion year

7. **Duration**
   - Example: "3 months"
   - How long it took to build

8. **Size**
   - Example: "1,800 sq ft"
   - Square footage

9. **Description**
   - Full project description
   - Tell the story of the project
   - 2-3 paragraphs recommended

10. **Cover Image**
    - Main project photo
    - Will be compressed to max 1MB
    - Recommended: High-quality, landscape orientation

**Optional Fields:**

11. **Tags**
    - Example: "Bali-style, Private Villa, Coastal"
    - Comma-separated
    - Used for categorization

12. **Gallery Images**
    - Multiple images allowed
    - Each compressed to max 1MB
    - Recommended: 4-8 images

#### Step 3: Upload Images

**Cover Image:**
- Click "Choose File"
- Select your best project photo
- Image will be automatically compressed

**Gallery Images:**
- Click "Choose Files"
- Select multiple images (Ctrl+Click or Cmd+Click)
- All images will be automatically compressed

**Image Tips:**
- Use high-quality photos (they'll be compressed)
- Landscape orientation works best
- Show different angles and details
- Include people for scale (optional)

#### Step 4: Submit

- Click "Create Project"
- Wait for upload (may take a few seconds)
- Project appears immediately on website!

---

### Editing an Existing Project

#### Step 1: Click "Edit" on any project

The form pre-fills with existing data:

```
┌─────────────────────────────────────────────────────────────┐
│                      EDIT PROJECT                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Project Name *          Slug (URL) *                        │
│  [Bamboo Villa, Goa]    [bamboo-villa-goa]                  │
│                                                              │
│  Location *              State *                             │
│  [Assagao, North Goa]   [Goa_________]                       │
│                                                              │
│  ... (all fields pre-filled) ...                            │
│                                                              │
│  Cover Image (optional - leave empty to keep current)        │
│  [Choose File]                                               │
│                                                              │
│  Gallery Images (optional - adds to existing)                │
│  [Choose Files]                                              │
│                                                              │
│  [Update Project]  [Cancel]                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### Step 2: Make Changes

- Edit any text fields
- Upload new cover image (optional)
- Add more gallery images (optional)
- Existing images remain unless you upload new ones

#### Step 3: Save

- Click "Update Project"
- Changes appear immediately on website!

---

### Deleting a Project

#### Step 1: Click "Delete" on any project

A confirmation dialog appears:

```
┌─────────────────────────────────────────────────────────────┐
│                      CONFIRM DELETE                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Are you sure you want to delete this project?              │
│                                                              │
│  This action cannot be undone.                               │
│                                                              │
│  [Cancel]  [Delete]                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### Step 2: Confirm

- Click "Delete" to confirm
- Project removed immediately from website
- Images remain in storage (can be manually deleted)

---

## 👥 Managing Team Members

### Viewing All Team Members

Click "Manage Team" to see all team members:

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Dashboard       MANAGE TEAM    [+ Add Team Member]│
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │                  │  │                  │                │
│  │   [Photo]        │  │   [Photo]        │                │
│  │                  │  │                  │                │
│  │ Chandan Kasturwar│  │ Arjun Varma      │                │
│  │ Founder & Chief  │  │ Lead Architect   │                │
│  │ Architect        │  │                  │                │
│  │                  │  │                  │                │
│  │ Studied bamboo...│  │ Specializes in...│                │
│  │                  │  │                  │                │
│  │ [Edit] [Delete]  │  │ [Edit] [Delete]  │                │
│  └──────────────────┘  └──────────────────┘                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

### Adding a New Team Member

#### Step 1: Click "+ Add Team Member"

A form appears:

```
┌─────────────────────────────────────────────────────────────┐
│                   ADD NEW TEAM MEMBER                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Name *                  Role *                              │
│  [________________]      [________________]                  │
│                                                              │
│  Bio *                                                       │
│  [________________________________________________]          │
│  [________________________________________________]          │
│  [________________________________________________]          │
│                                                              │
│  Display Order                                               │
│  [0_________]                                                │
│  Lower numbers appear first                                  │
│                                                              │
│  Photo *                                                     │
│  [Choose File]                                               │
│  Images will be automatically compressed to max 1MB          │
│                                                              │
│  [Add Member]  [Cancel]                                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### Step 2: Fill in the Form

**Required Fields:**

1. **Name**
   - Example: "Chandan Kasturwar"
   - Full name of team member

2. **Role**
   - Example: "Founder & Chief Architect"
   - Job title or position

3. **Bio**
   - Example: "Studied bamboo construction in Bali and Kerala..."
   - 2-3 sentences about the person
   - Their expertise and background

4. **Photo**
   - Professional headshot
   - Square format works best
   - Will be compressed to max 1MB

**Optional Fields:**

5. **Display Order**
   - Default: 0
   - Lower numbers appear first
   - Example: 0, 1, 2, 3...
   - Use to control order on About page

#### Step 3: Upload Photo

- Click "Choose File"
- Select professional photo
- Square format recommended
- Image will be automatically compressed

#### Step 4: Submit

- Click "Add Member"
- Member appears immediately on About page!

---

### Editing a Team Member

#### Step 1: Click "Edit" on any member

Form pre-fills with existing data:

```
┌─────────────────────────────────────────────────────────────┐
│                   EDIT TEAM MEMBER                           │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Name *                  Role *                              │
│  [Chandan Kasturwar]    [Founder & Chief Architect]         │
│                                                              │
│  Bio *                                                       │
│  [Studied bamboo construction in Bali and Kerala...]        │
│  [________________________________________________]          │
│                                                              │
│  Display Order                                               │
│  [0_________]                                                │
│                                                              │
│  Photo (optional - leave empty to keep current)              │
│  [Choose File]                                               │
│                                                              │
│  [Update Member]  [Cancel]                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### Step 2: Make Changes

- Edit any text fields
- Upload new photo (optional)
- Change display order
- Existing photo remains unless you upload new one

#### Step 3: Save

- Click "Update Member"
- Changes appear immediately on website!

---

### Deleting a Team Member

#### Step 1: Click "Delete" on any member

Confirmation dialog appears:

```
┌─────────────────────────────────────────────────────────────┐
│                      CONFIRM DELETE                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Are you sure you want to delete this team member?          │
│                                                              │
│  This action cannot be undone.                               │
│                                                              │
│  [Cancel]  [Delete]                                          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

#### Step 2: Confirm

- Click "Delete" to confirm
- Member removed immediately from website
- Photo remains in storage (can be manually deleted)

---

## 💡 Tips & Best Practices

### For Projects:

1. **Use Descriptive Names**
   - Good: "Bamboo Villa, Goa"
   - Bad: "Project 1"

2. **Write Compelling Descriptions**
   - Tell the story
   - Mention unique features
   - Include client testimonials (optional)

3. **Choose Quality Images**
   - High resolution (will be compressed)
   - Good lighting
   - Show different angles
   - Include detail shots

4. **Use Relevant Tags**
   - Help with filtering
   - Be specific
   - 3-5 tags per project

5. **Keep Slugs Simple**
   - Use lowercase
   - Use dashes, not spaces
   - Keep it short
   - Example: "bamboo-villa-goa"

### For Team Members:

1. **Professional Photos**
   - Good lighting
   - Clean background
   - Square format
   - Smiling/approachable

2. **Concise Bios**
   - 2-3 sentences
   - Highlight expertise
   - Mention achievements
   - Keep it professional yet personal

3. **Set Display Order**
   - Founder/CEO: 0
   - Senior team: 1, 2, 3...
   - Junior team: 10, 11, 12...
   - Leaves room for additions

### For Images:

1. **Before Upload**
   - Use highest quality available
   - Don't pre-compress
   - System will compress automatically

2. **File Formats**
   - JPEG recommended
   - PNG works too
   - WebP supported

3. **File Sizes**
   - Upload any size
   - System compresses to max 1MB
   - No need to resize manually

---

## 🔄 Workflow Examples

### Adding a New Project (Complete Workflow)

1. Login to `/admin`
2. Click "Manage Projects"
3. Click "+ Add Project"
4. Fill in all required fields
5. Upload cover image
6. Upload 4-6 gallery images
7. Add 3-5 relevant tags
8. Click "Create Project"
9. Wait for upload (10-30 seconds)
10. Success! View on `/projects` page

**Time: 5-10 minutes per project**

---

### Updating Team Member Photo

1. Login to `/admin`
2. Click "Manage Team"
3. Find the team member
4. Click "Edit"
5. Click "Choose File" under Photo
6. Select new photo
7. Click "Update Member"
8. Success! View on `/about` page

**Time: 1-2 minutes**

---

### Reordering Team Members

1. Login to `/admin`
2. Click "Manage Team"
3. Edit each member
4. Set Display Order:
   - First person: 0
   - Second person: 1
   - Third person: 2
   - etc.
5. Save each member
6. View on `/about` page to verify order

**Time: 5 minutes for full team**

---

## 🚨 Common Issues & Solutions

### Issue: Images not uploading

**Solutions:**
- Check file size (should be under 50MB before compression)
- Check file format (JPEG, PNG, WebP)
- Check internet connection
- Try a different image
- Check browser console for errors

### Issue: Form not submitting

**Solutions:**
- Fill in all required fields (marked with *)
- Check for error messages
- Refresh page and try again
- Check internet connection

### Issue: Changes not appearing

**Solutions:**
- Hard refresh page (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- Check if you're logged in
- Verify changes in admin panel

### Issue: Can't login

**Solutions:**
- Check email/password
- Verify admin user exists in Supabase
- Clear browser cookies
- Try incognito/private window

---

## 📊 Admin Panel Statistics

After using the admin panel, you can track:

- **Total Projects**: View count in project list
- **Total Team Members**: View count in team list
- **Storage Used**: Check Supabase Dashboard
- **Recent Updates**: Check `updated_at` timestamps

---

## 🎓 Video Tutorial (Coming Soon)

A video walkthrough of the admin panel will be available showing:
- How to login
- Adding a project step-by-step
- Adding a team member
- Editing and deleting content
- Best practices for images

---

## 📞 Need Help?

If you encounter issues:

1. Check this guide first
2. Review browser console for errors
3. Check Supabase Dashboard for data
4. Verify .env configuration
5. Review IMPLEMENTATION_GUIDE.md

---

## ✅ Admin Panel Checklist

- [ ] Can login successfully
- [ ] Can view all projects
- [ ] Can add new project
- [ ] Can edit existing project
- [ ] Can delete project
- [ ] Can upload images
- [ ] Can view all team members
- [ ] Can add new team member
- [ ] Can edit team member
- [ ] Can delete team member
- [ ] Images are compressed
- [ ] Changes appear on website
- [ ] Can logout successfully

---

**You're now ready to manage your BAANS INFRA website! 🎉**

*For technical details, see [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)*
