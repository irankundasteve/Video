import os
import subprocess
import urllib.request

# Configuration
TOTAL_DURATION = 180
NUM_IMAGES = 20
IMG_DURATION = 10 # seconds each
TRANSITION_DURATION = 1 # 1 second crossfade
TARGET_SIZE = "1280x720"

URLS = [
    "https://images.unsplash.com/photo-1614027164847-1b2809eb7b9c?q=80&w=1280",
    "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=1280",
    "https://images.unsplash.com/photo-1517649281203-dad836b4abb5?q=80&w=1280",
    "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?q=80&w=1280",
    "https://images.unsplash.com/photo-1552410260-0fd9b577afa6?q=80&w=1280",
    "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?q=80&w=1280",
    "https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?q=80&w=1280",
    "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=1280",
    "https://images.unsplash.com/photo-1549480017-d76466a4b7e8?q=80&w=1280",
    "https://images.unsplash.com/photo-1501705388883-4ed8a543392c?q=80&w=1280",
    "https://images.unsplash.com/photo-1500463959177-e0869687df2b?q=80&w=1280",
    "https://images.unsplash.com/photo-1591824438708-ce405f36ba3d?q=80&w=1280",
    "https://images.unsplash.com/photo-1504173010664-32509aaefe92?q=80&w=1280",
    "https://images.unsplash.com/photo-1516233501032-2ddf7f031dcb?q=80&w=1280",
    "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?q=80&w=1280",
    "https://images.unsplash.com/photo-1517423738875-5ce310acd3da?q=80&w=1280",
    "https://images.unsplash.com/photo-1547970810-248a21e70bf7?q=80&w=1280",
    "https://images.unsplash.com/photo-1511967728238-d5063c9aa76a?q=80&w=1280",
    "https://images.unsplash.com/photo-1475855581690-80accde3ae2b?q=80&w=1280",
    "https://images.unsplash.com/photo-1543946207-39bd91e70ca7?q=80&w=1280"
]

def download_images():
    os.makedirs("input", exist_ok=True)
    for i, url in enumerate(URLS):
        dest = f"input/img_{i:02d}.jpg"
        print(f"Downloading {url}...")
        urllib.request.urlretrieve(url, dest)

def render_ffmpeg():
    # Build the FFmpeg command
    # We use the 'zoompan' filter for a smooth Ken Burns effect
    # and 'xfade' for transitions
    
    inputs = []
    filter_complex = ""
    
    for i in range(NUM_IMAGES):
        inputs.extend(["-loop", "1", "-t", str(IMG_DURATION), "-i", f"input/img_{i:02d}.jpg"])
        
        # Prepare each clip: scale and zoom
        filter_complex += f"[{i}:v]scale=1280:-1,zoompan=z='min(zoom+0.0015,1.5)':d={IMG_DURATION}*24:s={TARGET_SIZE},format=yuv420p[v{i}];"

    # Chains of crossfades
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
        "3min_video.mp4"
    ]
    
    print("Starting FFmpeg Render...")
    subprocess.run(cmd, check=True)
    print("Render Complete!")

if __name__ == "__main__":
    download_images()
    render_ffmpeg()
