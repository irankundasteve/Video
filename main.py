import os
import subprocess
import sys
from moviepy import VideoFileClip, CompositeVideoClip, TextClip, ColorClip
import moviepy.video.fx as vfx

# Configuration
TOTAL_DURATION = 180  # 3 minutes
NUM_CLIPS = 10
TRANSITION_DURATION = 2.0
CLIP_LEN = (TOTAL_DURATION + (NUM_CLIPS - 1) * TRANSITION_DURATION) / NUM_CLIPS
TARGET_SIZE = (1280, 720)

# Stable MP4 URLs
URLS = [
    "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4"
]

# We will try to replace some with animals if we can find stable ones
# For now, let's ensure it WORKS with these.

def download_file(url, dest):
    print(f"DEBUG: Downloading {url}")
    try:
        # Use wget as an alternative to curl for testing
        result = subprocess.run(['wget', '-O', dest, url, '--timeout=30', '--tries=3'], capture_output=True)
        if result.returncode == 0 and os.path.exists(dest):
            print(f"DEBUG: Downloaded {dest}, size: {os.path.getsize(dest)}")
            return True
        else:
            print(f"DEBUG: Wget failed for {url}: {result.stderr.decode()}")
    except Exception as e:
        print(f"DEBUG: Download exception: {e}")
    return False

def main():
    os.makedirs("temp_clips", exist_ok=True)
    
    final_clips = []
    
    for i in range(NUM_CLIPS):
        url = URLS[i % len(URLS)]
        dest = f"temp_clips/clip_{i}.mp4"
        
        success = download_file(url, dest)
        start_time = i * (CLIP_LEN - TRANSITION_DURATION)
        
        try:
            if not success:
                raise Exception("Download failed")
                
            print(f"DEBUG: Processing {dest} for clip {i}")
            clip = VideoFileClip(dest)
            
            # Basic info
            print(f"DEBUG: Clip {i} duration: {clip.duration}, size: {clip.size}")
            
            if clip.duration < CLIP_LEN:
                clip = vfx.Loop(n=int(CLIP_LEN/clip.duration)+1).apply(clip)
            
            clip = clip.subclipped(0, CLIP_LEN)
            clip = clip.resized(width=TARGET_SIZE[0])
            
            # Crop to fit
            if clip.h > TARGET_SIZE[1]:
                clip = clip.cropped(y1=(clip.h - TARGET_SIZE[1])/2, y2=(clip.h + TARGET_SIZE[1])/2)
            elif clip.h < TARGET_SIZE[1]:
                clip = clip.resized(height=TARGET_SIZE[1])
                clip = clip.cropped(x1=(clip.w - TARGET_SIZE[0])/2, x2=(clip.w + TARGET_SIZE[0])/2)
            
            clip = clip.with_start(start_time)
            if i > 0:
                clip = clip.with_effects([vfx.CrossFadeIn(TRANSITION_DURATION)])
            
            # Add a text overlay to each clip to identify it
            try:
                label = TextClip(text=f"Clip {i+1}: {os.path.basename(url)}", font_size=30, color='yellow', font='DejaVu-Sans', duration=5)
                label = label.with_position(('left', 'top')).with_start(start_time + 1)
                final_clips.append(label)
            except:
                pass

            final_clips.append(clip)
            print(f"DEBUG: Added clip {i} successfully")
            
        except Exception as e:
            print(f"DEBUG: ERROR with clip {i}: {e}")
            placeholder = ColorClip(size=TARGET_SIZE, color=(200, 0, 0), duration=CLIP_LEN)
            placeholder = placeholder.with_start(start_time)
            final_clips.append(placeholder)

    if not final_clips:
        print("DEBUG: CRITICAL - No clips were added!")
        sys.exit(1)

    print(f"DEBUG: Assembling {len(final_clips)} clips")
    final_video = CompositeVideoClip(final_clips, size=TARGET_SIZE)
    final_video.duration = TOTAL_DURATION
    
    print("DEBUG: Starting render")
    final_video.write_videofile("3min_video.mp4", fps=24, codec="libx264", audio_codec="aac")
    print("DEBUG: Render complete")

if __name__ == "__main__":
    main()
