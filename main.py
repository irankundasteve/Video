import os
import requests
import time
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from moviepy import ImageClip, CompositeVideoClip, TextClip, ColorClip
import moviepy.video.fx as vfx

# Configuration
TOTAL_DURATION = 180  # 3 minutes
NUM_IMAGES = 20
TRANSITION_DURATION = 2.0
IMG_DURATION = (TOTAL_DURATION + (NUM_IMAGES - 1) * TRANSITION_DURATION) / NUM_IMAGES
TARGET_SIZE = (1280, 720)

# Diverse set of 20 High-Quality Animal Images
URLS = [
    "https://images.unsplash.com/photo-1614027164847-1b2809eb7b9c?q=80&w=1280", # Lion 1
    "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=1280", # Lioness
    "https://images.unsplash.com/photo-1517649281203-dad836b4abb5?q=80&w=1280", # Lion Pair
    "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?q=80&w=1280", # Lion Cub
    "https://images.unsplash.com/photo-1552410260-0fd9b577afa6?q=80&w=1280", # Lion Resting
    "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?q=80&w=1280", # Lion Silhouette
    "https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?q=80&w=1280", # Tiger 1
    "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=1280", # Tiger Water
    "https://images.unsplash.com/photo-1549480017-d76466a4b7e8?q=80&w=1280", # Tiger Walking
    "https://images.unsplash.com/photo-1501705388883-4ed8a543392c?q=80&w=1280", # Tiger Staring
    "https://images.unsplash.com/photo-1500463959177-e0869687df2b?q=80&w=1280", # White Tiger
    "https://images.unsplash.com/photo-1591824438708-ce405f36ba3d?q=80&w=1280", # Tiger Jungle
    "https://images.unsplash.com/photo-1504173010664-32509aaefe92?q=80&w=1280", # Tiger Profile
    "https://images.unsplash.com/photo-1516233501032-2ddf7f031dcb?q=80&w=1280", # Cheetah Sprint
    "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?q=80&w=1280", # Cheetah Portrait
    "https://images.unsplash.com/photo-1517423738875-5ce310acd3da?q=80&w=1280", # Cheetah Lookout
    "https://images.unsplash.com/photo-1547970810-248a21e70bf7?q=80&w=1280", # Cheetah Family
    "https://images.unsplash.com/photo-1511967728238-d5063c9aa76a?q=80&w=1280", # Cheetah Savanna
    "https://images.unsplash.com/photo-1475855581690-80accde3ae2b?q=80&w=1280", # Cheetah Eyes
    "https://images.unsplash.com/photo-1543946207-39bd91e70ca7?q=80&w=1280"  # Bonus: Elephant
]

def get_session():
    session = requests.Session()
    retry = Retry(total=5, backoff_factor=1, status_forcelist=[502, 503, 504])
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    return session

def download_file(session, url, dest):
    print(f"DEBUG: Downloading {url}")
    try:
        response = session.get(url, timeout=15, headers={'User-Agent': 'Mozilla/5.0'})
        response.raise_for_status()
        with open(dest, 'wb') as f:
            f.write(response.content)
        size = os.path.getsize(dest)
        print(f"DEBUG: Success, size: {size} bytes")
        return size > 5000
    except Exception as e:
        print(f"DEBUG: Error downloading {url}: {e}")
        return False

def main():
    os.makedirs("temp_images", exist_ok=True)
    session = get_session()
    final_clips = []
    
    # Persistent Background
    final_clips.append(ColorClip(size=TARGET_SIZE, color=(15, 15, 15), duration=TOTAL_DURATION))

    for i, url in enumerate(URLS):
        dest = f"temp_images/img_{i}.jpg"
        start_time = i * (IMG_DURATION - TRANSITION_DURATION)
        
        # Slight delay to avoid hammering API
        if i > 0: time.sleep(0.5)
        
        if download_file(session, url, dest):
            try:
                clip = ImageClip(dest).with_duration(IMG_DURATION)
                
                # Resizing and Cropping to fit 720p exactly
                clip = clip.resized(width=TARGET_SIZE[0])
                if clip.h > TARGET_SIZE[1]:
                    clip = clip.cropped(y1=(clip.h - TARGET_SIZE[1])/2, y2=(clip.h + TARGET_SIZE[1])/2)
                elif clip.h < TARGET_SIZE[1]:
                    clip = clip.resized(height=TARGET_SIZE[1])
                    clip = clip.cropped(x1=(clip.w - TARGET_SIZE[0])/2, x2=(clip.w + TARGET_SIZE[0])/2)
                
                clip = clip.with_start(start_time).with_effects([vfx.CrossFadeIn(TRANSITION_DURATION)])
                final_clips.append(clip)
                
                # Identifying Text
                label = f"WILD ANIMAL {i+1}"
                try:
                    txt = TextClip(text=label, font_size=50, color='white', font='DejaVu-Sans', duration=5)
                    txt = txt.with_position(('center', 600)).with_start(start_time + 1)
                    final_clips.append(txt)
                except: pass
                
                print(f"DEBUG: Successfully added clip {i}")
            except Exception as e:
                print(f"DEBUG: Error processing image {i}: {e}")
        else:
            # Visible placeholder for failed download
            placeholder = ColorClip(size=(400, 300), color=(100, 0, 0), duration=IMG_DURATION).with_start(start_time)
            final_clips.append(placeholder)

    print(f"DEBUG: Assembling {len(final_clips)} layers...")
    final_video = CompositeVideoClip(final_clips, size=TARGET_SIZE)
    final_video.duration = TOTAL_DURATION
    
    print("DEBUG: Final Rendering Step...")
    final_video.write_videofile("3min_video.mp4", fps=24, codec="libx264", bitrate="3000k")
    print("DEBUG: COMPLETED")

if __name__ == "__main__":
    main()
