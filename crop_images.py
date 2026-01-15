from PIL import Image
import os

def split_image(image_path, prefix, output_dir):
    try:
        img = Image.open(image_path)
        width, height = img.size
        
        # Calculate split points
        mid_x = width // 2
        mid_y = height // 2
        
        # Define areas (left, upper, right, lower)
        areas = [
            (0, 0, mid_x, mid_y),       # Top-Left
            (mid_x, 0, width, mid_y),   # Top-Right
            (0, mid_y, mid_x, height),  # Bottom-Left
            (mid_x, mid_y, width, height) # Bottom-Right
        ]
        
        filenames = [f"{prefix}_1.png", f"{prefix}_2.png", f"{prefix}_3.png", f"{prefix}_4.png"]
        
        for i, area in enumerate(areas):
            crop = img.crop(area)
            save_path = os.path.join(output_dir, filenames[i])
            crop.save(save_path)
            print(f"Saved {save_path}")
            
    except Exception as e:
        print(f"Error processing {image_path}: {e}")

base_dir = r"c:\Users\Francis\Desktop\Projects\My Portfolio\images"
split_image(os.path.join(base_dir, "collage_tech.png"), "tech", base_dir)
split_image(os.path.join(base_dir, "collage_web.png"), "web", base_dir)
