import {
  Series,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Img,
  AbsoluteFill,
  staticFile,
} from "remotion";

const NUM_IMAGES = 20;

const ImageSlide: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = interpolate(frame, [0, 10 * fps], [1, 1.2], {
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Reference local images from public/images
  const src = staticFile(`/images/img_${index}.jpg`);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Img
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale})`,
          opacity,
        }}
      />
    </AbsoluteFill>
  );
};

export const Slideshow: React.FC = () => {
  const { fps } = useVideoConfig();
  const slideDuration = (180 * fps) / NUM_IMAGES;

  return (
    <Series>
      {Array.from({ length: NUM_IMAGES }).map((_, index) => (
        <Series.Sequence key={index} durationInFrames={Math.floor(slideDuration)}>
          <ImageSlide index={index} />
        </Series.Sequence>
      ))}
    </Series>
  );
};
