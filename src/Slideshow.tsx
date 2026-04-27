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

// --- Shared Components ---

const ProgressBar = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width } = useVideoConfig();
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, height: 10, backgroundColor: COLORS.accent,
      width: (frame / durationInFrames) * width, zIndex: 100
    }} />
  );
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

// --- Scenes ---

const Scene1 = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 60], [0, 1]);
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Audio src={staticFile("/audio/scene1.mp3")} />
      <div style={{ position: 'absolute', inset: 0, opacity: 0.2 }}>
        <Img src={staticFile("/images/btc_img_2.jpg")} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
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
  const shake = frame > 600 && frame < 615 ? Math.random() * 10 - 5 : 0;
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, border: `20px solid ${interpolate(frame, [0, 300], [COLORS.bg, COLORS.red])}` }}>
      <Audio src={staticFile("/audio/scene2.mp3")} />
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '100%', transform: `translate(${shake}px, ${shake}px)` }}>
        <div style={{ padding: 40, background: 'rgba(255,255,255,0.1)', borderRadius: 20, textAlign: 'center' }}>
           <h2 style={{ color: COLORS.primary }}>PURCHASING POWER</h2>
           <div style={{ fontSize: 120, color: COLORS.red }}>${dollarVal.toFixed(2)}</div>
        </div>
        {frame > 450 && (
          <div style={{ fontSize: 150, fontWeight: 'bold', color: COLORS.accent }}>40%</div>
        )}
      </div>
      {frame > 600 && (
        <div style={{ position: 'absolute', width: '100%', textAlign: 'center', top: '40%', fontSize: 200, color: COLORS.red, fontWeight: 'black' }}>
          INFLATION
        </div>
      )}
    </AbsoluteFill>
  );
};

const Scene3 = () => {
  const frame = useCurrentFrame();
  const count = Math.floor(interpolate(frame, [300, 800], [0, 21000000], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Audio src={staticFile("/audio/scene3.mp3")} />
      <BitcoinCoin scale={1.5} opacity={0.3} />
      <div style={{ textAlign: 'center', zIndex: 10 }}>
        <h1 style={{ color: COLORS.accent, fontSize: 80 }}>DECENTRALIZED</h1>
        <div style={{ fontSize: 120, color: COLORS.primary, fontWeight: 'bold', marginTop: 40 }}>
          {count.toLocaleString()}
        </div>
        <div style={{ color: COLORS.accent, fontSize: 30 }}>MAXIMUM SUPPLY — FOREVER</div>
      </div>
    </AbsoluteFill>
  );
};

const Scene4 = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, display: 'flex' }}>
      <Audio src={staticFile("/audio/scene4.mp3")} />
      <div style={{ width: '50%', borderRight: `2px solid ${COLORS.accent}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ color: COLORS.gold }}>GOLD</h2>
        <Img src={staticFile("/images/btc_img_1.jpg")} style={{ width: 300, borderRadius: 20 }} />
        <div style={{ marginTop: 20, color: COLORS.red, fontSize: 40 }}>X Portable</div>
      </div>
      <div style={{ width: '50%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h2 style={{ color: COLORS.accent }}>BITCOIN</h2>
        <BitcoinCoin scale={0.8} />
        <div style={{ marginTop: 20, color: COLORS.accent, fontSize: 40 }}>✓ Portable</div>
      </div>
    </AbsoluteFill>
  );
};

const Scene5 = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Audio src={staticFile("/audio/scene5.mp3")} />
      <Img src={staticFile("/images/btc_img_5.jpg")} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.3 }} />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
        <h1 style={{ color: COLORS.primary, fontSize: 100 }}>400,000,000+</h1>
        <h2 style={{ color: COLORS.accent }}>USERS WORLDWIDE</h2>
      </div>
    </AbsoluteFill>
  );
};

const Scene6 = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Audio src={staticFile("/audio/scene6.mp3")} />
      <div style={{ width: '80%', height: '60%', border: '4px solid white', position: 'relative' }}>
         <div style={{ position: 'absolute', left: 0, bottom: '20%', width: '100%', height: 4, background: COLORS.red }} />
         <div style={{ position: 'absolute', top: '40%', left: '40%', color: COLORS.red, fontSize: 100, fontWeight: 'bold' }}>-80%</div>
      </div>
      <div style={{ position: 'absolute', bottom: 50, color: COLORS.primary, fontSize: 40 }}>HIGH VOLATILITY</div>
    </AbsoluteFill>
  );
};

const Scene7 = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Audio src={staticFile("/audio/scene7.mp3")} />
      <BitcoinCoin scale={2} />
      <div style={{ position: 'absolute', bottom: 100, color: COLORS.primary, fontSize: 60, fontWeight: 'bold' }}>
        THE SHIFT HAS STARTED.
      </div>
    </AbsoluteFill>
  );
};

// --- Composition ---

export const Slideshow: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <Series>
        <Series.Sequence durationInFrames={540}><Scene1 /></Series.Sequence>
        <Series.Sequence durationInFrames={960}><Scene2 /></Series.Sequence>
        <Series.Sequence durationInFrames={900}><Scene3 /></Series.Sequence>
        <Series.Sequence durationInFrames={1200}><Scene4 /></Series.Sequence>
        <Series.Sequence durationInFrames={900}><Scene5 /></Series.Sequence>
        <Series.Sequence durationInFrames={600}><Scene6 /></Series.Sequence>
        <Series.Sequence durationInFrames={300}><Scene7 /></Series.Sequence>
      </Series>
      <ProgressBar />
    </AbsoluteFill>
  );
};
