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
  Audio,
} from "remotion";

const COLORS = {
  bg: "#0D0D0D",
  silver: "#C0C4D0",
  electricBlue: "#00BFFF",
  cosmicPurple: "#A78BFA",
  warmOrange: "#F59E0B",
  white: "#FFFFFF",
  grey: "#A0AEC0",
  lithiumSilver: "#E2E8F0"
};

// --- Shared Components ---

const Label = ({ text, style = {} }: { text: string, style?: React.CSSProperties }) => (
  <div style={{
    color: COLORS.grey, fontSize: 30, textTransform: 'uppercase', letterSpacing: 4, 
    textAlign: 'center', opacity: 0.3, ...style
  }}>
    {text}
  </div>
);

const LithiumAtom = ({ scale = 1, showElectronJump = false }: { scale?: number, showElectronJump?: boolean }) => {
  const frame = useCurrentFrame();
  const electronPos = interpolate(frame % 30, [0, 15, 30], [0, 50, 0]);
  
  return (
    <div style={{ transform: `scale(${scale})`, position: 'relative' }}>
      {/* Nucleus */}
      <div style={{
        width: 60, height: 60, borderRadius: '50%', background: COLORS.lithiumSilver,
        boxShadow: `0 0 30px ${COLORS.lithiumSilver}`
      }} />
      {/* Shells */}
      <div style={{
        position: 'absolute', top: -40, left: -40, width: 140, height: 140,
        borderRadius: '50%', border: `1px solid ${COLORS.grey}`, opacity: 0.3
      }} />
      {/* Jumping Electron */}
      {showElectronJump && (
        <div style={{
          position: 'absolute', top: 50, left: electronPos + 70, width: 15, height: 15,
          borderRadius: '50%', background: COLORS.electricBlue, boxShadow: `0 0 10px ${COLORS.electricBlue}`
        }} />
      )}
    </div>
  );
};

// --- Scenes ---

const Scene1 = () => {
  const frame = useCurrentFrame();
  const q1Op = interpolate(frame, [0, 30], [0, 0.3]);
  const q2Op = interpolate(frame, [30, 60], [0, 0.3]);
  const q3Op = interpolate(frame, [60, 90], [0, 0.3]);
  const explode = spring({ frame: frame - 110, fps: 30, from: 0, to: 1 });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Audio src={staticFile("/audio/scene1.mp3")} />
      <div style={{ position: 'absolute', top: '30%', left: '20%', opacity: q1Op }}>POWERS YOUR SMARTPHONE?</div>
      <div style={{ position: 'absolute', top: '25%', left: '50%', transform: 'translateX(-50%)', opacity: q2Op }}>CALMS A RACING MIND?</div>
      <div style={{ position: 'absolute', top: '30%', right: '20%', opacity: q3Op }}>BORN AT THE DAWN OF TIME?</div>
      
      <div style={{ transform: `scale(${interpolate(explode, [0, 1], [0.1, 1.5])})` }}>
        <LithiumAtom />
      </div>

      {frame > 110 && (
        <div style={{ position: 'absolute', bottom: '20%', fontSize: 120, fontWeight: 'black', color: COLORS.lithiumSilver }}>
          LITHIUM
        </div>
      )}
    </AbsoluteFill>
  );
};

const Scene2 = () => {
  const frame = useCurrentFrame();
  const barY = interpolate(frame, [0, 60], [-200, 400], { extrapolateRight: 'clamp' });
  const wave = Math.sin(frame / 10) * 10;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Audio src={staticFile("/audio/scene2.mp3")} />
      {/* Lithium Bar */}
      <div style={{
        position: 'absolute', left: '25%', top: barY + wave,
        width: 200, height: 80, background: COLORS.lithiumSilver, borderRadius: 40,
        display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 40, fontWeight: 'bold'
      }}>Li</div>
      
      {/* Water Surface */}
      <div style={{
        position: 'absolute', bottom: '20%', width: '100%', height: 4, background: COLORS.electricBlue
      }} />

      <div style={{ position: 'absolute', top: 100, right: 100, fontSize: 60, color: COLORS.silver }}>
         SOFT, SILVERY, LIGHT
      </div>
    </AbsoluteFill>
  );
};

const Scene3 = () => {
  const frame = useCurrentFrame();
  const chargeWidth = interpolate(frame, [100, 400], [0, 100], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Audio src={staticFile("/audio/scene3.mp3")} />
      <LithiumAtom scale={1.5} showElectronJump={true} />
      
      {/* Battery */}
      <div style={{
        position: 'absolute', bottom: 100, width: 400, height: 100,
        border: `4px solid ${COLORS.grey}`, borderRadius: 10, overflow: 'hidden'
      }}>
         <div style={{ width: `${chargeWidth}%`, height: '100%', background: COLORS.electricBlue, boxShadow: `0 0 20px ${COLORS.electricBlue}` }} />
      </div>
      <h1 style={{ position: 'absolute', top: 50, color: COLORS.white, fontSize: 80 }}>LITHIUM-ION</h1>
    </AbsoluteFill>
  );
};

const Scene4 = () => {
  const frame = useCurrentFrame();
  const hue = interpolate(frame, [0, 750], [0, 270]);
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Audio src={staticFile("/audio/scene4.mp3")} />
      <div style={{ 
        width: 500, height: 400, background: `hsla(${hue}, 70%, 50%, 0.3)`, 
        borderRadius: '40% 60% 70% 30% / 50% 30% 70% 50%',
        boxShadow: `0 0 100px hsla(${hue}, 70%, 50%, 0.5)`,
        transition: 'background 0.5s'
      }}>
        <div style={{ color: COLORS.white, fontSize: 60, textAlign: 'center', marginTop: 150 }}>MOOD STABILISER</div>
      </div>
    </AbsoluteFill>
  );
};

const Scene5 = () => {
  const frame = useCurrentFrame();
  const stars = Array.from({ length: 50 }).map((_, i) => ({
    x: Math.random() * 100, y: Math.random() * 100, size: Math.random() * 4
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Audio src={staticFile("/audio/scene5.mp3")} />
      {stars.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size, background: 'white', borderRadius: '50%',
          opacity: Math.sin(frame / 10 + i) * 0.5 + 0.5
        }} />
      ))}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
         <h1 style={{ color: COLORS.white, fontSize: 70 }}>BORN IN THE FIRST 3 MINUTES</h1>
         <div style={{ fontSize: 100, color: COLORS.cosmicPurple, fontWeight: 'bold' }}>BIG BANG RELIC</div>
      </div>
    </AbsoluteFill>
  );
};

const Scene6 = () => {
  const frame = useCurrentFrame();
  const graphPath = interpolate(frame, [0, 900], [1000, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Audio src={staticFile("/audio/scene6.mp3")} />
      <svg width="100%" height="100%" viewBox="0 0 1280 720">
        <path d="M 100 600 Q 400 550 700 300 T 1200 100" fill="none" stroke={COLORS.electricBlue} strokeWidth="8" strokeDasharray="1000" strokeDashoffset={graphPath} />
      </svg>
      <div style={{ position: 'absolute', bottom: 50, left: 100, color: COLORS.red, fontSize: 50 }}>DEMAND IS SKYROCKETING</div>
      <div style={{ position: 'absolute', top: 100, right: 100, color: COLORS.grey, fontSize: 30 }}>BUT AT WHAT COST?</div>
    </AbsoluteFill>
  );
};

const Scene7 = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Audio src={staticFile("/audio/scene7.mp3")} />
      <LithiumAtom scale={2} />
      <div style={{ position: 'absolute', bottom: 100, color: COLORS.lithiumSilver, fontSize: 50, textAlign: 'center', width: '80%' }}>
        LITHIUM: CONNECTING COSMIC TO PERSONAL
      </div>
    </AbsoluteFill>
  );
};

// --- Composition ---

export const Slideshow: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Series>
        <Series.Sequence durationInFrames={450}><Scene1 /></Series.Sequence>
        <Series.Sequence durationInFrames={750}><Scene2 /></Series.Sequence>
        <Series.Sequence durationInFrames={900}><Scene3 /></Series.Sequence>
        <Series.Sequence durationInFrames={750}><Scene4 /></Series.Sequence>
        <Series.Sequence durationInFrames={900}><Scene5 /></Series.Sequence>
        <Series.Sequence durationInFrames={900}><Scene6 /></Series.Sequence>
        <Series.Sequence durationInFrames={900}><Scene7 /></Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
