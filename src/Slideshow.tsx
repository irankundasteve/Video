import {
  Series,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  AbsoluteFill,
  staticFile,
  spring,
  Easing,
  Audio,
} from "remotion";

const COLORS = {
  bg: "#0B0F1A",
  primary: "#FFFFFF",
  accent: "#00E5A8",
  secondary: "#6C7A89"
};

// --- Scene 1: Hook (0-600f) ---
const Scene1 = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  
  const scale = spring({ frame, fps, config: { damping: 12 }, from: 0.9, to: 1 });
  const pulse = Math.sin(frame / 5) * 0.05 + 1;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Audio src={staticFile("/audio/scene1.mp3")} />
      <div style={{ transform: `scale(${scale * pulse})`, textAlign: 'center' }}>
        <h1 style={{ color: COLORS.primary, fontSize: 80, fontWeight: 'bold' }}>
          Build Once. <span style={{ color: COLORS.accent }}>Earn Forever.</span>
        </h1>
        <div style={{ display: 'flex', gap: 40, marginTop: 40 }}>
           {[1,2,3].map(i => (
             <div key={i} style={{ width: 150, height: 200, background: COLORS.secondary, borderRadius: 20, opacity: 0.8 }} />
           ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 2: Problem (600-1500f) ---
const Scene2 = () => {
  const frame = useCurrentFrame();
  const text = "ZERO DOWNLOADS. ZERO INCOME.";
  const charsShown = Math.floor(frame / 3);
  
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Audio src={staticFile("/audio/scene2.mp3")} />
      <div style={{ fontSize: 100, fontWeight: 'bold', color: COLORS.accent }}>
        {text.substring(0, charsShown)}
        <span style={{ opacity: frame % 10 > 5 ? 1 : 0 }}>|</span>
      </div>
      <div style={{ color: COLORS.secondary, fontSize: 40, marginTop: 20 }}>No Strategy = No Results</div>
    </AbsoluteFill>
  );
};

// --- Scene 3: Truth (1500-2400f) ---
const Scene3 = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  const shiftX = interpolate(frame, [30, 60], [0, -100], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Audio src={staticFile("/audio/scene3.mp3")} />
      <h1 style={{ color: COLORS.primary, fontSize: 70, opacity, transform: `translateX(${shiftX}px)` }}>
        THE PROBLEM IS <span style={{ textDecoration: 'line-through' }}>YOUR CODE</span>
      </h1>
      {frame > 60 && (
        <h1 style={{ color: COLORS.accent, fontSize: 90, position: 'absolute', right: 200 }}>
          YOUR STRATEGY
        </h1>
      )}
    </AbsoluteFill>
  );
};

// --- Scene 4: Framework (2400-3600f) ---
const Scene4 = () => {
  const frame = useCurrentFrame();
  const items = [
    { icon: "⚠️", label: "Problem" },
    { icon: "🛠️", label: "Solution" },
    { icon: "💰", label: "Outcome" }
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 50 }}>
      <Audio src={staticFile("/audio/scene4.mp3")} />
      {items.map((item, i) => {
        const entry = spring({ frame: frame - (i * 20), fps: 30, from: 0, to: 1 });
        const active = frame > 400 + (i * 100) && frame < 500 + (i * 100);
        return (
          <div key={i} style={{ 
            background: active ? COLORS.accent : COLORS.secondary,
            padding: '40px', borderRadius: '20px', textAlign: 'center', width: 250,
            transform: `scale(${entry * (active ? 1.1 : 1)})`,
            opacity: entry
          }}>
            <div style={{ fontSize: 60 }}>{item.icon}</div>
            <div style={{ color: COLORS.bg, fontWeight: 'bold', fontSize: 30 }}>{item.label}</div>
          </div>
        )
      })}
    </AbsoluteFill>
  );
};

// --- Scene 5: Example (3600-4500f) ---
const Scene5 = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Audio src={staticFile("/audio/scene5.mp3")} />
      <div style={{ width: '50%', textAlign: 'center', borderRight: `2px solid ${COLORS.secondary}`, padding: 50 }}>
         <h2 style={{ color: COLORS.secondary }}>Basic Recorder</h2>
         <p style={{ color: COLORS.secondary, textDecoration: 'line-through' }}>Not Enough</p>
      </div>
      <div style={{ width: '50%', textAlign: 'center', padding: 50 }}>
         <h2 style={{ color: COLORS.accent }}>AI Student Recorder</h2>
         <p style={{ color: COLORS.primary }}>Solving Something Real</p>
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 6: Monetization (4500-5100f) ---
const Scene6 = () => {
  const frame = useCurrentFrame();
  const count = Math.floor(interpolate(frame, [0, 60], [0, 299], { easing: Easing.out(Easing.cubic) }));

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Audio src={staticFile("/audio/scene6.mp3")} />
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ color: COLORS.secondary }}>Subscription Revenue</h3>
        <div style={{ fontSize: 150, color: COLORS.accent, fontWeight: 'bold' }}>
          ${count}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// --- Scene 7: Closing (5100-5400f) ---
const Scene7 = () => {
  const frame = useCurrentFrame();
  const underlineWidth = interpolate(frame, [10, 40], [0, 100], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Audio src={staticFile("/audio/scene7.mp3")} />
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ color: COLORS.primary, fontSize: 80 }}>Build Smart.</h1>
        <h1 style={{ color: COLORS.accent, fontSize: 80, position: 'relative' }}>
          Earn Consistently.
          <div style={{ 
            position: 'absolute', bottom: -10, left: 0, height: 8, background: COLORS.accent,
            width: `${underlineWidth}%`
          }} />
        </h1>
      </div>
    </AbsoluteFill>
  );
};

// --- Main Root ---
export const Slideshow: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Series>
        <Series.Sequence durationInFrames={600}><Scene1 /></Series.Sequence>
        <Series.Sequence durationInFrames={900}><Scene2 /></Series.Sequence>
        <Series.Sequence durationInFrames={900}><Scene3 /></Series.Sequence>
        <Series.Sequence durationInFrames={1200}><Scene4 /></Series.Sequence>
        <Series.Sequence durationInFrames={900}><Scene5 /></Series.Sequence>
        <Series.Sequence durationInFrames={600}><Scene6 /></Series.Sequence>
        <Series.Sequence durationInFrames={300}><Scene7 /></Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
