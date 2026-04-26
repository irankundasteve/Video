import os
import requests
from moviepy import VideoFileClip, CompositeVideoClip, TextClip, ColorClip
import moviepy.video.fx as vfx

# Configuration
TOTAL_DURATION = 180  # 3 minutes
NUM_CLIPS = 10
TRANSITION_DURATION = 2.0
CLIP_LEN = (TOTAL_DURATION + (NUM_CLIPS - 1) * TRANSITION_DURATION) / NUM_CLIPS
TARGET_SIZE = (1280, 720)

# Use more engaging animal and nature URLs
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
    if os.path.exists(dest) and os.path.getsize(dest) > 1000:
        print(f"Skipping download, {dest} exists.")
        return
    print(f"Downloading {url}...")
    try:
        response = requests.get(url, stream=True, timeout=30)
        response.raise_for_status()
        with open(dest, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:
                    f.write(chunk)
        print(f"Downloaded {dest} ({os.path.getsize(dest)} bytes)")
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        # Create a dummy clip if download fails
        pass

def main():
    clips = []
    os.makedirs("temp_clips", exist_ok=True)
    
    for i, url in enumerate(URLS):
        dest = f"temp_clips/clip_{i}.mp4"
        download_file(url, dest)
        
        if not os.path.exists(dest) or os.path.getsize(dest) < 1000:
            print(f"Clip {i} missing or too small, using placeholder.")
            clip = ColorClip(size=TARGET_SIZE, color=(50, 50, 50), duration=CLIP_LEN)
        else:
            try:
                clip = VideoFileClip(dest).subclipped(0, CLIP_LEN)
                clip = clip.resized(width=TARGET_SIZE[0])
                
                if clip.h > TARGET_SIZE[1]:
                    clip = clip.cropped(y1=(clip.h - TARGET_SIZE[1])/2, y2=(clip.h + TARGET_SIZE[1])/2)
                elif clip.h < TARGET_SIZE[1]:
                    clip = clip.resized(height=TARGET_SIZE[1])
                    clip = clip.cropped(x1=(clip.w - TARGET_SIZE[0])/2, x2=(clip.w + TARGET_SIZE[0])/2)
                
                # Apply effects using MoviePy 2.x style
                if i == 1: clip = vfx.BlackAndWhite().apply(clip)
                elif i == 2: clip = vfx.MirrorX().apply(clip)
                elif i == 3: clip = vfx.MultiplyColor(1.5).apply(clip)
                elif i == 4: clip = vfx.InvertColors().apply(clip)
                elif i == 5: clip = vfx.GammaCorrection(1.2).apply(clip)
                elif i == 6: clip = vfx.Speedx(1.1).apply(clip)
                elif i == 7: clip = vfx.FadeIn(2).apply(clip)
                elif i == 9: clip = vfx.MirrorY().apply(clip)
            except Exception as e:
                print(f"Error processing clip {i}: {e}")
                clip = ColorClip(size=TARGET_SIZE, color=(100, 0, 0), duration=CLIP_LEN)

        start_time = i * (CLIP_LEN - TRANSITION_DURATION)
        clip = clip.with_start(start_time).with_effects([vfx.CrossFadeIn(TRANSITION_DURATION)])
        clips.append(clip)

    # Add a global title
    try:
        title = TextClip(text="MoviePy Showcase\n3 Minutes of Effects", font_size=50, color='white', font='DejaVu-Sans', duration=5)
    except:
        title = ColorClip(size=(400, 200), color=(0,0,0), duration=5) # Fallback

    title = title.with_position('center').with_start(0).with_effects([vfx.CrossFadeOut(2)])
    clips.append(title)

    final_video = CompositeVideoClip(clips, size=TARGET_SIZE)
    final_video.duration = TOTAL_DURATION
    
    print("Rendering final video...")
    final_video.write_videofile("3min_video.mp4", fps=24, codec="libx264", audio_codec="aac")

if __name__ == "__main__":
    main()
