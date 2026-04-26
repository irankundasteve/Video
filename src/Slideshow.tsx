import {
  Series,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Img,
  AbsoluteFill,
} from "remotion";

const IMAGES = [
    "https://images.unsplash.com/photo-1546182990-dffeafbe841d?q=80&w=1280",
    "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?q=80&w=1280",
    "https://images.unsplash.com/photo-1564349683136-77e08bef1ed1?q=80&w=1280",
    "https://images.unsplash.com/photo-1501705388883-4ed8a543392c?q=80&w=1280",
    "https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?q=80&w=1280",
    "https://images.unsplash.com/photo-1472393365320-dc77242e4501?q=80&w=1280",
    "https://images.unsplash.com/photo-1557008075-7f2c5efa4cfd?q=80&w=1280",
    "https://images.unsplash.com/photo-1517423738875-5ce310acd3da?q=80&w=1280",
    "https://images.unsplash.com/photo-1547970810-248a21e70bf7?q=80&w=1280",
    "https://images.unsplash.com/photo-1500463959177-e0869687df2b?q=80&w=1280",
    "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?q=80&w=1280",
    "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?q=80&w=1280",
    "https://images.unsplash.com/photo-1516233501032-2ddf7f031dcb?q=80&w=1280",
    "https://images.unsplash.com/photo-1549480017-d76466a4b7e8?q=80&w=1280",
    "https://images.unsplash.com/photo-1591824438708-ce405f36ba3d?q=80&w=1280",
    "https://images.unsplash.com/photo-1504173010664-32509aaefe92?q=80&w=1280",
    "https://images.unsplash.com/photo-1511967728238-d5063c9aa76a?q=80&w=1280",
    "https://images.unsplash.com/photo-1475855581690-80accde3ae2b?q=80&w=1280",
    "https://images.unsplash.com/photo-1543946207-39bd91e70ca7?q=80&w=1280",
    "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=1280"
];

const ImageSlide: React.FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = interpolate(frame, [0, 10 * fps], [1, 1.2], {
    extrapolateRight: "clamp",
  });

  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

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
  const slideDuration = (180 * fps) / IMAGES.length;

  return (
    <Series>
      {IMAGES.map((src, index) => (
        <Series.Sequence key={index} durationInFrames={Math.floor(slideDuration)}>
          <ImageSlide src={src} />
        </Series.Sequence>
      ))}
    </Series>
  );
};
