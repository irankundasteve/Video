import {
  Series,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
  staticFile,
  spring,
  Audio,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

const COLORS = {
  bg: "#000000",
  text: "#FFFFFF",
  gold: "#F5A623",
  grey: "#6C7A89",
};

// --- Scene Components ---

const Scene1 = () => {
  const frame = useCurrentFrame();
  const imagineOp = interpolate(frame, [0, 15], [0, 1]);
  const snapIn = frame > 45; // ~1.5s
  
  // Transition to Scene 2 part
  const shiftLeft = interpolate(frame, [75, 90], [0, -400], { extrapolateRight: 'clamp' });
  const compress = interpolate(frame, [75, 90], [1, 0.7], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily }}>
      <Audio src={staticFile("/audio/part1.mp3")} />
      <div style={{ transform: `translateX(${shiftLeft}px) scaleX(${compress})`, textAlign: 'center' }}>
        <div style={{ opacity: imagineOp, fontSize: 48, fontWeight: 400 }}>Imagine</div>
        {snapIn && (
          <div style={{ fontSize: 120, fontWeight: 900, marginTop: 20 }}>you're a baker,</div>
        )}
      </div>
      {frame > 75 && (
        <div style={{ position: 'absolute', right: 200, display: 'flex', alignItems: 'baseline', gap: 20 }}>
           <span style={{ fontSize: 32, color: COLORS.grey }}>and you need</span>
           <span style={{ fontSize: 96, fontWeight: 900 }}>a haircut.</span>
        </div>
      )}
    </AbsoluteFill>
  );
};

const Scene2 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const breadEntry = spring({ frame, fps, from: 0, to: 1 });
  const offerFlyIn = interpolate(frame, [20, 35], [-200, 0], { easing: Easing.out(Easing.exp), extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily }}>
      <Audio src={staticFile("/audio/part2.mp3")} />
      <div style={{ transform: `translateY(${offerFlyIn}px)`, opacity: frame > 20 ? 1 : 0, fontSize: 48, marginBottom: 40 }}>
        You offer the barber
      </div>
      <div style={{ transform: `scale(${breadEntry})`, fontSize: 80, fontWeight: 900, textAlign: 'center', lineHeight: 1.1 }}>
        TEN LOAVES<br/>OF BREAD.
      </div>
    </AbsoluteFill>
  );
};

const Scene3 = () => {
  const frame = useCurrentFrame();
  const shrink = interpolate(frame, [0, 20], [1, 0.6], { extrapolateRight: 'clamp' });
  const desaturate = interpolate(frame, [0, 20], [1, 0.3], { extrapolateRight: 'clamp' });
  const tilt = interpolate(frame, [30, 75], [0, 8], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily }}>
      <Audio src={staticFile("/audio/part3.mp3")} />
      <div style={{ 
        transform: `scale(${shrink}) rotate(${tilt}deg)`, 
        opacity: desaturate,
        textAlign: 'center' 
      }}>
        <div style={{ fontSize: 48 }}>But what if he doesn't want</div>
        <div style={{ fontSize: 120, fontWeight: 900, color: 'white', opacity: 1/desaturate }}>BREAD</div>
      </div>
    </AbsoluteFill>
  );
};

const Scene4 = () => {
  const frame = useCurrentFrame();
  const tracking = interpolate(frame, [15, 60], [50, 0], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily }}>
      <Audio src={staticFile("/audio/part4.mp3")} />
      <div style={{ fontSize: 100, fontWeight: 900, color: COLORS.gold, textTransform: 'uppercase' }}>
        THE PROBLEM
      </div>
      <div style={{ fontSize: 80, letterSpacing: tracking, marginTop: 20 }}>
        BARTER—{frame % 20 > 10 ? '_' : ''}
      </div>
    </AbsoluteFill>
  );
};

const Scene5 = () => {
  const frame = useCurrentFrame();
  const bridgeOp = interpolate(frame, [20, 45], [0, 1]);
  const lineScale = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, fontFamily, padding: 100 }}>
      <Audio src={staticFile("/audio/part5.mp3")} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 60, fontWeight: 900 }}>
        <span>you</span>
        <span>the other</span>
      </div>
      <div style={{ 
        position: 'absolute', top: '40%', width: '100%', textAlign: 'center', 
        opacity: bridgeOp, fontSize: 48, fontStyle: 'italic', color: COLORS.grey 
      }}>
        have to want what
      </div>
      <div style={{ position: 'absolute', bottom: '30%', width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 70, fontWeight: 900, color: COLORS.gold, opacity: frame > 50 ? 1 : 0 }}>
          at the same time.
        </div>
        <div style={{ 
          height: 4, background: COLORS.gold, marginTop: 20, margin: '0 auto',
          width: '80%', transform: `scaleX(${lineScale})`
        }} />
      </div>
    </AbsoluteFill>
  );
};

const Scene6 = () => {
  const frame = useCurrentFrame();
  const solvedOp = interpolate(frame, [15, 30], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily }}>
      <Audio src={staticFile("/audio/part6.mp3")} />
      <div style={{ fontSize: 180, fontWeight: 900, color: 'white' }}>
        CURRENCY
      </div>
      <div style={{ fontSize: 60, color: COLORS.gold, opacity: solvedOp, marginTop: 20 }}>
        solves that.
      </div>
    </AbsoluteFill>
  );
};

// --- Main Root ---

export const Slideshow: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Series>
        <Series.Sequence durationInFrames={4 * fps}><Scene1 /></Series.Sequence>
        <Series.Sequence durationInFrames={2 * fps}><Scene2 /></Series.Sequence>
        <Series.Sequence durationInFrames={2.5 * fps}><Scene3 /></Series.Sequence>
        <Series.Sequence durationInFrames={2.5 * fps}><Scene4 /></Series.Sequence>
        <Series.Sequence durationInFrames={3 * fps}><Scene5 /></Series.Sequence>
        <Series.Sequence durationInFrames={2 * fps}><Scene6 /></Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
