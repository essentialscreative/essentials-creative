#!/bin/bash

# WebP Image Optimization Script for Essentials Creative
# Uses macOS sips tool to convert large images to optimized formats

echo "🖼️  Starting image optimization..."

# Create WebP directory if it doesn't exist
mkdir -p assets/images/webp

# Function to optimize large images
optimize_hero_image() {
    local input="$1"
    local output_base="${input%.*}"
    local output_jpg="${output_base}-optimized.jpg"
    local output_webp="assets/images/webp/$(basename ${output_base}).webp"
    
    if [ -f "$input" ]; then
        echo "Optimizing $input..."
        
        # Create optimized JPEG (85% quality, max width 1920px)
        sips -Z 1920 -s format jpeg -s formatOptions 85 "$input" --out "$output_jpg"
        
        # Convert to WebP using sips (if supported) or fallback to optimized JPEG
        if sips -s format webp "$output_jpg" --out "$output_webp" 2>/dev/null; then
            echo "✅ Created WebP: $output_webp"
        else
            echo "⚠️  WebP not supported, using optimized JPEG: $output_jpg"
        fi
        
        # Show file size comparison
        if [ -f "$output_jpg" ]; then
            original_size=$(stat -f%z "$input")
            optimized_size=$(stat -f%z "$output_jpg")
            reduction=$((100 - (optimized_size * 100 / original_size)))
            echo "📊 Size reduction: ${reduction}% ($(numfmt --to=iec-i $original_size) → $(numfmt --to=iec-i $optimized_size))"
        fi
        echo ""
    fi
}

# Optimize the largest hero images
echo "Optimizing botanical hero images..."
optimize_hero_image "assets/images/botanical-hero-about.jpg"
optimize_hero_image "assets/images/botanical-hero-design.jpg" 
optimize_hero_image "assets/images/botanical-hero-installations.jpg"
optimize_hero_image "assets/images/botanical-hero-background.jpg"

# Create responsive image variants
echo "Creating responsive variants..."
for img in assets/images/botanical-hero-*-optimized.jpg; do
    if [ -f "$img" ]; then
        base_name=$(basename "$img" -optimized.jpg)
        echo "Creating responsive variants for $base_name..."
        
        # Large desktop (1920px)
        sips -Z 1920 "$img" --out "assets/images/webp/${base_name}-1920.jpg"
        
        # Desktop (1200px)
        sips -Z 1200 "$img" --out "assets/images/webp/${base_name}-1200.jpg"
        
        # Tablet (768px)
        sips -Z 768 "$img" --out "assets/images/webp/${base_name}-768.jpg"
        
        # Mobile (480px)
        sips -Z 480 "$img" --out "assets/images/webp/${base_name}-480.jpg"
        
        echo "✅ Created responsive variants for $base_name"
    fi
done

echo "🎉 Image optimization complete!"
echo "📁 Optimized images saved to assets/images/webp/"
echo "💡 Update your HTML to use the new optimized images and implement responsive srcsets"