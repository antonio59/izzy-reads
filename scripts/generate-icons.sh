#!/bin/bash
# Generate PWA icons from SVG source
# Requires: ImageMagick (brew install imagemagick) or similar tool

ICON_SIZES=(72 96 128 144 152 192 384 512)
SVG_SOURCE="public/icons/icon.svg"
OUTPUT_DIR="public/icons"

echo "Generating PWA icons..."

for size in "${ICON_SIZES[@]}"; do
  echo "Creating ${size}x${size} icon..."
  if command -v convert &> /dev/null; then
    convert -background none -resize ${size}x${size} "$SVG_SOURCE" "${OUTPUT_DIR}/icon-${size}x${size}.png"
  elif command -v rsvg-convert &> /dev/null; then
    rsvg-convert -w $size -h $size "$SVG_SOURCE" > "${OUTPUT_DIR}/icon-${size}x${size}.png"
  else
    echo "Warning: No image converter found. Please install ImageMagick or librsvg."
    echo "  brew install imagemagick"
    echo "  OR"
    echo "  brew install librsvg"
    exit 1
  fi
done

# Create shortcut icons if main icons were created successfully
if [ -f "${OUTPUT_DIR}/icon-96x96.png" ]; then
  cp "${OUTPUT_DIR}/icon-96x96.png" "${OUTPUT_DIR}/bookshelf-96x96.png"
  cp "${OUTPUT_DIR}/icon-96x96.png" "${OUTPUT_DIR}/add-book-96x96.png"
fi

echo "Done! Icons created in ${OUTPUT_DIR}/"
