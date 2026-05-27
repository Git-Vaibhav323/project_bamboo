# 🗄️ BAANS INFRA - Database Structure

## Overview

The BAANS INFRA website uses **Supabase** (PostgreSQL) as its backend database with two main tables and two storage buckets.

---

## 📊 Database Tables

### 1. Projects Table (`public.projects`)

Stores all project portfolio information.

```
┌─────────────────────────────────────────────────────────────┐
│                      PROJECTS TABLE                          │
├─────────────────┬──────────────┬──────────────────────────────┤
│ Column          │ Type         │ Description                  │
├─────────────────┼──────────────┼──────────────────────────────┤
│ id              │ UUID         │ Primary Key (auto-generated) │
│ slug            │ TEXT         │ URL identifier (unique)      │
│ name            │ TEXT         │ Project name                 │
│ location        │ TEXT         │ City, State                  │
│ state           │ TEXT         │ State name                   │
│ type            │ TEXT         │ Project category             │
│ year            │ TEXT         │ Completion year              │
│ duration        │ TEXT         │ Build duration               │
│ size            │ TEXT         │ Square footage               │
│ description     │ TEXT         │ Full description             │
│ cover_image     │ TEXT         │ Cover image URL              │
│ gallery_images  │ TEXT[]       │ Array of image URLs          │
│ tags            │ TEXT[]       │ Array of tags                │
│ created_at      │ TIMESTAMP    │ Auto-generated               │
│ updated_at      │ TIMESTAMP    │ Auto-updated on change       │
└─────────────────┴──────────────┴──────────────────────────────┘

Indexes:
  - idx_projects_slug (slug)
  - idx_projects_type (type)
  - idx_projects_state (state)
  - idx_projects_created_at (created_at DESC)

Constraints:
  - slug: UNIQUE
  - type: CHECK (type IN ('Resorts', 'Villas', 'Pavilions & Commercial', 'Rammed Earth'))
```

#### Example Row:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "slug": "bamboo-villa-goa",
  "name": "Bamboo Villa, Goa",
  "location": "Assagao, North Goa",
  "state": "Goa",
  "type": "Villas",
  "year": "2023",
  "duration": "3 months",
  "size": "1,800 sq ft",
  "description": "A private Bali-inspired villa...",
  "cover_image": "https://xxx.supabase.co/storage/v1/object/public/project-images/...",
  "gallery_images": [
    "https://xxx.supabase.co/storage/v1/object/public/project-images/...",
    "https://xxx.supabase.co/storage/v1/object/public/project-images/..."
  ],
  "tags": ["Bali-style", "Private Villa", "Coastal"],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

### 2. Team Members Table (`public.team_members`)

Stores team member profiles and information.

```
┌─────────────────────────────────────────────────────────────┐
│                   TEAM MEMBERS TABLE                         │
├─────────────────┬──────────────┬──────────────────────────────┤
│ Column          │ Type         │ Description                  │
├─────────────────┼──────────────┼──────────────────────────────┤
│ id              │ UUID         │ Primary Key (auto-generated) │
│ name            │ TEXT         │ Member name                  │
│ role            │ TEXT         │ Job title                    │
│ bio             │ TEXT         │ Biography                    │
│ image           │ TEXT         │ Photo URL                    │
│ order           │ INTEGER      │ Display order (0 = first)    │
│ created_at      │ TIMESTAMP    │ Auto-generated               │
│ updated_at      │ TIMESTAMP    │ Auto-updated on change       │
└─────────────────┴──────────────┴──────────────────────────────┘

Indexes:
  - idx_team_members_order (order)

Constraints:
  - None
```

#### Example Row:
```json
{
  "id": "987f6543-e21b-43d2-b789-123456789abc",
  "name": "Chandan Kasturwar",
  "role": "Founder & Chief Architect",
  "bio": "Studied bamboo construction in Bali and Kerala...",
  "image": "https://xxx.supabase.co/storage/v1/object/public/team-images/...",
  "order": 0,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

---

## 🗂️ Storage Buckets

### 1. Project Images Bucket (`project-images`)

Stores all project-related images (cover images and gallery images).

```
┌─────────────────────────────────────────────────────────────┐
│                  PROJECT-IMAGES BUCKET                       │
├──────────────────────────────────────────────────────────────┤
│ Settings:                                                    │
│   - Public: Yes                                              │
│   - Max File Size: 5MB                                       │
│   - Allowed Types: image/jpeg, image/png, image/webp        │
│                                                              │
│ File Structure:                                              │
│   /projects/                                                 │
│     ├── project-slug-cover-timestamp.jpg                     │
│     ├── project-slug-gallery-0-timestamp.jpg                 │
│     ├── project-slug-gallery-1-timestamp.jpg                 │
│     └── ...                                                  │
└──────────────────────────────────────────────────────────────┘
```

#### Example Files:
```
/projects/bamboo-villa-goa-cover-1705315800000.jpg
/projects/bamboo-villa-goa-gallery-0-1705315801000.jpg
/projects/bamboo-villa-goa-gallery-1-1705315802000.jpg
```

---

### 2. Team Images Bucket (`team-images`)

Stores all team member profile photos.

```
┌─────────────────────────────────────────────────────────────┐
│                   TEAM-IMAGES BUCKET                         │
├──────────────────────────────────────────────────────────────┤
│ Settings:                                                    │
│   - Public: Yes                                              │
│   - Max File Size: 5MB                                       │
│   - Allowed Types: image/jpeg, image/png, image/webp        │
│                                                              │
│ File Structure:                                              │
│   /team/                                                     │
│     ├── member-name-timestamp.jpg                            │
│     ├── member-name-timestamp.jpg                            │
│     └── ...                                                  │
└──────────────────────────────────────────────────────────────┘
```

#### Example Files:
```
/team/chandan-kasturwar-1705315800000.jpg
/team/arjun-varma-1705315801000.jpg
```

---

## 🔐 Row Level Security (RLS) Policies

### Projects Table Policies

```sql
┌─────────────────────────────────────────────────────────────┐
│                    PROJECTS RLS POLICIES                     │
├──────────────┬──────────────┬───────────────────────────────┤
│ Operation    │ Who          │ Condition                     │
├──────────────┼──────────────┼───────────────────────────────┤
│ SELECT       │ public       │ Always allowed                │
│ INSERT       │ authenticated│ Always allowed                │
│ UPDATE       │ authenticated│ Always allowed                │
│ DELETE       │ authenticated│ Always allowed                │
└──────────────┴──────────────┴───────────────────────────────┘
```

### Team Members Table Policies

```sql
┌─────────────────────────────────────────────────────────────┐
│                 TEAM MEMBERS RLS POLICIES                    │
├──────────────┬──────────────┬───────────────────────────────┤
│ Operation    │ Who          │ Condition                     │
├──────────────┼──────────────┼───────────────────────────────┤
│ SELECT       │ public       │ Always allowed                │
│ INSERT       │ authenticated│ Always allowed                │
│ UPDATE       │ authenticated│ Always allowed                │
│ DELETE       │ authenticated│ Always allowed                │
└──────────────┴──────────────┴───────────────────────────────┘
```

### Storage Bucket Policies

```sql
┌─────────────────────────────────────────────────────────────┐
│                   STORAGE RLS POLICIES                       │
├──────────────┬──────────────┬───────────────────────────────┤
│ Bucket       │ Operation    │ Who          │ Condition      │
├──────────────┼──────────────┼──────────────┼────────────────┤
│ project-     │ SELECT       │ public       │ Always allowed │
│ images       │ INSERT       │ authenticated│ Always allowed │
│              │ UPDATE       │ authenticated│ Always allowed │
│              │ DELETE       │ authenticated│ Always allowed │
├──────────────┼──────────────┼──────────────┼────────────────┤
│ team-        │ SELECT       │ public       │ Always allowed │
│ images       │ INSERT       │ authenticated│ Always allowed │
│              │ UPDATE       │ authenticated│ Always allowed │
│              │ DELETE       │ authenticated│ Always allowed │
└──────────────┴──────────────┴──────────────┴────────────────┘
```

---

## 🔄 Database Triggers

### Updated At Trigger

Automatically updates the `updated_at` timestamp whenever a row is modified.

```sql
┌─────────────────────────────────────────────────────────────┐
│                    UPDATED_AT TRIGGER                        │
├──────────────────────────────────────────────────────────────┤
│ Function: handle_updated_at()                                │
│                                                              │
│ Applied To:                                                  │
│   - projects table                                           │
│   - team_members table                                       │
│                                                              │
│ Trigger Type: BEFORE UPDATE                                  │
│                                                              │
│ Action:                                                      │
│   Sets NEW.updated_at = CURRENT_TIMESTAMP                    │
└──────────────────────────────────────────────────────────────┘
```

---

## 📈 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        DATA FLOW                             │
└─────────────────────────────────────────────────────────────┘

PUBLIC USER (Website Visitor)
    │
    ├─→ View Projects ──→ SELECT from projects table
    │                     (RLS: public allowed)
    │
    └─→ View Team ──────→ SELECT from team_members table
                          (RLS: public allowed)


ADMIN USER (Logged In)
    │
    ├─→ Login ──────────→ Supabase Auth
    │                     (Email/Password)
    │
    ├─→ Add Project ────→ 1. Compress images
    │                     2. Upload to project-images bucket
    │                     3. INSERT into projects table
    │                     (RLS: authenticated allowed)
    │
    ├─→ Edit Project ───→ 1. Compress new images (if any)
    │                     2. Upload to project-images bucket
    │                     3. UPDATE projects table
    │                     (RLS: authenticated allowed)
    │
    ├─→ Delete Project ─→ DELETE from projects table
    │                     (RLS: authenticated allowed)
    │                     Note: Images remain in storage
    │
    ├─→ Add Team Member ─→ 1. Compress image
    │                      2. Upload to team-images bucket
    │                      3. INSERT into team_members table
    │                      (RLS: authenticated allowed)
    │
    ├─→ Edit Team Member ─→ 1. Compress new image (if any)
    │                       2. Upload to team-images bucket
    │                       3. UPDATE team_members table
    │                       (RLS: authenticated allowed)
    │
    └─→ Delete Team Member ─→ DELETE from team_members table
                              (RLS: authenticated allowed)
                              Note: Images remain in storage
```

---

## 🔍 Query Examples

### Get All Projects
```sql
SELECT * FROM projects
ORDER BY created_at DESC;
```

### Get Projects by Type
```sql
SELECT * FROM projects
WHERE type = 'Resorts'
ORDER BY created_at DESC;
```

### Get Projects by State
```sql
SELECT * FROM projects
WHERE state = 'Goa'
ORDER BY created_at DESC;
```

### Get Single Project by Slug
```sql
SELECT * FROM projects
WHERE slug = 'bamboo-villa-goa'
LIMIT 1;
```

### Get All Team Members (Ordered)
```sql
SELECT * FROM team_members
ORDER BY "order" ASC;
```

### Search Projects by Name or Location
```sql
SELECT * FROM projects
WHERE name ILIKE '%bamboo%'
   OR location ILIKE '%bamboo%'
ORDER BY created_at DESC;
```

---

## 📊 Database Statistics

### Current Schema:
- **Tables**: 2 (projects, team_members)
- **Storage Buckets**: 2 (project-images, team-images)
- **Indexes**: 5 total
- **Triggers**: 2 (updated_at on both tables)
- **RLS Policies**: 8 (4 per table)
- **Storage Policies**: 8 (4 per bucket)

### Expected Data Volume:
- **Projects**: 50-100 rows (typical portfolio)
- **Team Members**: 5-20 rows (typical team size)
- **Project Images**: 500-1000 files (10-20 per project)
- **Team Images**: 5-20 files (1 per member)

### Storage Estimates:
- **Per Project**: ~5-10 MB (cover + gallery)
- **Per Team Member**: ~500 KB - 1 MB (profile photo)
- **Total Storage**: ~500 MB - 1 GB (for full portfolio)

---

## 🛠️ Maintenance

### Regular Tasks:
1. **Backup Database**: Supabase handles automatic backups
2. **Monitor Storage**: Check storage usage in Supabase Dashboard
3. **Clean Old Images**: Manually delete unused images from storage
4. **Update Indexes**: Add indexes if queries become slow

### Performance Optimization:
- Indexes already created on frequently queried columns
- Images compressed before upload (max 1MB)
- RLS policies optimized for read performance
- Timestamps indexed for sorting

---

## 🔗 Relationships

```
┌─────────────────────────────────────────────────────────────┐
│                      RELATIONSHIPS                           │
└─────────────────────────────────────────────────────────────┘

projects table
    │
    ├─→ cover_image ──────→ project-images bucket
    │                       (URL reference)
    │
    └─→ gallery_images[] ─→ project-images bucket
                            (Array of URL references)

team_members table
    │
    └─→ image ────────────→ team-images bucket
                            (URL reference)

Note: No foreign key constraints between tables and storage.
      URLs are stored as TEXT references.
```

---

## 📝 Notes

1. **No Foreign Keys**: Storage URLs are stored as text references, not foreign keys
2. **Cascade Deletes**: Not implemented - images remain in storage after row deletion
3. **Image Cleanup**: Manual cleanup required for orphaned images
4. **Timestamps**: Automatically managed by triggers
5. **UUIDs**: Auto-generated for all primary keys
6. **Arrays**: PostgreSQL native arrays used for tags and gallery images

---

## 🎯 Best Practices

1. **Always compress images** before upload (handled automatically)
2. **Use unique slugs** for projects (enforced by database)
3. **Set proper display order** for team members
4. **Add descriptive tags** to projects for better filtering
5. **Use high-quality images** (will be compressed to 1MB)
6. **Regular backups** (Supabase handles this)
7. **Monitor storage usage** in Supabase Dashboard

---

**Database structure is production-ready and scalable! 🚀**
