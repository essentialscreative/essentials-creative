#!/bin/bash

# Quick Deployment Script for Essentials Creative
# Run this before deploying to Netlify

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 Quick Deploy Preparation${NC}"
echo "=========================="

# 1. Clean up unnecessary files
echo -e "${YELLOW}Cleaning up...${NC}"
find . -name ".DS_Store" -delete 2>/dev/null || true
find . -name "*.backup" -delete 2>/dev/null || true
rm -f deployment-checklist.txt 2>/dev/null || true

# 2. Check for critical issues
echo -e "${YELLOW}Checking for critical issues...${NC}"

# Check for broken image links in HTML
broken_images=0
for file in *.html; do
    if [ -f "$file" ]; then
        images=$(grep -oE 'src="assets/images/[^"]*"' "$file" | grep -oE '"[^"]*"' | tr -d '"')
        for img in $images; do
            # Decode URL-encoded spaces
            decoded_img=$(echo "$img" | sed 's/%20/ /g')
            if [ ! -f "$decoded_img" ]; then
                echo -e "${RED}  ❌ Missing image in $file: $decoded_img${NC}"
                ((broken_images++))
            fi
        done
    fi
done

if [ $broken_images -eq 0 ]; then
    echo -e "${GREEN}  ✅ All images found${NC}"
fi

# 3. Generate fresh sitemap
echo -e "${YELLOW}Generating sitemap...${NC}"
cat > sitemap.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
EOF

for file in *.html; do
    if [ -f "$file" ]; then
        priority="0.8"
        [ "$file" = "index.html" ] && priority="1.0"
        
        cat >> sitemap.xml << EOF
    <url>
        <loc>https://essentialscreative.com/${file}</loc>
        <changefreq>monthly</changefreq>
        <priority>$priority</priority>
    </url>
EOF
    fi
done

echo "</urlset>" >> sitemap.xml
echo -e "${GREEN}  ✅ Sitemap generated${NC}"

# 4. Create deployment summary
echo ""
echo -e "${GREEN}📊 Deployment Summary${NC}"
echo "===================="
echo "Total HTML files: $(ls -1 *.html 2>/dev/null | wc -l)"
echo "Total images: $(find assets/images -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.webp" \) | wc -l)"
echo "Total CSS files: $(ls -1 assets/css/*.css 2>/dev/null | wc -l)"
echo "Total JS files: $(ls -1 assets/js/*.js 2>/dev/null | wc -l)"

# 5. Final checklist
echo ""
echo -e "${GREEN}✅ Ready for deployment!${NC}"
echo ""
echo "Deploy to Netlify:"
echo "  1. Visit https://app.netlify.com"
echo "  2. Drag this folder to the deployment area"
echo "  OR"
echo "  3. Use: netlify deploy --prod"
echo ""
echo -e "${YELLOW}Remember to test after deployment!${NC}"