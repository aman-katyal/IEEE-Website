from PIL import Image
import numpy as np

def process_logo(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img)

    # Official Colors (RGB)
    target_blue = (0, 98, 155)
    target_gold = (235, 211, 169)

    # Original Colors (Estimates from JPG)
    # Blue is roughly dark blue
    # Gold is roughly tan/gold
    
    # Create mask for white background (to make transparent)
    # Looking for pixels where R, G, B are all > 240
    white_mask = (data[:, :, 0] > 220) & (data[:, :, 1] > 220) & (data[:, :, 2] > 220)
    
    # Create mask for "Blue" parts
    # Typically Blue > Red and Blue > Green in the blue parts
    blue_mask = (data[:, :, 2] > data[:, :, 0]) & (data[:, :, 2] > data[:, :, 1]) & (data[:, :, 2] > 50) & (~white_mask)
    
    # Create mask for "Gold" parts
    # Typically Red > Blue and Green > Blue
    gold_mask = (data[:, :, 0] > data[:, :, 2]) & (data[:, :, 1] > data[:, :, 2]) & (data[:, :, 0] > 100) & (~white_mask) & (~blue_mask)

    # Apply transparency to white
    data[white_mask] = [0, 0, 0, 0]
    
    # Apply new colors
    data[blue_mask, :3] = target_blue
    data[gold_mask, :3] = target_gold

    # Save as PNG
    new_img = Image.fromarray(data)
    new_img.save(output_path, "PNG")
    print(f"Processed logo saved to {output_path}")

if __name__ == "__main__":
    process_logo("public/images/logo/pieee_logo_v3.jpg", "public/images/logo/logo_clean.png")
