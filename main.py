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

# Verified HTTPS Stable URLs for Animals and Nature
# Using Pexels/Pixabay CDN and stable test clips
URLS = [
    "https://videos.pexels.com/video-files/3625342/3625342-uhd_2560_1440_30fps.mp4", # Cheetah
    "https://videos.pexels.com/video-files/2414442/2414442-uhd_2560_1440_24fps.mp4", # Lion
    "https://videos.pexels.com/video-files/4100513/4100513-uhd_2560_1440_25fps.mp4", # Tiger
    "https://vjs.zencdn.net/v/oceans.mp4", # Ocean
    "https://www.w3schools.com/html/mov_bbb.mp4", # Bunny
    "https://videos.pexels.com/video-files/3625342/3625342-uhd_2560_1440_30fps.mp4", # Repeat Cheetah
    "https://videos.pexels.com/video-files/2414442/2414442-uhd_2560_1440_24fps.mp4", # Repeat Lion
    "https://videos.pexels.com/video-files/4100513/4100513-uhd_2560_1440_25fps.mp4", # Repeat Tiger
    "https://vjs.zencdn.net/v/oceans.mp4", # Repeat Ocean
    "https://www.w3schools.com/html/mov_bbb.mp4"  # Repeat Bunny
]

def download_file(url, dest):
    print(f"DEBUG: Attempting download: {url}")
    try:
        # Increase timeout and use stable headers
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=60) as response, open(dest, 'wb') as out_file:
            out_file.write(response.read())
        
        if os.path.exists(dest):
            size = os.path.getsize(dest)
            print(f"DEBUG: Successfully downloaded {dest}, size: {size} bytes")
            return size > 100000 # Minimum 100KB for a video
    except Exception as e:
        print(f"DEBUG: Download failed for {url}: {e}")
    return False

def main():
    os.makedirs("temp_clips", exist_ok=True)
    final_clips = []
    
    # Global background
    final_clips.append(ColorClip(size=TARGET_SIZE, color=(30, 30, 30), duration=TOTAL_DURATION))

    for i in range(NUM_CLIPS):
        url = URLS[i]
        dest = f"temp_clips/clip_{i}.mp4"
        start_time = i * (CLIP_LEN - TRANSITION_DURATION)
        
        if download_file(url, dest):
            try:
                print(f"DEBUG: Processing clip {i}")
                clip = VideoFileClip(dest)
                
                # If clip is shorter than required, loop it
                if clip.duration < CLIP_LEN:
                    clip = vfx.Loop(n=int(CLIP_LEN/clip.duration)+1).apply(clip)
                
                clip = clip.subclipped(0, CLIP_LEN)
                
                # Resize to fit 720p correctly
                clip = clip.resized(width=TARGET_SIZE[0])
                if clip.h > TARGET_SIZE[1]:
                    clip = clip.cropped(y1=(clip.h - TARGET_SIZE[1])/2, y2=(clip.h + TARGET_SIZE[1])/2)
                elif clip.h < TARGET_SIZE[1]:
                    clip = clip.resized(height=TARGET_SIZE[1])
                    clip = clip.cropped(x1=(clip.w - TARGET_SIZE[0])/2, x2=(clip.w + TARGET_SIZE[0])/2)
                
                clip = clip.with_start(start_time).with_effects([vfx.CrossFadeIn(TRANSITION_DURATION)])
                final_clips.append(clip)
                
                # Add identification text
                label_text = "Cheetah" if "3625342" in url else "Lion" if "2414442" in url else "Tiger" if "4100513" in url else "Nature"
                try:
                    txt = TextClip(text=label_text, font_size=50, color='white', font='DejaVu-Sans', duration=5)
                    txt = txt.with_position(('center', 'bottom')).with_start(start_time + 1)
                    final_clips.append(txt)
                except:
                    pass
                    
                print(f"DEBUG: Clip {i} ({label_text}) added at {start_time}")
            except Exception as e:
                print(f"DEBUG: MoviePy processing error on clip {i}: {e}")
                # Yellow fallback
                final_clips.append(ColorClip(size=TARGET_SIZE, color=(255, 255, 0), duration=CLIP_LEN).with_start(start_time))
        else:
            print(f"DEBUG: Clip {i} download failed")
            # Blue fallback
            final_clips.append(ColorClip(size=TARGET_SIZE, color=(0, 0, 255), duration=CLIP_LEN).with_start(start_time))

    print(f"DEBUG: Total layers to assemble: {len(final_clips)}")
    final_video = CompositeVideoClip(final_clips, size=TARGET_SIZE)
    final_video.duration = TOTAL_DURATION
    
    print("DEBUG: Final rendering...")
    # Use higher bitrate and common preset for compatibility
    final_video.write_videofile("3min_video.mp4", fps=24, codec="libx264", bitrate="2000k", audio_codec="aac")
    print("DEBUG: DONE")

if __name__ == "__main__":
    main()
