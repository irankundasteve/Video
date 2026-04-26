import os
import subprocess
from moviepy import VideoFileClip, CompositeVideoClip, TextClip, ColorClip
import moviepy.video.fx as vfx

# Configuration
TOTAL_DURATION = 180  # 3 minutes
NUM_CLIPS = 10
TRANSITION_DURATION = 2.0
CLIP_LEN = (TOTAL_DURATION + (NUM_CLIPS - 1) * TRANSITION_DURATION) / NUM_CLIPS
TARGET_SIZE = (1280, 720)

# Reliable URLs (Mix of Wikimedia and Google Samples)
URLS = [
    "https://upload.wikimedia.org/wikipedia/commons/transcoded/a/a1/Cheetahs_on_the_Edge_%28Director%27s_Cut%29.ogv/Cheetahs_on_the_Edge_%28Director%27s_Cut%29.ogv.480p.vp9.webm",
    "https://upload.wikimedia.org/wikipedia/commons/transcoded/3/38/Lion_%28Panthera_leo%29_walking_on_the_road.webm/Lion_%28Panthera_leo%29_walking_on_the_road.webm.480p.vp9.webm",
    "https://upload.wikimedia.org/wikipedia/commons/transcoded/a/a7/Lion_%28Panthera_leo%29_sniffing_at_the_ground.webm/Lion_%28Panthera_leo%29_sniffing_at_the_ground.webm.480p.vp9.webm",
    "https://upload.wikimedia.org/wikipedia/commons/transcoded/0/0e/2023-08-18_ZOO_LJUBLJANA_Panthera_leo_persica_AZIJSKI_LEV_2.webm/2023-08-18_ZOO_LJUBLJANA_Panthera_leo_persica_AZIJSKI_LEV_2.webm.480p.vp9.webm",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
]

def download_file(url, dest):
    print(f"Downloading {url} to {dest}...")
    try:
        # Use curl with retry and follow redirects
        subprocess.run(['curl', '-L', '--retry', '3', '-o', dest, url], check=True)
        if os.path.exists(dest):
            size = os.path.getsize(dest)
            print(f"Downloaded {dest}, size: {size} bytes")
            return size > 1000
    except Exception as e:
        print(f"Failed to download {url}: {e}")
    return False

def main():
    os.makedirs("temp_clips", exist_ok=True)
    
    # Base background to prevent black screen
    base_bg = ColorClip(size=TARGET_SIZE, color=(10, 10, 10), duration=TOTAL_DURATION)
    final_clips = [base_bg]
    
    for i, url in enumerate(URLS):
        dest = f"temp_clips/clip_{i}.mp4" if "mp4" in url else f"temp_clips/clip_{i}.webm"
        success = download_file(url, dest)
        
        try:
            if not success:
                raise Exception("Download failed")
                
            print(f"Processing clip {i}...")
            clip = VideoFileClip(dest)
            
            # Ensure clip is long enough
            if clip.duration < CLIP_LEN:
                clip = vfx.Loop(n=int(CLIP_LEN/clip.duration)+1).apply(clip)
            
            clip = clip.subclipped(0, CLIP_LEN)
            clip = clip.resized(width=TARGET_SIZE[0])
            
            # Center crop/resize
            if clip.h > TARGET_SIZE[1]:
                clip = clip.cropped(y1=(clip.h - TARGET_SIZE[1])/2, y2=(clip.h + TARGET_SIZE[1])/2)
            elif clip.h < TARGET_SIZE[1]:
                clip = clip.resized(height=TARGET_SIZE[1])
                clip = clip.cropped(x1=(clip.w - TARGET_SIZE[0])/2, x2=(clip.w + TARGET_SIZE[0])/2)
            
            # Apply specific effects
            if i % 3 == 1: clip = vfx.BlackAndWhite().apply(clip)
            elif i % 3 == 2: clip = vfx.MirrorX().apply(clip)
            
            start_time = i * (CLIP_LEN - TRANSITION_DURATION)
            clip = clip.with_start(start_time).with_effects([vfx.CrossFadeIn(TRANSITION_DURATION)])
            final_clips.append(clip)
            print(f"Clip {i} added at {start_time}s")
            
        except Exception as e:
            print(f"Error with clip {i} ({url}): {e}")
            # Placeholder for failed clip
            placeholder = ColorClip(size=TARGET_SIZE, color=(50, 0, 0), duration=CLIP_LEN)
            start_time = i * (CLIP_LEN - TRANSITION_DURATION)
            placeholder = placeholder.with_start(start_time)
            final_clips.append(placeholder)

    # Title Overlay
    try:
        title = TextClip(text="NATURE & WILDLIFE\nBig Cats Showcase", font_size=70, color='white', font='DejaVu-Sans', duration=7)
        title = title.with_position('center').with_start(1).with_effects([vfx.CrossFadeIn(1), vfx.CrossFadeOut(1)])
        final_clips.append(title)
    except Exception as e:
        print(f"TextClip failed: {e}")

    print(f"Assembling {len(final_clips)} layers...")
    final_video = CompositeVideoClip(final_clips, size=TARGET_SIZE)
    final_video.duration = TOTAL_DURATION
    
    print("Writing video file...")
    final_video.write_videofile("3min_video.mp4", fps=24, codec="libx264", audio_codec="aac", temp_audiofile="temp-audio.m4a", remove_temp=True)

if __name__ == "__main__":
    main()
