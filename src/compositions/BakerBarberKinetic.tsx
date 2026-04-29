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
  white: "#F5F5F5",
  grey: "#2F2F2F",
  gold: "#D4AF37",
  green: "#27AE60",
  red: "#E74C3C"
};

const Scene1 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  // BAKER falls
  const bakerDrop = spring({ frame, fps, config: { damping: 10, stiffness: 100 }, from: -200, to: 0 });
  const dustOpacity = interpolate(frame, [15, 30], [0, 0.5], { extrapolateRight: 'clamp' });
  
  // Slicing at 2.5s (frame 75)
  const slicePos = interpolate(frame, [75, 80], [0, 100], { extrapolateRight: 'clamp' });
  const haircutOp = interpolate(frame, [80, 95], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.grey, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily }}>
      <Audio src={staticFile("/audio/part1.mp3")} />
      
      {/* Baker Text */}
      <div style={{ transform: `translateY(${bakerDrop}px)`, position: 'relative' }}>
         <h1 style={{ 
           fontSize: 250, fontWeight: 900, color: COLORS.white, margin: 0, 
           letterSpacing: -10, clipPath: frame > 75 ? `inset(0 0 ${slicePos}% 0)` : 'none' 
         }}>
           BAKER
         </h1>
         {/* Dust Puff */}
         <div style={{ 
           position: 'absolute', bottom: -50, left: '50%', transform: 'translateX(-50%)',
           width: 300, height: 100, background: 'rgba(255,255,255,0.2)', 
           borderRadius: '50%', filter: 'blur(40px)', opacity: dustOpacity 
         }} />
      </div>

      {frame > 80 && (
        <h1 style={{ 
          position: 'absolute', fontSize: 180, fontWeight: 100, 
          color: COLORS.white, opacity: haircutOp, letterSpacing: 20 
        }}>
          HAIRCUT
        </h1>
      )}
    </AbsoluteFill>
  );
};

const Scene2 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale10 = spring({ frame, fps, from: 0, to: 1.5 });
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.grey, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily }}>
      <Audio src={staticFile("/audio/part2.mp3")} />
      <div style={{ transform: `scale(${scale10})`, fontSize: 300, fontWeight: 900, color: COLORS.white, opacity: 0.2 }}>
        10
      </div>
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {[...Array(10)].map((_, i) => (
          <div key={i} style={{ 
            fontSize: 40, fontWeight: 900, color: COLORS.gold, 
            opacity: frame > i * 3 ? 1 : 0, textAlign: 'center' 
          }}>
            BREAD
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Scene3 = () => {
  const frame = useCurrentFrame();
  const shake = Math.sin(frame) * 10;
  const noScale = spring({ frame: frame - 15, fps: 30, from: 0, to: 1 });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.grey, display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily }}>
      <Audio src={staticFile("/audio/part3.mp3")} />
      <div style={{ transform: `rotate(${shake}deg) translateY(${frame}px)`, opacity: interpolate(frame, [0, 30], [1, 0.5]) }}>
        {[...Array(10)].map((_, i) => (
          <div key={i} style={{ fontSize: 40, fontWeight: 900, color: COLORS.red, textAlign: 'center' }}>
            BREAD
          </div>
        ))}
      </div>
      {frame > 15 && (
        <div style={{ 
          position: 'absolute', fontSize: 400, fontWeight: 900, color: COLORS.red, 
          transform: `scale(${noScale}) rotate(-15deg)`, textShadow: '0 0 50px black' 
        }}>
          NO
        </div>
      )}
    </AbsoluteFill>
  );
};

const Scene4 = () => {
  const frame = useCurrentFrame();
  const crack = frame > 45;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.grey, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', fontFamily }}>
      <Audio src={staticFile("/audio/part4.mp3")} />
      <h1 style={{ color: COLORS.white, fontSize: 120, fontWeight: 900 }}>BARTER</h1>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 100, marginTop: 50, position: 'relative' }}>
         <div style={{ fontSize: 80 }}>🍞</div>
         <div style={{ width: 300, height: 10, background: COLORS.white, position: 'relative' }}>
            {crack && <div style={{ position: 'absolute', left: '50%', top: -20, fontSize: 40 }}>⚡</div>}
         </div>
         <div style={{ fontSize: 80 }}>✂️</div>
      </div>

      <div style={{ marginTop: 100, textAlign: 'center' }}>
        {frame % 10 < 5 && <h2 style={{ color: COLORS.gold, fontSize: 80, fontWeight: 900 }}>SAME TIME</h2>}
      </div>
    </AbsoluteFill>
  );
};

const Scene5 = () => {
  const frame = useCurrentFrame();
  const sweep = interpolate(frame, [0, 10], [100, -100]);
  const bg = interpolate(frame, [0, 15], [0, 1]);

  return (
    <AbsoluteFill style={{ 
      backgroundColor: interpolateColor(bg, [0, 1], [COLORS.grey, COLORS.green]), 
      display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily 
    }}>
      <Audio src={staticFile("/audio/part5.mp3")} />
      
      {/* Clean Sweep */}
      <div style={{ 
        position: 'absolute', left: `${sweep}%`, width: '100%', height: '100%', 
        background: 'white', zIndex: 10 
      }} />

      <div style={{ textAlign: 'center', zIndex: 5 }}>
        <div style={{ fontSize: 300, color: COLORS.gold, fontWeight: 900, textShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
          $
        </div>
        <h1 style={{ fontSize: 100, fontWeight: 900, color: COLORS.white, marginTop: -50 }}>
          CURRENCY
        </h1>
      </div>
    </AbsoluteFill>
  );
};

// Helper since interpolateColor was having issues earlier, using a simplified version or just background color transition
const interpolateColor = (val: number, range: number[], colors: string[]) => {
  return val > 0.5 ? colors[1] : colors[0];
};

export const Slideshow: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <Series>
      <Series.Sequence durationInFrames={4 * fps}><Scene1 /></Series.Sequence>
      <Series.Sequence durationInFrames={3 * fps}><Scene2 /></Series.Sequence>
      <Series.Sequence durationInFrames={3 * fps}><Scene3 /></Series.Sequence>
      <Series.Sequence durationInFrames={3 * fps}><Scene4 /></Series.Sequence>
      <Series.Sequence durationInFrames={3 * fps}><Scene5 /></Series.Sequence>
    </Series>
  );
};
