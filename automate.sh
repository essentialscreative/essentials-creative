#!/bin/bash

# Essentials Creative Website Automation Script
# Handles common maintenance tasks for the website

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Essentials Creative Site Automation${NC}"
echo "======================================="

# Function to display menu
show_menu() {
    echo ""
    echo "Select an option:"
    echo "1) Check for broken links"
    echo "2) Optimize images (create WebP versions)"
    echo "3) Validate HTML files"
    echo "4) Check for placeholder content"
    echo "5) Generate sitemap"
    echo "6) Prepare for deployment"
    echo "7) Run all checks"
    echo "8) Exit"
    echo ""
    read -p "Enter choice: " choice
}

# Function to check for broken internal links
check_links() {
    echo -e "${YELLOW}🔍 Checking for broken internal links...${NC}"
    
    broken_links=0
    for file in *.html; do
        if [ -f "$file" ]; then
            # Extract href and src attributes
            links=$(grep -oE '(href|src)="[^"]*"' "$file" | grep -oE '"[^"]*"' | tr -d '"')
            
            for link in $links; do
                # Skip external links, anchors, and mailto
                if [[ ! "$link" =~ ^(http|https|mailto|#|javascript:) ]]; then
                    # Check if file exists
                    if [ ! -f "$link" ] && [ ! -d "$link" ]; then
                        echo -e "${RED}  ❌ Broken link in $file: $link${NC}"
                        ((broken_links++))
                    fi
                fi
            done
        fi
    done
    
    if [ $broken_links -eq 0 ]; then
        echo -e "${GREEN}  ✅ All internal links are valid!${NC}"
    else
        echo -e "${RED}  Found $broken_links broken links${NC}"
    fi
}

# Function to optimize images
optimize_images() {
    echo -e "${YELLOW}🖼️  Optimizing images...${NC}"
    
    # Check if cwebp is installed
    if ! command -v cwebp &> /dev/null; then
        echo -e "${RED}  ❌ cwebp not found. Install with: brew install webp${NC}"
        return 1
    fi
    
    converted=0
    for img in assets/images/**/*.{jpg,jpeg,png,JPG,JPEG,PNG}; do
        if [ -f "$img" ]; then
            webp_file="${img%.*}.webp"
            if [ ! -f "$webp_file" ]; then
                echo "  Converting: $img"
                cwebp -q 80 "$img" -o "$webp_file" 2>/dev/null
                ((converted++))
            fi
        fi
    done
    
    echo -e "${GREEN}  ✅ Converted $converted images to WebP${NC}"
}

# Function to validate HTML
validate_html() {
    echo -e "${YELLOW}📝 Validating HTML structure...${NC}"
    
    errors=0
    for file in *.html; do
        if [ -f "$file" ]; then
            # Check for basic HTML structure
            if ! grep -q "<!DOCTYPE html>" "$file"; then
                echo -e "${RED}  ❌ Missing DOCTYPE in $file${NC}"
                ((errors++))
            fi
            if ! grep -q "<html" "$file"; then
                echo -e "${RED}  ❌ Missing <html> tag in $file${NC}"
                ((errors++))
            fi
            if ! grep -q "</html>" "$file"; then
                echo -e "${RED}  ❌ Missing </html> tag in $file${NC}"
                ((errors++))
            fi
        fi
    done
    
    if [ $errors -eq 0 ]; then
        echo -e "${GREEN}  ✅ All HTML files have valid structure${NC}"
    else
        echo -e "${RED}  Found $errors HTML structure issues${NC}"
    fi
}

# Function to check for placeholder content
check_placeholders() {
    echo -e "${YELLOW}🔍 Checking for placeholder content...${NC}"
    
    placeholders=0
    keywords="Lorem ipsum|TODO|TBD|PLACEHOLDER|Coming Soon|Under Construction"
    
    for file in *.html; do
        if [ -f "$file" ]; then
            matches=$(grep -iE "$keywords" "$file" 2>/dev/null | head -5)
            if [ ! -z "$matches" ]; then
                echo -e "${YELLOW}  ⚠️  Found placeholders in $file:${NC}"
                echo "$matches" | head -3
                ((placeholders++))
            fi
        fi
    done
    
    if [ $placeholders -eq 0 ]; then
        echo -e "${GREEN}  ✅ No placeholder content found${NC}"
    else
        echo -e "${YELLOW}  Found placeholders in $placeholders files${NC}"
    fi
}

# Function to generate sitemap
generate_sitemap() {
    echo -e "${YELLOW}🗺️  Generating sitemap...${NC}"
    
    cat > sitemap.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
EOF
    
    base_url="https://essentialscreative.com"
    priority="1.0"
    
    for file in *.html; do
        if [ -f "$file" ]; then
            if [ "$file" = "index.html" ]; then
                priority="1.0"
            else
                priority="0.8"
            fi
            
            # Get last modified date
            if [[ "$OSTYPE" == "darwin"* ]]; then
                lastmod=$(stat -f "%Sm" -t "%Y-%m-%d" "$file")
            else
                lastmod=$(date -r "$file" "+%Y-%m-%d")
            fi
            
            cat >> sitemap.xml << EOF
    <url>
        <loc>$base_url/${file}</loc>
        <lastmod>$lastmod</lastmod>
        <changefreq>monthly</changefreq>
        <priority>$priority</priority>
    </url>
EOF
        fi
    done
    
    echo "</urlset>" >> sitemap.xml
    echo -e "${GREEN}  ✅ Sitemap generated: sitemap.xml${NC}"
}

# Function to prepare for deployment
prepare_deployment() {
    echo -e "${YELLOW}🚀 Preparing for deployment...${NC}"
    
    # Remove backup files
    echo "  Removing backup files..."
    find . -name "*.backup" -type f -delete 2>/dev/null || true
    find . -name "*~" -type f -delete 2>/dev/null || true
    find . -name ".DS_Store" -type f -delete 2>/dev/null || true
    
    # Check for large files
    echo "  Checking for large files (>5MB)..."
    large_files=$(find assets -type f -size +5M 2>/dev/null)
    if [ ! -z "$large_files" ]; then
        echo -e "${YELLOW}  ⚠️  Large files found:${NC}"
        echo "$large_files"
    fi
    
    # Create deployment checklist
    cat > deployment-checklist.txt << EOF
DEPLOYMENT CHECKLIST
====================
Generated: $(date)

Before deploying, ensure:
[ ] All placeholder content has been replaced
[ ] All images have WebP versions
[ ] No broken internal links
[ ] HTML validation passes
[ ] Large images are optimized (under 1MB ideally)
[ ] Git repository is up to date
[ ] Content has been reviewed for accuracy

Netlify Deploy Command:
  netlify deploy --prod

Or drag and drop the folder to Netlify dashboard
EOF
    
    echo -e "${GREEN}  ✅ Deployment preparation complete${NC}"
    echo -e "${GREEN}  📋 Review deployment-checklist.txt${NC}"
}

# Function to run all checks
run_all_checks() {
    echo -e "${GREEN}Running all checks...${NC}"
    echo "===================="
    check_links
    echo ""
    validate_html
    echo ""
    check_placeholders
    echo ""
    generate_sitemap
    echo ""
    echo -e "${GREEN}All checks complete!${NC}"
}

# Main loop
while true; do
    show_menu
    
    case $choice in
        1)
            check_links
            ;;
        2)
            optimize_images
            ;;
        3)
            validate_html
            ;;
        4)
            check_placeholders
            ;;
        5)
            generate_sitemap
            ;;
        6)
            prepare_deployment
            ;;
        7)
            run_all_checks
            ;;
        8)
            echo -e "${GREEN}Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option${NC}"
            ;;
    esac
done