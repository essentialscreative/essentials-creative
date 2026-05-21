#!/usr/bin/env python3

import re
import os
import glob

def url_encode_spaces(path):
    """Replace spaces with %20 in image paths"""
    return path.replace(' ', '%20')

def fix_image_paths(filename):
    """Fix image paths with spaces in HTML file"""
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    changes_made = []
    
    # Fix src attributes with spaces
    pattern = r'src="([^"]*\s+[^"]*)"'
    matches = re.findall(pattern, content)
    for match in matches:
        if 'assets/images/' in match:
            fixed = url_encode_spaces(match)
            content = content.replace(f'src="{match}"', f'src="{fixed}"')
            changes_made.append(f"  Fixed src: {match}")
    
    # Fix srcset attributes with spaces
    pattern = r'srcset="([^"]*\s+[^"]*)"'
    matches = re.findall(pattern, content)
    for match in matches:
        if 'assets/images/' in match:
            fixed = url_encode_spaces(match)
            content = content.replace(f'srcset="{match}"', f'srcset="{fixed}"')
            changes_made.append(f"  Fixed srcset: {match}")
    
    # Fix background-image URLs with spaces
    pattern = r"url\('([^']*\s+[^']*)'\)"
    matches = re.findall(pattern, content)
    for match in matches:
        if 'assets/images/' in match:
            fixed = url_encode_spaces(match)
            content = content.replace(f"url('{match}')", f"url('{fixed}')")
            changes_made.append(f"  Fixed background: {match}")
    
    # Fix image-set URLs with spaces
    pattern = r"image-set\(url\('([^']*\s+[^']*)'\)"
    matches = re.findall(pattern, content)
    for match in matches:
        if 'assets/images/' in match:
            fixed = url_encode_spaces(match)
            old_str = f"image-set(url('{match}')"
            new_str = f"image-set(url('{fixed}')"
            content = content.replace(old_str, new_str)
            changes_made.append(f"  Fixed image-set: {match}")
    
    if content != original_content:
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Fixed {filename}:")
        for change in changes_made[:5]:  # Show first 5 changes
            print(change)
        if len(changes_made) > 5:
            print(f"  ... and {len(changes_made) - 5} more")
        return len(changes_made)
    return 0

def main():
    print("🔧 Fixing image paths with spaces...")
    print("=" * 40)
    
    html_files = glob.glob('*.html')
    total_fixes = 0
    
    for html_file in html_files:
        fixes = fix_image_paths(html_file)
        total_fixes += fixes
    
    print("")
    print(f"✨ Complete! Fixed {total_fixes} image paths.")

if __name__ == '__main__':
    os.chdir('/Volumes/Extreme SSD/EssentialsCreative.COM/DEPLOY_TO_NETLIFY')
    main()