import os
import subprocess
import requests
import time

# Configuration
TOTAL_DURATION = 180
NUM_IMAGES = 20
IMG_DURATION = 10 # seconds each
TRANSITION_DURATION = 1 # 1 second crossfade
TARGET_SIZE = "1280x720"

# Using a more diverse and stable set of high-quality animal images
URLS = [
    "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=1280",
    "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?q=80&w=1280",
    "https://images.unsplash.com/photo-1564349683136-77e08bef1ed1?q=80&w=1280",
    "https://images.unsplash.com/photo-1501705388883-4ed8a543392c?q=80&w=1280",
    "https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?q=80&w=1280",
    "https://images.unsplash.com/photo-1472393365320-dc77242e4501?q=80&w=1280",
    "https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd?q=80&w=1280",
    "https://images.unsplash.com/photo-1517423738875-5ce310acd3da?q=80&w=1280",
    "https://images.unsplash.com/photo-1547970810-248a21e70bf7?q=80&w=1280",
    "https://images.unsplash.com/photo-1500463959177-e0869687df2b?q=80&w=1280",
    "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?q=80&w=1280",
    "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=1280",
    "https://images.unsplash.com/photo-1516233501032-2ddf7f031dcb?q=80&w=1280",
    "https://images.unsplash.com/photo-1549480017-d76466a4b7e8?q=80&w=1280",
    "https://images.unsplash.com/photo-1591824438708-ce405f36ba3d?q=80&w=1280",
    "https://images.unsplash.com/photo-1504173010664-32509aaefe92?q=80&w=1280",
    "https://images.unsplash.com/photo-1511967728238-d5063c9aa76a?q=80&w=1280",
    "https://images.unsplash.com/photo-1475855581690-80accde3ae2b?q=80&w=1280",
    "https://images.unsplash.com/photo-1543946207-39bd91e70ca7?q=80&w=1280",
    "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1280"
]

def download_images():
    os.makedirs("input", exist_ok=True)
    session = requests.Session()
    session.headers.update({'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'})
    
    for i, url in enumerate(URLS):
        dest = f"input/img_{i:02d}.jpg"
        print(f"Downloading {url}...")
        try:
            response = session.get(url, timeout=15)
            response.raise_for_status()
            with open(dest, 'wb') as f:
                f.write(response.content)
            print(f"Successfully downloaded to {dest}")
        except Exception as e:
            print(f"Error downloading {url}: {e}")
            # Create a simple colored placeholder if download fails
            subprocess.run(["ffmpeg", "-y", "-f", "lavfi", "-i", f"color=c=gray:s={TARGET_SIZE}", "-frames:v", "1", dest], check=True)

def render_ffmpeg():
    inputs = []
    filter_complex = ""
    
    # Pre-process each image to be exactly 1280x720 to avoid zoompan issues
    for i in range(NUM_IMAGES):
        img_path = f"input/img_{i:02d}.jpg"
        processed_path = f"input/proc_{i:02d}.png"
        
        # Scale and pad each image to 1280x720
        subprocess.run([
            "ffmpeg", "-y", "-i", img_path,
            "-vf", "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720",
            processed_path
        ], check=True)
        
        inputs.extend(["-loop", "1", "-t", str(IMG_DURATION), "-i", processed_path])
        # Apply zoompan to the pre-processed image
        filter_complex += f"[{i}:v]zoompan=z='min(zoom+0.001,1.5)':d={IMG_DURATION}*24:s=1280x720,format=yuv420p[v{i}];"

    last_v = "v0"
    offset = IMG_DURATION - TRANSITION_DURATION
    for i in range(1, NUM_IMAGES):
        new_v = f"xf{i}"
        filter_complex += f"[{last_v}][v{i}]xfade=transition=fade:duration={TRANSITION_DURATION}:offset={offset}[{new_v}];"
        last_v = new_v
        offset += (IMG_DURATION - TRANSITION_DURATION)

    cmd = [
        "ffmpeg", "-y"
    ] + inputs + [
        "-filter_complex", filter_complex,
        "-map", f"[{last_v}]",
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-r", "24",
        "-movflags", "+faststart",
        "3min_video.mp4"
    ]
    
    print("Starting FFmpeg Render...")
    subprocess.run(cmd, check=True)
    print("Render Complete!")

if __name__ == "__main__":
    download_images()
    render_ffmpeg()
