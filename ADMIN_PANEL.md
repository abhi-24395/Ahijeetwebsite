# Admin Panel Documentation

## Overview

The admin panel allows you to manage your portfolio work items directly from the website. You can add, view, and delete work items with images and videos.

## Setup

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `express-session` - For authentication sessions
- `multer` - For file uploads
- `bcrypt` - For password hashing

### 2. Default Credentials

**Default Username:** `abhi24395`  
**Default Password:** `Abjeeth1`

⚠️ **Note:** If you already have an existing `data/users.json` from a previous install (e.g. with `admin`/`admin123`), delete that file and restart the server to create the new default user, or add your user manually.

### 3. Access Admin Panel

1. Start your server: `npm start`
2. Navigate to: `http://localhost:3000/admin/login`
3. Login with your credentials

## Features

### Adding Work Items

1. Fill in the form:
   - **Title** (required): Name of your work/project
   - **Description** (required): Detailed description
   - **Category**: Select from dropdown (IoT, Creative Technology, etc.)
   - **Tags**: Comma-separated tags (e.g., "ESP32, IoT, LED")
   - **External Link**: Optional URL to project
   - **Image**: Upload an image (JPG, PNG, GIF)
   - **Video**: Upload a video (MP4, WebM, MOV)

2. Click "Add Work" to save

### Managing Works

- View all your works in the right panel
- Delete works by clicking the "Delete" button
- Works are displayed with previews of images/videos

## File Storage

- **Uploads**: Stored in `public/uploads/`
- **Data**: Work items stored in `data/works.json`
- **Users**: User credentials stored in `data/users.json`

## Security

### Changing Password

To change your password, you can:

1. **Manual Method**: Edit `data/users.json` and hash a new password:

```javascript
const bcrypt = require('bcrypt');
const newPassword = await bcrypt.hash('your-new-password', 10);
// Replace the password in data/users.json
```

2. **Programmatic Method**: Create a script to update the password

### Session Security

- Sessions expire after 24 hours
- Sessions are stored server-side
- Use HTTPS in production (set `NODE_ENV=production`)

## API Endpoints

### Admin Routes (Protected)

- `GET /admin/login` - Login page
- `GET /admin/dashboard` - Dashboard (requires auth)
- `POST /admin/login` - Login API
- `POST /admin/logout` - Logout API
- `GET /admin/works` - Get all works
- `POST /admin/works` - Add new work
- `PUT /admin/works/:id` - Update work
- `DELETE /admin/works/:id` - Delete work

### Public Routes

- `GET /api/works` - Get all works (for main website)

## File Upload Limits

- **Max file size**: 50MB per file
- **Allowed image types**: JPEG, JPG, PNG, GIF
- **Allowed video types**: MP4, WebM, MOV

## Environment Variables

Add to your `.env` file:

```
SESSION_SECRET=your-secret-key-here-change-this
NODE_ENV=development
PORT=3000
```

## Troubleshooting

### Can't login
- Check that `data/users.json` exists
- Verify password is correctly hashed
- Check browser console for errors

### File upload fails
- Ensure `public/uploads/` directory exists
- Check file size (max 50MB)
- Verify file type is allowed

### Works not showing
- Check `data/works.json` exists
- Verify file permissions
- Check server logs for errors

## Next Steps

1. Change default password immediately
2. Add your first work item
3. Customize categories as needed
4. Set up proper session secret in production

