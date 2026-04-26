import os
import requests
from moviepy.editor import VideoFileClip, CompositeVideoClip, TextClip, ColorClip
import moviepy.video.fx.all as vfx

# Configuration
TOTAL_DURATION = 180  # 3 minutes
NUM_CLIPS = 10
TRANSITION_DURATION = 2.0
# Calculate clip duration to account for transitions
# Total = 10 * CLIP_LEN - 9 * TRANSITION = 180
# CLIP_LEN = (180 + 18) / 10 = 19.8
CLIP_LEN = (TOTAL_DURATION + (NUM_CLIPS - 1) * TRANSITION_DURATION) / NUM_CLIPS
TARGET_SIZE = (1280, 720)

URLS = [
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4"
]

def download_file(url, dest):
    if os.path.exists(dest):
        print(f"Skipping download, {dest} exists.")
        return
    print(f"Downloading {url}...")
    response = requests.get(url, stream=True)
    with open(dest, "wb") as f:
        for chunk in response.iter_content(chunk_size=8192):
            if chunk:
                f.write(chunk)

def apply_effect(clip, index):
    if index == 0: return clip
    elif index == 1: return clip.fx(vfx.blackwhite)
    elif index == 2: return clip.fx(vfx.mirror_x)
    elif index == 3: return clip.fx(vfx.colorx, 1.5)
    elif index == 4: return clip.fx(vfx.invert_colors)
    elif index == 5: return clip.fx(vfx.gamma_corr, 1.2)
    elif index == 6: return clip.fx(vfx.speedx, 1.1)
    elif index == 7: return clip.fx(vfx.fadein, 2)
    elif index == 8: return clip.fx(vfx.lum_contrast, threshold=128)
    elif index == 9: return clip.fx(vfx.mirror_y)
    return clip

def main():
    clips = []
    os.makedirs("temp_clips", exist_ok=True)
    
    for i, url in enumerate(URLS):
        dest = f"temp_clips/clip_{i}.mp4"
        download_file(url, dest)
        
        # Load and process clip
        clip = VideoFileClip(dest).subclip(0, CLIP_LEN)
        clip = clip.resize(width=TARGET_SIZE[0])
        
        # Crop to exact height if needed
        if clip.h > TARGET_SIZE[1]:
            clip = clip.crop(y1=(clip.h - TARGET_SIZE[1])/2, y2=(clip.h + TARGET_SIZE[1])/2)
        elif clip.h < TARGET_SIZE[1]:
            clip = clip.resize(height=TARGET_SIZE[1])
            clip = clip.crop(x1=(clip.w - TARGET_SIZE[0])/2, x2=(clip.w + TARGET_SIZE[0])/2)
            
        clip = apply_effect(clip, i)
        
        # Calculate start time
        start_time = i * (CLIP_LEN - TRANSITION_DURATION)
        clip = clip.set_start(start_time).crossfadein(TRANSITION_DURATION)
        clips.append(clip)

    # Add a global title
    try:
        title = TextClip("MoviePy Showcase\n3 Minutes of Effects", fontsize=50, color='white', font='DejaVu-Sans', duration=5)
    except:
        title = TextClip("MoviePy Showcase\n3 Minutes of Effects", fontsize=50, color='white', duration=5)
    
    title = title.set_position('center').set_start(0).crossfadeout(2)
    clips.append(title)

    final_video = CompositeVideoClip(clips, size=TARGET_SIZE)
    final_video.duration = TOTAL_DURATION
    
    print("Rendering final video...")
    final_video.write_videofile("3min_video.mp4", fps=24, codec="libx264", audio_codec="aac")

if __name__ == "__main__":
    main()
