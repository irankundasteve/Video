import {
  Series,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Img,
  AbsoluteFill,
  staticFile,
  spring,
  Easing,
} from "remotion";

const NUM_IMAGES = 20;

// Titles for each animal/slide
const TITLES = [
  "Majestic Lion", "Lioness Pride", "The Royal Pair", "The Future King",
  "King at Rest", "Savanna Silhouette", "Bengal Power", "River Crossing",
  "The Hunter", "Icy Gaze", "White Ghost", "Jungle Shadow", 
  "The Sentinel", "Cheetah Speed", "Golden Eyes", "On the Lookout",
  "Family Bond", "Grassland Ghost", "The Sprinter", "Wild Spirit"
];

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width } = useVideoConfig();
  
  const progress = frame / durationInFrames;
  const barWidth = progress * width;

  return (
    <div style={{
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: barWidth,
      height: 8,
      backgroundColor: '#f1c40f',
      boxShadow: '0 0 10px #f1c40f',
      zIndex: 100
    }} />
  );
};

const Vignette: React.FC = () => (
  <AbsoluteFill style={{
    boxShadow: 'inset 0 0 200px rgba(0,0,0,0.8)',
    background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.6) 100%)',
    pointerEvents: 'none'
  }} />
);

const ImageSlide: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // Cinematic Scale (Spring)
  const scale = spring({
    frame,
    fps,
    config: {
      damping: 200,
    },
    from: 1,
    to: 1.15,
  });

  // Text Animation
  const textOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateRight: "clamp",
  });
  
  const textTranslateY = interpolate(
    frame,
    [20, 50],
    [20, 0],
    {
      easing: Easing.out(Easing.exp),
      extrapolateRight: "clamp",
    }
  );

  const src = staticFile(`/images/img_${index}.jpg`);

  return (
    <AbsoluteFill style={{ backgroundColor: "black", overflow: 'hidden' }}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
        }}
      />
      <Vignette />
      
      {/* Bottom Gradient for Text Readability */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: '30%',
        background: 'linear-gradient(transparent, rgba(0,0,0,0.8))'
      }} />

      {/* Animated Title */}
      <div style={{
        position: 'absolute',
        bottom: 80,
        width: '100%',
        textAlign: 'center',
        opacity: textOpacity,
        transform: `translateY(${textTranslateY}px)`,
        color: 'white',
        fontFamily: 'Helvetica, Arial, sans-serif',
        fontSize: 60,
        fontWeight: 'bold',
        textShadow: '2px 2px 10px rgba(0,0,0,0.5)',
        letterSpacing: '2px'
      }}>
        {TITLES[index] || "Wildlife Showcase"}
      </div>
    </AbsoluteFill>
  );
};

export const Slideshow: React.FC = () => {
  const { fps } = useVideoConfig();
  const slideDuration = (180 * fps) / NUM_IMAGES;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <Series>
        {Array.from({ length: NUM_IMAGES }).map((_, index) => (
          <Series.Sequence key={index} durationInFrames={Math.floor(slideDuration)}>
            <ImageSlide index={index} />
          </Series.Sequence>
        ))}
      </Series>
      <ProgressBar />
    </AbsoluteFill>
  );
};
