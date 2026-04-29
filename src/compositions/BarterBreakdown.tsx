import {
  Series,
  interpolate,
  interpolateColor,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
  staticFile,
  spring,
  Audio,
  Easing,
} from "remotion";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadBubblegum } from "@remotion/google-fonts/BubblegumSans";

const { fontFamily: montserrat } = loadMontserrat();
const { fontFamily: bubblegum } = loadBubblegum();

const COLORS = {
  charcoal: "#1A1A1A",
  emerald: "#064E3B",
  white: "#F9F9F9",
  gold: "#D4AF37",
  red: "#E11D48",
};

// --- Scene Components ---

const Scene1 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // BAKER Drop
  const bakerDrop = spring({
    frame,
    fps,
    config: { mass: 3, damping: 10, stiffness: 100 },
    from: -300,
    to: 0,
  });

  // Dust Puff
  const dustScale = interpolate(frame, [15, 40], [0.5, 2], { extrapolateRight: 'clamp' });
  const dustOpacity = interpolate(frame, [15, 40], [0.8, 0], { extrapolateRight: 'clamp' });

  // Slicing
  const sliceY = interpolate(frame, [45, 60], [0, 1], { extrapolateRight: 'clamp' });
  
  // Split logic
  const leftShift = interpolate(frame, [60, 90], [0, -200], { extrapolateRight: 'clamp' });
  const leftRot = interpolate(frame, [60, 90], [0, -15], { extrapolateRight: 'clamp' });
  const rightShift = interpolate(frame, [60, 90], [0, 200], { extrapolateRight: 'clamp' });
  const rightRot = interpolate(frame, [60, 90], [0, 15], { extrapolateRight: 'clamp' });

  // HAIRCUT fade in
  const haircutOp = interpolate(frame, [75, 100], [0, 1]);
  const haircutSpacing = interpolate(frame, [75, 120], [50, 5], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.charcoal, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Audio src={staticFile("/audio/bb_scene1.mp3")} />
      
      {/* Dust */}
      {frame >= 15 && (
        <div style={{
          position: 'absolute', width: 300, height: 100, borderRadius: '50%',
          background: 'rgba(255,255,255,0.4)', filter: 'blur(30px)',
          transform: `scale(${dustScale})`, opacity: dustOpacity, zIndex: 1
        }} />
      )}

      {/* Slicing Line */}
      <div style={{
        position: 'absolute', width: 2, height: 400 * sliceY, background: COLORS.white, zIndex: 10
      }} />

      {/* BAKER Half Left */}
      <div style={{ 
        position: 'absolute', 
        transform: `translate(${leftShift}px, ${bakerDrop}px) rotate(${leftRot}deg)`,
        clipPath: 'inset(0 50% 0 0)'
      }}>
        <h1 style={{ fontSize: 250, fontFamily: bubblegum, color: COLORS.white, fontStyle: 'italic' }}>BAKER</h1>
      </div>

      {/* BAKER Half Right */}
      <div style={{ 
        position: 'absolute', 
        transform: `translate(${rightShift}px, ${bakerDrop}px) rotate(${rightRot}deg)`,
        clipPath: 'inset(0 0 0 50%)'
      }}>
        <h1 style={{ fontSize: 250, fontFamily: bubblegum, color: COLORS.white, fontStyle: 'italic' }}>BAKER</h1>
      </div>

      {/* HAIRCUT */}
      <h1 style={{ 
        position: 'absolute', fontSize: 150, fontFamily: montserrat, fontWeight: 100, 
        color: COLORS.white, opacity: haircutOp, letterSpacing: haircutSpacing 
      }}>
        HAIRCUT
      </h1>
    </AbsoluteFill>
  );
};

const Scene2 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale10 = spring({ frame, fps, config: { damping: 10 }, from: 0, to: 1.5 });
  const wiggle = frame >= 210 ? Math.sin(frame * 0.5) * 10 : 0;
  const stampScale = spring({ frame: frame - 120, fps, from: 2, to: 1, config: { damping: 12 } });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.charcoal, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Audio src={staticFile("/audio/bb_scene2.mp3")} />
      
      <div style={{ transform: `scale(${scale10})`, fontSize: 300, fontFamily: montserrat, fontWeight: 900, color: COLORS.white, opacity: 0.1 }}>
        10
      </div>

      <div style={{ position: 'absolute', transform: `translateX(${wiggle}px)`, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[...Array(10)].map((_, i) => {
          const entry = spring({ frame: frame - (i * 5), fps, from: 0, to: 1 });
          const color = interpolateColor(frame, [90, 100], [COLORS.gold, COLORS.red]);
          return (
            <div key={i} style={{ 
              fontSize: 50, fontFamily: bubblegum, color, opacity: entry, transform: `scale(${entry})` 
            }}>
              BREAD
            </div>
          );
        })}
      </div>

      {frame >= 120 && (
        <div style={{ 
          position: 'absolute', transform: `scale(${stampScale}) rotate(-10deg)`, 
          fontSize: 500, color: COLORS.red, fontWeight: 900, fontFamily: montserrat,
          textShadow: '0 0 40px black'
        }}>
          NO
        </div>
      )}
    </AbsoluteFill>
  );
};

const Scene3 = () => {
  const frame = useCurrentFrame();
  const exitY = interpolate(frame, [0, 15], [0, 1000], { extrapolateRight: 'clamp' });
  const sameTimeOp = interpolate(frame % 20, [0, 10, 20], [0, 1, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.charcoal, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Audio src={staticFile("/audio/bb_scene3.mp3")} />
      
      <div style={{ transform: `translateY(${exitY}px)`, textAlign: 'center' }}>
        <h1 style={{ color: COLORS.white, fontSize: 100, fontFamily: montserrat, fontWeight: 900 }}>BARTER</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 100, marginTop: 50, position: 'relative', fontSize: 100 }}>
          <span>🍞</span>
          <div style={{ width: 300, height: 10, background: COLORS.white, position: 'relative' }}>
             {frame > 45 && <div style={{ position: 'absolute', left: '50%', top: -30 }}>⚡</div>}
          </div>
          <span>✂️</span>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 200, opacity: sameTimeOp }}>
         <h1 style={{ color: COLORS.gold, fontSize: 80, fontFamily: montserrat, fontWeight: 900 }}>SAME TIME</h1>
      </div>
    </AbsoluteFill>
  );
};

const Scene4 = () => {
  const frame = useCurrentFrame();
  const sweepX = interpolate(frame, [0, 15], [-100, 0]);
  const bgColor = interpolateColor(frame, [0, 15], [COLORS.charcoal, COLORS.emerald]);
  const spinY = interpolate(frame, [20, 50], [0, 720], { easing: Easing.out(Easing.quad) });

  return (
    <AbsoluteFill style={{ backgroundColor: bgColor, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Audio src={staticFile("/audio/bb_scene4.mp3")} />
      
      {/* Wipe */}
      <div style={{ 
        position: 'absolute', left: `${sweepX}%`, width: '100%', height: '100%', 
        background: COLORS.emerald, zIndex: 10 
      }} />

      <div style={{ zIndex: 20, textAlign: 'center' }}>
        <div style={{ 
          fontSize: 350, color: COLORS.gold, fontWeight: 900, 
          transform: `rotateY(${spinY}deg)`, textShadow: '0 10px 40px rgba(0,0,0,0.5)' 
        }}>$</div>
        <h1 style={{ fontSize: 120, color: COLORS.white, fontFamily: montserrat, fontWeight: 900, marginTop: -50 }}>
          CURRENCY
        </h1>
      </div>
    </AbsoluteFill>
  );
};

export const BarterBreakdown: React.FC = () => {
  const { fps } = useVideoConfig();
  return (
    <Series>
      <Series.Sequence durationInFrames={4 * fps}><Scene1 /></Series.Sequence>
      <Series.Sequence durationInFrames={6 * fps}><Scene2 /></Series.Sequence>
      <Series.Sequence durationInFrames={3 * fps}><Scene3 /></Series.Sequence>
      <Series.Sequence durationInFrames={3 * fps}><Scene4 /></Series.Sequence>
    </Series>
  );
};
