"""
Crop individual Zippo lighters from display frame photos.
Uses a grid-based approach since the frames have uniform grids.
"""
import cv2
import numpy as np
import os
import sys

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'zippo-photos')
PHOTO_DIR = os.path.join(os.path.dirname(__file__), '..', 'photos')

os.makedirs(OUTPUT_DIR, exist_ok=True)

# Frame configurations: (filename, rows, cols, crop_margins)
# crop_margins = (top%, bottom%, left%, right%) of image to trim before grid split
FRAMES = [
    # Beatles - large frame, ~10 rows x 10 cols (complex, skip for now)
    # ('rahmen-1-beatles.jpg', 10, 10, (0.03, 0.02, 0.02, 0.02)),
    
    # Standard 4x5 frames
    ('rahmen-2-guy-harvey.jpg', 4, 5, (0.03, 0.03, 0.03, 0.03)),
    ('rahmen-3-scrimshaw.jpg', 5, 5, (0.03, 0.03, 0.03, 0.03)),
    ('rahmen-4-femina-universa.jpg', 4, 5, (0.02, 0.02, 0.02, 0.02)),
    ('rahmen-5-windy-girl-1.jpg', 4, 5, (0.03, 0.03, 0.03, 0.03)),
    ('rahmen-7-landmarks-animals.jpg', 4, 5, (0.04, 0.04, 0.04, 0.04)),
    ('rahmen-8-chiefs-animals.jpg', 4, 5, (0.03, 0.03, 0.03, 0.03)),
    ('rahmen-9-west-gold-eagles.jpg', 4, 5, (0.03, 0.03, 0.03, 0.03)),
]

def crop_grid(img_path, rows, cols, margins, prefix):
    img = cv2.imread(img_path)
    if img is None:
        print(f"  ERROR: Could not read {img_path}")
        return 0
    
    h, w = img.shape[:2]
    
    # Apply margins
    t = int(h * margins[0])
    b = int(h * (1 - margins[1]))
    l = int(w * margins[2])
    r = int(w * (1 - margins[3]))
    
    cropped = img[t:b, l:r]
    ch, cw = cropped.shape[:2]
    
    cell_h = ch // rows
    cell_w = cw // cols
    
    # Inner padding per cell (trim black borders between cells)
    pad_h = int(cell_h * 0.08)
    pad_w = int(cell_w * 0.08)
    
    count = 0
    for row in range(rows):
        for col in range(cols):
            y1 = row * cell_h + pad_h
            y2 = (row + 1) * cell_h - pad_h
            x1 = col * cell_w + pad_w
            x2 = (col + 1) * cell_w - pad_w
            
            cell = cropped[y1:y2, x1:x2]
            
            # Check if cell is mostly black (empty slot)
            if np.mean(cell) < 30:
                continue
            
            filename = f"{prefix}_r{row+1}c{col+1}.jpg"
            outpath = os.path.join(OUTPUT_DIR, filename)
            cv2.imwrite(outpath, cell, [cv2.IMWRITE_JPEG_QUALITY, 90])
            count += 1
    
    return count

total = 0
for filename, rows, cols, margins in FRAMES:
    img_path = os.path.join(PHOTO_DIR, filename)
    prefix = filename.replace('.jpg', '').replace('rahmen-', 'r')
    print(f"Processing {filename} ({rows}x{cols})...")
    n = crop_grid(img_path, rows, cols, margins, prefix)
    print(f"  -> {n} images extracted")
    total += n

# Beatles frame is special - 11 rows, variable columns
print("Processing rahmen-1-beatles.jpg (11 rows, ~10 cols)...")
img_path = os.path.join(PHOTO_DIR, 'rahmen-1-beatles.jpg')
n = crop_grid(img_path, 11, 10, (0.02, 0.01, 0.02, 0.02), 'r1-beatles')
print(f"  -> {n} images extracted")
total += n

print(f"\nTotal: {total} individual Zippo images extracted to {OUTPUT_DIR}")
