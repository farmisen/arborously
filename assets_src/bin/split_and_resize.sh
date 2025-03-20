#!/bin/bash
set -euo pipefail

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null; then
    echo "Error: ImageMagick is required but not installed."
    echo "Please install it with: brew install imagemagick"
    exit 1
fi

# Constants
SOURCE_DIR="assets_src/icon"
OUTPUT_DIR="public/icon"
SIZES=(16 24 48 96 128)

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Process all PNG files in the source directory
for SOURCE_FILE in "$SOURCE_DIR"/*.png; do
    # Get the filename without path and extension
    FILENAME=$(basename "$SOURCE_FILE" .png)
    
    echo "Processing $FILENAME..."
    
    # Get image dimensions
    WIDTH=$(magick identify -format "%w" "$SOURCE_FILE")
    HEIGHT=$(magick identify -format "%h" "$SOURCE_FILE")
    
    echo "Source image dimensions: ${WIDTH}x${HEIGHT}px"
    
    # Calculate half width
    HALF_WIDTH=$((WIDTH / 2))
    
    # Split the image into two halves
    echo "Splitting image into trunk and tree..."
    magick "$SOURCE_FILE" -crop "${HALF_WIDTH}x${HEIGHT}+0+0" +repage "trunk-${FILENAME}-original.png"
    magick "$SOURCE_FILE" -crop "${HALF_WIDTH}x${HEIGHT}+${HALF_WIDTH}+0" +repage "tree-${FILENAME}-original.png"
    
    # Process all sizes
    for SIZE in "${SIZES[@]}"; do
        echo "Creating ${SIZE}x${SIZE} versions for $FILENAME..."
        
        # Create sized versions with nearest neighbor scaling
        magick "trunk-${FILENAME}-original.png" -scale "${SIZE}x${SIZE}" -filter point "$OUTPUT_DIR/trunk-${FILENAME}-${SIZE}.png"
        magick "tree-${FILENAME}-original.png" -scale "${SIZE}x${SIZE}" -filter point "$OUTPUT_DIR/tree-${FILENAME}-${SIZE}.png"
    done
    
    # Clean up temporary files for this image
    rm "trunk-${FILENAME}-original.png" "tree-${FILENAME}-original.png"
done

echo "Done! All images created in $OUTPUT_DIR"