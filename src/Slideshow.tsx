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

// --- Visual Components ---

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width } = useVideoConfig();
  const barWidth = (frame / durationInFrames) * width;
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, width: barWidth, height: 10,
      backgroundColor: '#2ecc71', zIndex: 100
    }} />
  );
};

const OverlayText: React.FC<{ text: string; subtext?: string; delay?: number }> = ({ text, subtext, delay = 0 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 15], [0, 1], { extrapolateRight: "clamp" });
  const translateY = interpolate(frame, [delay, delay + 20], [30, 0], { easing: Easing.out(Easing.exp), extrapolateRight: "clamp" });

  return (
    <div style={{
      position: 'absolute', top: '50%', width: '100%', textAlign: 'center',
      opacity, transform: `translateY(${translateY}px)`, zIndex: 10
    }}>
      <h1 style={{ color: 'white', fontSize: 80, fontWeight: 'bold', textShadow: '0 5px 15px rgba(0,0,0,0.5)', margin: 0 }}>
        {text}
      </h1>
      {subtext && (
        <h2 style={{ color: '#2ecc71', fontSize: 40, marginTop: 10 }}>{subtext}</h2>
      )}
    </div>
  );
};

const BackgroundImage: React.FC<{ index: number; zoomDirection?: 'in' | 'out' }> = ({ index, zoomDirection = 'in' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scale = spring({
    frame, fps, config: { damping: 200 },
    from: zoomDirection === 'in' ? 1 : 1.2,
    to: zoomDirection === 'in' ? 1.2 : 1,
  });

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Img
        src={staticFile(`/images/img_${index}.jpg`)}
        style={{ width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})` }}
      />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.6) 100%)'
      }} />
    </AbsoluteFill>
  );
};

// --- Script Sections with Audio ---

const Section: React.FC<{ 
  audioName: string; 
  children: React.ReactNode;
}> = ({ audioName, children }) => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile(`/audio/${audioName}.mp3`)} />
      {children}
    </AbsoluteFill>
  );
}

const Hook: React.FC = () => (
  <Section audioName="hook">
    <BackgroundImage index={0} />
    <OverlayText text="Build Once." subtext="Earn Forever." />
  </Section>
);

const Problem: React.FC = () => (
  <Section audioName="problem">
    <BackgroundImage index={2} zoomDirection="out" />
    <OverlayText text="No Strategy =" subtext="No Results." delay={30} />
  </Section>
);

const Shift: React.FC = () => (
  <Section audioName="shift">
    <BackgroundImage index={3} />
    <OverlayText text="Solve Real Problems" subtext="For Real People" delay={20} />
  </Section>
);

const Framework: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity1 = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" });
  const opacity2 = interpolate(frame, [40, 55], [0, 1], { extrapolateRight: "clamp" });
  const opacity3 = interpolate(frame, [70, 85], [0, 1], { extrapolateRight: "clamp" });

  return (
    <Section audioName="framework">
      <AbsoluteFill style={{ backgroundColor: '#1a1a1a' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 40 }}>
          <div style={{ opacity: opacity1, background: '#333', padding: '20px 40px', borderRadius: 10, width: 600, color: 'white', fontSize: 30, textAlign: 'center' }}>
            1. Find a Painful Problem
          </div>
          <div style={{ opacity: opacity2, background: '#333', padding: '20px 40px', borderRadius: 10, width: 600, color: 'white', fontSize: 30, textAlign: 'center' }}>
            2. Build a Simple Tool
          </div>
          <div style={{ opacity: opacity3, background: '#2ecc71', padding: '20px 40px', borderRadius: 10, width: 600, color: 'white', fontSize: 30, textAlign: 'center' }}>
            3. Charge for Value
          </div>
        </div>
      </AbsoluteFill>
    </Section>
  );
};

const Example: React.FC = () => (
  <Section audioName="example">
    <BackgroundImage index={5} />
    <OverlayText text="Don't build just an app." subtext="Build a Solution." />
  </Section>
);

const Monetization: React.FC = () => (
  <Section audioName="monetization">
    <BackgroundImage index={7} />
    <OverlayText text="People pay for" subtext="RESULTS." delay={15} />
  </Section>
);

const Closing: React.FC = () => (
  <Section audioName="closing">
    <BackgroundImage index={19} />
    <OverlayText text="Build Smart." subtext="Earn Consistently." delay={10} />
  </Section>
);

// --- Main Composition ---

export const Slideshow: React.FC = () => {
  const { fps } = useVideoConfig();
  
  return (
    <AbsoluteFill style={{ backgroundColor: 'black', fontFamily: 'Arial' }}>
      <Series>
        <Series.Sequence durationInFrames={20 * fps}>
          <Hook />
        </Series.Sequence>
        <Series.Sequence durationInFrames={30 * fps}>
          <Problem />
        </Series.Sequence>
        <Series.Sequence durationInFrames={30 * fps}>
          <Shift />
        </Series.Sequence>
        <Series.Sequence durationInFrames={35 * fps}>
          <Framework />
        </Series.Sequence>
        <Series.Sequence durationInFrames={30 * fps}>
          <Example />
        </Series.Sequence>
        <Series.Sequence durationInFrames={20 * fps}>
          <Monetization />
        </Series.Sequence>
        <Series.Sequence durationInFrames={15 * fps}>
          <Closing />
        </Series.Sequence>
      </Series>
      <ProgressBar />
    </AbsoluteFill>
  );
};
