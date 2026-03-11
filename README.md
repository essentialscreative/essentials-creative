# Essentials Creative Portfolio Website

**Version 2.0 - Neutral Redesign**  
**Professional multimedia collective portfolio**

## 🚀 Ready for Netlify Deployment

This folder contains the production-ready website for Essentials Creative with major improvements and refactoring completed February 2026.

### ✅ Deployment Checklist
- [x] HTML files updated with latest content
- [x] Instagram bio integrated: "Experimentation, fluidity & collaboration. Indigenous, Latin American & Asian artists. Photo. Video. Design. Installation — Austin, San Antonio & London."
- [x] Favicon updated to "FAV ICON.png"
- [x] Filter buttons removed from galleries
- [x] CSS and JavaScript files included
- [x] Font files included
- [x] Essential images included
- [x] Netlify configuration files included

## 📋 Critical Documentation

- **[CSS_LOCK.md](CSS_LOCK.md)** - Color variables and navigation rules (DO NOT MODIFY)
- **[STRUCTURE_MANIFEST.md](STRUCTURE_MANIFEST.md)** - File structure and dependencies
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Pre-deployment validation

## ⚠️ Important Rules

1. **Colors**: Primary colors are neutral gray (NOT green)
2. **Navigation**: `navigation.css` must load before `main.css`
3. **Mobile**: Hamburger menu only appears on mobile (<768px)
4. **Files**: Never deploy `/dev/` folder (contains 86+ test files)

### 📝 Version 2.0 Changes (February 14, 2026)
1. **Design**: Changed from green to neutral gray color scheme
2. **Performance**: Consolidated 27 CSS files to 9 core files
3. **Structure**: Moved 86+ test/backup files to `/dev/` folder
4. **Navigation**: Created centralized navigation component
5. **Documentation**: Added comprehensive deployment safeguards

### 🌐 Deployment Instructions

#### Option 1: Drag & Drop
1. Log in to Netlify
2. Drag this entire DEPLOY_TO_NETLIFY folder to the Netlify dashboard
3. Site will be live in minutes!

#### Option 2: Git Deployment
1. Push this folder to your Git repository
2. Connect the repository to Netlify
3. Set build settings (no build command needed - static site)
4. Deploy!

#### Option 3: Netlify CLI
```bash
# Install Netlify CLI if not already installed
npm install -g netlify-cli

# Deploy from this folder
netlify deploy --dir=. --prod
```

### 📁 Folder Structure
```
DEPLOY_TO_NETLIFY/
├── index.html (main site)
├── rhizomatic.html (project page)
├── tshirts.html (merchandise page)
├── 404.html (error page)
├── _headers (security headers)
├── _redirects (URL redirects)
├── netlify.toml (Netlify config)
├── assets/
│   ├── css/
│   ├── js/
│   ├── fonts/
│   └── images/
└── README.md (this file)
```

### ⚠️ Important Notes
- Gallery images are referenced but may need to be uploaded separately due to size
- Large image files should be optimized before final deployment
- Test all links after deployment

### 🔗 Contact
- Website: essentialscreative.com
- Instagram: @essentialscreative
- Email: essentialscreative@gmail.com

---
**Status**: Production Ready - Version 2.0 Locked  
**Last Updated**: February 14, 2026