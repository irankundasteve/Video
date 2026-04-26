import os
import urllib.request
import sys
from moviepy import VideoFileClip, CompositeVideoClip, TextClip, ColorClip
import moviepy.video.fx as vfx

# Configuration
TOTAL_DURATION = 180  # 3 minutes
NUM_CLIPS = 10
TRANSITION_DURATION = 2.0
CLIP_LEN = (TOTAL_DURATION + (NUM_CLIPS - 1) * TRANSITION_DURATION) / NUM_CLIPS
TARGET_SIZE = (1280, 720)

# Ultra-stable sample URLs
URLS = [
    "https://vjs.zencdn.net/v/oceans.mp4",
    "https://www.w3schools.com/html/mov_bbb.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "https://vjs.zencdn.net/v/oceans.mp4", # Re-using stable ones to ensure coverage
    "https://www.w3schools.com/html/mov_bbb.mp4"
]

def download_file(url, dest):
    print(f"DEBUG: Downloading {url}")
    try:
        opener = urllib.request.build_opener()
        opener.addheaders = [('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')]
        urllib.request.install_opener(opener)
        urllib.request.urlretrieve(url, dest)
        
        if os.path.exists(dest):
            size = os.path.getsize(dest)
            print(f"DEBUG: Downloaded {dest}, size: {size} bytes")
            return size > 500000 # Must be at least 500KB
    except Exception as e:
        print(f"DEBUG: Download error for {url}: {e}")
    return False

def main():
    os.makedirs("temp_clips", exist_ok=True)
    final_clips = []
    
    # Background to avoid black screen
    final_clips.append(ColorClip(size=TARGET_SIZE, color=(20, 20, 20), duration=TOTAL_DURATION))

    for i in range(NUM_CLIPS):
        url = URLS[i]
        dest = f"temp_clips/clip_{i}.mp4"
        start_time = i * (CLIP_LEN - TRANSITION_DURATION)
        
        if download_file(url, dest):
            try:
                print(f"DEBUG: Processing clip {i}")
                clip = VideoFileClip(dest)
                
                # Loop if too short
                if clip.duration < CLIP_LEN:
                    clip = vfx.Loop(n=int(CLIP_LEN/clip.duration)+1).apply(clip)
                
                clip = clip.subclipped(0, CLIP_LEN)
                clip = clip.resized(width=TARGET_SIZE[0])
                
                # Fit to 720p
                if clip.h > TARGET_SIZE[1]:
                    clip = clip.cropped(y1=(clip.h - TARGET_SIZE[1])/2, y2=(clip.h + TARGET_SIZE[1])/2)
                elif clip.h < TARGET_SIZE[1]:
                    clip = clip.resized(height=TARGET_SIZE[1])
                    clip = clip.cropped(x1=(clip.w - TARGET_SIZE[0])/2, x2=(clip.w + TARGET_SIZE[0])/2)
                
                clip = clip.with_start(start_time).with_effects([vfx.CrossFadeIn(TRANSITION_DURATION)])
                final_clips.append(clip)
                print(f"DEBUG: Clip {i} added successfully")
            except Exception as e:
                print(f"DEBUG: MoviePy error on clip {i}: {e}")
                # Yellow fallback for processing error
                err_box = ColorClip(size=(300, 300), color=(255, 255, 0), duration=CLIP_LEN).with_start(start_time)
                final_clips.append(err_box)
        else:
            print(f"DEBUG: Clip {i} download failed")
            # Blue fallback for download error
            fail_box = ColorClip(size=(300, 300), color=(0, 0, 255), duration=CLIP_LEN).with_start(start_time)
            final_clips.append(fail_box)

    # Simple text overlay to confirm rendering
    try:
        title = TextClip(text="VIDEO RENDER TEST\nSUCCESS IF VISIBLE", font_size=60, color='white', font='DejaVu-Sans', duration=TOTAL_DURATION)
        title = title.with_position(('center', 50)).with_start(0)
        final_clips.append(title)
    except Exception as e:
        print(f"DEBUG: TextClip error: {e}")

    print(f"DEBUG: Assembling {len(final_clips)} layers")
    final_video = CompositeVideoClip(final_clips, size=TARGET_SIZE)
    final_video.duration = TOTAL_DURATION
    
    print("DEBUG: Final rendering step...")
    final_video.write_videofile("3min_video.mp4", fps=24, codec="libx264", audio_codec="aac")
    print("DEBUG: DONE")

if __name__ == "__main__":
    main()
