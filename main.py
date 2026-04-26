from moviepy.editor import TextClip, ColorClip, CompositeVideoClip

def create_hello_world_video():
    # Create a background clip (black, 5 seconds, 720p)
    bg = ColorClip(size=(1280, 720), color=(0, 0, 0), duration=5)
    
    # Create a text clip
    # DejaVu-Sans is common on Ubuntu/GitHub Actions
    try:
        text = TextClip("Hello World", fontsize=70, color='white', font='DejaVu-Sans')
    except:
        # Fallback to whatever font is available if DejaVu-Sans fails
        text = TextClip("Hello World", fontsize=70, color='white')
    text = text.set_position('center').set_duration(5)
    
    # Combine them
    video = CompositeVideoClip([bg, text])
    
    # Write the result
    video.write_videofile("hello_world.mp4", fps=24)

if __name__ == "__main__":
    create_hello_world_video()
