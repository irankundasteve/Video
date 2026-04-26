import os
import urllib.request
from moviepy import ImageClip, CompositeVideoClip, TextClip, ColorClip
import moviepy.video.fx as vfx

# Configuration
TOTAL_DURATION = 180  # 3 minutes
NUM_IMAGES = 20
TRANSITION_DURATION = 2.0
# Calculate duration per image to fit exactly 180s with 2s overlaps
# Total = N * DUR - (N-1) * TRANS = 180
# 20 * DUR - 19 * 2 = 180 => 20 * DUR = 218 => DUR = 10.9
IMG_DURATION = (TOTAL_DURATION + (NUM_IMAGES - 1) * TRANSITION_DURATION) / NUM_IMAGES
TARGET_SIZE = (1280, 720)

# 20 High-Quality Animal Images (Unsplash)
URLS = [
    "https://images.unsplash.com/photo-1614027164847-1b2809eb7b9c?auto=format&fit=crop&q=80&w=1280", # Lion 1
    "https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&q=80&w=1280", # Lioness
    "https://images.unsplash.com/photo-1517649281203-dad836b4abb5?auto=format&fit=crop&q=80&w=1280", # Lion Pair
    "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&q=80&w=1280", # Lion Cub
    "https://images.unsplash.com/photo-1552410260-0fd9b577afa6?auto=format&fit=crop&q=80&w=1280", # Lion Resting
    "https://images.unsplash.com/photo-1535941339077-2dd1c7963098?auto=format&fit=crop&q=80&w=1280", # Lion Silhouette
    "https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?auto=format&fit=crop&q=80&w=1280", # Tiger 1
    "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&q=80&w=1280", # Tiger Water
    "https://images.unsplash.com/photo-1549480017-d76466a4b7e8?auto=format&fit=crop&q=80&w=1280", # Tiger Walking
    "https://images.unsplash.com/photo-1501705388883-4ed8a543392c?auto=format&fit=crop&q=80&w=1280", # Tiger Staring
    "https://images.unsplash.com/photo-1500463959177-e0869687df2b?auto=format&fit=crop&q=80&w=1280", # White Tiger
    "https://images.unsplash.com/photo-1591824438708-ce405f36ba3d?auto=format&fit=crop&q=80&w=1280", # Tiger Jungle
    "https://images.unsplash.com/photo-1504173010664-32509aaefe92?auto=format&fit=crop&q=80&w=1280", # Tiger Profile
    "https://images.unsplash.com/photo-1516233501032-2ddf7f031dcb?auto=format&fit=crop&q=80&w=1280", # Cheetah Sprint
    "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&q=80&w=1280", # Cheetah Portrait
    "https://images.unsplash.com/photo-1517423738875-5ce310acd3da?auto=format&fit=crop&q=80&w=1280", # Cheetah Lookout
    "https://images.unsplash.com/photo-1547970810-248a21e70bf7?auto=format&fit=crop&q=80&w=1280", # Cheetah Family
    "https://images.unsplash.com/photo-1511967728238-d5063c9aa76a?auto=format&fit=crop&q=80&w=1280", # Cheetah Savanna
    "https://images.unsplash.com/photo-1475855581690-80accde3ae2b?auto=format&fit=crop&q=80&w=1280", # Cheetah Eyes
    "https://images.unsplash.com/photo-1543946207-39bd91e70ca7?auto=format&fit=crop&q=80&w=1280"  # Bonus: Elephant
]

def download_file(url, dest):
    print(f"DEBUG: Downloading image: {url}")
    try:
        opener = urllib.request.build_opener()
        opener.addheaders = [('User-Agent', 'Mozilla/5.0')]
        urllib.request.install_opener(opener)
        urllib.request.urlretrieve(url, dest)
        return os.path.exists(dest) and os.path.getsize(dest) > 10000
    except Exception as e:
        print(f"DEBUG: Error downloading {url}: {e}")
        return False

def main():
    os.makedirs("temp_images", exist_ok=True)
    final_clips = []
    
    # Global background
    final_clips.append(ColorClip(size=TARGET_SIZE, color=(20, 20, 20), duration=TOTAL_DURATION))

    for i, url in enumerate(URLS):
        dest = f"temp_images/img_{i}.jpg"
        start_time = i * (IMG_DURATION - TRANSITION_DURATION)
        
        if download_file(url, dest):
            try:
                clip = ImageClip(dest).with_duration(IMG_DURATION)
                clip = clip.resized(width=TARGET_SIZE[0])
                
                # Fit/Crop
                if clip.h > TARGET_SIZE[1]:
                    clip = clip.cropped(y1=(clip.h - TARGET_SIZE[1])/2, y2=(clip.h + TARGET_SIZE[1])/2)
                elif clip.h < TARGET_SIZE[1]:
                    clip = clip.resized(height=TARGET_SIZE[1])
                    clip = clip.cropped(x1=(clip.w - TARGET_SIZE[0])/2, x2=(clip.w + TARGET_SIZE[0])/2)
                
                clip = clip.with_start(start_time).with_effects([vfx.CrossFadeIn(TRANSITION_DURATION)])
                final_clips.append(clip)
                
                # Add descriptive labels
                label = "Wild Cat " + str(i+1)
                try:
                    txt = TextClip(text=label, font_size=40, color='white', font='DejaVu-Sans', duration=4)
                    txt = txt.with_position(('center', 650)).with_start(start_time + 1)
                    final_clips.append(txt)
                except: pass
                
                print(f"DEBUG: Added image {i} at {start_time}s")
            except Exception as e:
                print(f"DEBUG: Error processing image {i}: {e}")
        else:
            # Fallback for failed download
            placeholder = ColorClip(size=(200, 200), color=(255, 0, 0), duration=IMG_DURATION).with_start(start_time)
            final_clips.append(placeholder)

    # Title
    try:
        title = TextClip(text="3 MINUTE WILDLIFE SLIDESHOW", font_size=60, color='yellow', font='DejaVu-Sans', duration=6)
        title = title.with_position('center').with_start(0).with_effects([vfx.CrossFadeOut(2)])
        final_clips.append(title)
    except: pass

    final_video = CompositeVideoClip(final_clips, size=TARGET_SIZE)
    final_video.duration = TOTAL_DURATION
    
    print("DEBUG: Final Rendering...")
    final_video.write_videofile("3min_video.mp4", fps=24, codec="libx264")
    print("DEBUG: DONE")

if __name__ == "__main__":
    main()
