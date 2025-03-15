#!/bin/bash
set -euo pipefail

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null; then
    echo "Error: ImageMagick is required but not installed."
    echo "Please install it with: brew install imagemagick"
    exit 1
fi

# Constants
SOURCE="assets_src/icon/arborously.png"
OUTPUT_DIR="public/icon"
SIZES=(16 24 48 96 128)

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Get image dimensions
WIDTH=$(magick identify -format "%w" "$SOURCE")
HEIGHT=$(magick identify -format "%h" "$SOURCE")

echo "Source image dimensions: ${WIDTH}x${HEIGHT}px"

# Calculate half width
HALF_WIDTH=$((WIDTH / 2))

# Split the image into two halves
echo "Splitting image into trunk and tree..."
magick "$SOURCE" -crop "${HALF_WIDTH}x${HEIGHT}+0+0" +repage "trunk-original.png"
magick "$SOURCE" -crop "${HALF_WIDTH}x${HEIGHT}+${HALF_WIDTH}+0" +repage "tree-original.png"

# Create the base 16x16 versions
echo "Creating 16x16 base versions..."
magick "trunk-original.png" -scale 16x16 -filter point "$OUTPUT_DIR/trunk-16.png"
magick "tree-original.png" -scale 16x16 -filter point "$OUTPUT_DIR/tree-16.png"

# Create all other sizes with nearest neighbor scaling
echo "Creating larger sizes with nearest neighbor scaling..."
for SIZE in "${SIZES[@]}"; do
    if [ "$SIZE" -ne 16 ]; then
        echo "Creating ${SIZE}x${SIZE} versions..."
        magick "$OUTPUT_DIR/trunk-16.png" -scale "${SIZE}x${SIZE}"  "$OUTPUT_DIR/trunk-${SIZE}.png" 
        magick "$OUTPUT_DIR/tree-16.png" -scale "${SIZE}x${SIZE}"  "$OUTPUT_DIR/tree-${SIZE}.png"
    fi
done

# Clean up temporary files
rm trunk-original.png tree-original.png

echo "Done! All images created in $OUTPUT_DIR"