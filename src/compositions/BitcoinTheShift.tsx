import {
  Series,
  interpolate,
  interpolateColor,
  useCurrentFrame,
  useVideoConfig,
  Img,
  AbsoluteFill,
  staticFile,
  spring,
  Easing,
  Audio,
} from "remotion";

const COLORS = {
  bg: "#0B0F1A",
  primary: "#FFFFFF",
  accent: "#F7931A", // Bitcoin Orange
  red: "#FF4D4D",
  gold: "#FFD700"
};

const BitcoinCoin = ({ scale = 1, opacity = 1 }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ transform: `scale(${scale}) rotateY(${frame * 2}deg)`, opacity }}>
       <svg width="200" height="200" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="30" fill={COLORS.accent} />
          <path d="M46.103 27.223c.286-1.91-1.168-2.938-3.159-3.623l.645-2.589-3.935-.981-.628 2.52c-1.034-.258-2.09-.501-3.14-.74l.635-2.55-3.937-.982-.646 2.59c-.856-.195-1.696-.386-2.518-.584l.001-.005-5.428-1.355-.105.42s2.92.67 2.858.71c1.594.397 1.88 1.45 1.83 2.285l-1.835 7.368c.11.028.252.068.408.131l-.41-.102-2.572 10.318c-.195.484-.69.1.86.1l-2.858-.71-.448 1.799 5.123 1.278c.953.24 1.884.488 2.798.721l-.656 2.64 3.935.981.646-2.593c1.074.293 2.115.564 3.129.82l-.64 2.573 3.938.981.656-2.636c6.71 1.27 11.758.76 13.882-5.312 1.713-4.89-.084-7.712-3.63-9.554 2.583-.597 4.526-2.298 5.044-5.805zm-9.01 12.684c-1.217 4.887-9.447 2.246-12.115 1.58l2.161-8.676c2.668.665 11.205 1.983 9.954 7.096zm1.11-12.753c-1.11 4.45-7.973 2.188-10.198 1.634l1.96-7.868c2.225.555 9.38 1.593 8.238 6.234z" fill="white"/>
       </svg>
    </div>
  );
};

const Scene1 = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 60], [0, 1]);
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <BitcoinCoin scale={1.2} />
      <div style={{ position: 'absolute', bottom: 100, color: 'white', fontSize: 40, opacity }}>
        "What if money itself... was broken?"
      </div>
    </AbsoluteFill>
  );
};

const Scene2 = () => {
  const frame = useCurrentFrame();
  const dollarVal = interpolate(frame, [0, 450], [1.00, 0.61], { extrapolateRight: "clamp" });
  const borderOpacity = interpolate(frame, [0, 300], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <AbsoluteFill style={{ border: `20px solid ${COLORS.red}`, opacity: borderOpacity, pointerEvents: 'none' }} />
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '100%' }}>
        <div style={{ padding: 40, background: 'rgba(255,255,255,0.1)', borderRadius: 20, textAlign: 'center' }}>
           <div style={{ fontSize: 120, color: COLORS.red }}>${dollarVal.toFixed(2)}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const BitcoinTheShift: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <Series>
        <Series.Sequence durationInFrames={540}><Scene1 /></Series.Sequence>
        <Series.Sequence durationInFrames={960}><Scene2 /></Series.Sequence>
        {/* Simplified for library structure, full scenes can be added back if needed */}
      </Series>
    </AbsoluteFill>
  );
};
