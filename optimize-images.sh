#!/bin/bash

# Image Optimization Script for Essentials Creative
# This script optimizes images for web performance

echo "Starting image optimization..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick is not installed. Please install it first:"
    echo "brew install imagemagick"
    exit 1
fi

# Check if cwebp is installed for WebP conversion
if ! command -v cwebp &> /dev/null; then
    echo "WebP tools not installed. Please install:"
    echo "brew install webp"
    exit 1
fi

# Create optimized directories
mkdir -p assets/images/optimized
mkdir -p assets/images/optimized/hero
mkdir -p assets/images/optimized/gallery
mkdir -p assets/images/optimized/tapestry-designs

# Function to optimize JPEG/PNG images
optimize_image() {
    local input="$1"
    local output="$2"
    local max_width="$3"
    
    echo "Optimizing: $input"
    
    # Get original dimensions
    dimensions=$(identify -format "%wx%h" "$input")
    width=$(echo $dimensions | cut -d'x' -f1)
    
    # Resize if needed and optimize
    if [ "$width" -gt "$max_width" ]; then
        convert "$input" -resize "${max_width}>" -quality 85 -strip "$output"
    else
        convert "$input" -quality 85 -strip "$output"
    fi
}

# Function to create WebP version
create_webp() {
    local input="$1"
    local output="${input%.*}.webp"
    
    echo "Creating WebP: $output"
    cwebp -q 85 "$input" -o "$output" 2>/dev/null
}

# Optimize hero images (max 1920px wide)
echo "Optimizing hero images..."
for img in assets/images/botanical-hero-*.jpg assets/images/nopal-hero.jpg; do
    if [ -f "$img" ]; then
        filename=$(basename "$img")
        optimize_image "$img" "assets/images/optimized/hero/$filename" 1920
        create_webp "assets/images/optimized/hero/$filename"
    fi
done

# Optimize tapestry designs (these are way too large)
echo "Optimizing tapestry designs..."
for img in assets/images/tapestry-designs/*.jpg; do
    if [ -f "$img" ]; then
        filename=$(basename "$img")
        optimize_image "$img" "assets/images/optimized/tapestry-designs/$filename" 2048
        create_webp "assets/images/optimized/tapestry-designs/$filename"
    fi
done

# Optimize gallery images (max 1200px)
echo "Optimizing gallery images..."
find assets/images/gallery -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" | while read img; do
    if [ -f "$img" ]; then
        # Get relative path
        rel_path=${img#assets/images/gallery/}
        dir_path=$(dirname "$rel_path")
        filename=$(basename "$img")
        
        # Create directory structure
        mkdir -p "assets/images/optimized/gallery/$dir_path"
        
        # Optimize
        optimize_image "$img" "assets/images/optimized/gallery/$rel_path" 1200
        create_webp "assets/images/optimized/gallery/$rel_path"
    fi
done

echo "Image optimization complete!"
echo "Original images preserved in assets/images/"
echo "Optimized images created in assets/images/optimized/"

# Show size comparison
echo ""
echo "Size comparison:"
original_size=$(du -sh assets/images | cut -f1)
optimized_size=$(du -sh assets/images/optimized 2>/dev/null | cut -f1)
echo "Original: $original_size"
echo "Optimized: $optimized_size"