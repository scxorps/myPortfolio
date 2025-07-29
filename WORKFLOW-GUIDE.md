# 🚀 Portfolio Development Workflow Guide

## 📋 Branch Structure

### `main` Branch (Development)
- **Purpose**: Source code development and maintenance
- **Contains**: 
  - `src/` folder with source HTML, SCSS, JS
  - `package.json` with dependencies
  - Development tools and configuration
  - Original video files in `assets/`

### `gh-pages` Branch (Production)
- **Purpose**: Compiled website ready for GitHub Pages
- **Contains**:
  - Compiled `index.html`
  - Compiled CSS and JS with hashed filenames
  - Optimized images and videos
  - `.nojekyll` file for GitHub Pages

## 🔄 Development Workflow

### Option 1: Manual Workflow
1. **Work on `main` branch**:
   ```bash
   git checkout main
   # Make your changes in src/ folder
   git add .
   git commit -m "Your changes description"
   git push origin main
   ```

2. **Build and deploy**:
   ```bash
   npm run build
   git checkout gh-pages
   # Copy dist/* to root
   # Copy videos if needed
   git add . 
   git commit -m "Deploy latest changes"
   git push origin gh-pages
   ```

### Option 2: Automated Workflow (Recommended)
Simply run the automated script:
```bash
# Windows Batch
.\deploy-automated.bat

# Or PowerShell
.\deploy-automated.ps1
```

## 📝 Best Practices

### When Making Changes:
1. ✅ Always work in `main` branch for development
2. ✅ Edit files in the `src/` folder only
3. ✅ Test locally with `npm run dev`
4. ✅ Use automated deployment script
5. ❌ Never edit compiled files directly in `gh-pages`

### File Locations:
- **HTML Source**: `src/index.html` 
- **Styles**: `src/styles.scss`
- **Scripts**: `src/index.js`
- **Assets**: `assets/` (videos, images, etc.)

### Video Management:
- **Source videos**: Keep original names in `assets/` (main branch)
- **Compiled videos**: Parcel will generate hashed names (gh-pages branch)
- **HTML references**: Use `assets/video-name.mp4` in source

## 🛠️ Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Automated deployment
.\deploy-automated.bat    # Windows Batch
.\deploy-automated.ps1    # PowerShell
```

## 🌐 URLs

- **Live Site**: https://scxorps.github.io/myPortfolio
- **Repository**: https://github.com/scxorps/myPortfolio
- **Main Branch**: https://github.com/scxorps/myPortfolio/tree/main
- **Gh-pages Branch**: https://github.com/scxorps/myPortfolio/tree/gh-pages

## ✨ Current Features

- ✅ WhatsApp integration (+213 551997620)
- ✅ Project demo videos (DEMIO, DAWRA, WEATHERLY)
- ✅ Contact buttons (Email, Call, WhatsApp)
- ✅ Non-clickable videos (only Source Code buttons are clickable)
- ✅ Responsive design
- ✅ Proper video autoplay with fallbacks

## 🚨 Troubleshooting

### If deployment fails:
1. Check if you're on the correct branch
2. Make sure all changes are committed
3. Run `npm install` if dependencies are missing
4. Check for build errors with `npm run build`

### If videos don't show:
1. Ensure video files are in `assets/` folder (main branch)
2. Check file names match HTML references
3. Verify videos are copied to gh-pages during build

### If styles don't apply:
1. Edit `src/styles.scss` (not compiled CSS)
2. Run build process to compile SCSS to CSS
3. Deploy to gh-pages to see changes live

Remember: Always work in `main` → Build → Deploy to `gh-pages` 🎯
