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
import { loadFont } from "@remotion/google-fonts/Nunito";

const { fontFamily } = loadFont();

const COLORS = {
  bg: "#F9F6F0",
  text: "#2D2D2D",
  skin: "#FDDCB5",
  bakerShirt: "#3A7CA5",
  barberPoleRed: "#E52B50",
  barberPoleBlue: "#1E3A5F",
  bread: "#F4C430",
  breadStroke: "#C8A600",
  goldCoin: "#FFD700",
  scissors: "#555555",
  shoe: "#8B4513",
  arrowBaker: "#27AE60",
  arrowBarber: "#2980B9",
  redX: "#E74C3C",
};

// --- Helper Components ---

const ThoughtBubble: React.FC<{ 
  children: React.ReactNode; 
  x: number; 
  y: number; 
  opacity: number;
  scale?: number;
}> = ({ children, x, y, opacity, scale = 1 }) => (
  <div style={{
    position: 'absolute', left: x, top: y,
    width: 140, height: 100, backgroundColor: 'white', border: `3px solid ${COLORS.text}`,
    borderRadius: 20, display: 'flex', justifyContent: 'center', alignItems: 'center',
    opacity, transform: `scale(${scale})`, zIndex: 50
  }}>
    {children}
    <div style={{
       position: 'absolute', bottom: -20, left: 40, width: 0, height: 0,
       borderLeft: '15px solid transparent', borderRight: '15px solid transparent',
       borderTop: `20px solid ${COLORS.text}`
    }} />
    <div style={{
       position: 'absolute', bottom: -14, left: 40, width: 0, height: 0,
       borderLeft: '15px solid transparent', borderRight: '15px solid transparent',
       borderTop: `20px solid white`
    }} />
  </div>
);

const ScissorsIcon = () => (
  <div style={{ fontSize: 40 }}>✂️</div>
);

const BreadIcon = () => (
  <div style={{ width: 40, height: 15, backgroundColor: COLORS.bread, border: `1px solid ${COLORS.breadStroke}`, borderRadius: 4 }} />
);

const ShoeIcon = () => (
  <div style={{ fontSize: 40 }}>👞</div>
);

// --- Character Components ---

const Baker: React.FC<{ 
  expression?: 'neutral' | 'confused' | 'happy';
  showBread?: boolean;
  scratchHead?: boolean;
}> = ({ expression = 'neutral', showBread = false, scratchHead = false }) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame / 5) * 5;
  const handY = scratchHead ? Math.sin(frame / 2) * 10 + 40 : 150;
  const handX = scratchHead ? 100 : 140;

  return (
    <div style={{ position: 'absolute', left: 480 - 80, top: 420 - 60 + bob, width: 160, height: 320 }}>
      <div style={{ position: 'absolute', top: -50, left: 10, width: 140, height: 60, backgroundColor: 'white', borderRadius: '30px 30px 0 0' }} />
      <div style={{ position: 'absolute', top: 0, left: 20, width: 120, height: 120, backgroundColor: COLORS.skin, borderRadius: '50%' }}>
        <div style={{ position: 'absolute', top: 50, left: 35, width: 10, height: 10, backgroundColor: COLORS.text, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: 50, left: 75, width: 10, height: 10, backgroundColor: COLORS.text, borderRadius: '50%' }} />
        <div style={{
          position: 'absolute', top: 80, left: 40, width: 40, height: 20,
          borderBottom: expression === 'happy' ? `4px solid ${COLORS.text}` : expression === 'neutral' ? `2px solid ${COLORS.text}` : 'none',
          borderTop: expression === 'confused' ? `2px solid ${COLORS.text}` : 'none',
          borderRadius: expression === 'happy' ? '0 0 20px 20px' : expression === 'confused' ? '20px 20px 0 0' : '0 0 20px 20px'
        }} />
      </div>
      <div style={{ position: 'absolute', top: 120, left: 0, width: 160, height: 200, backgroundColor: COLORS.bakerShirt, borderRadius: 20 }}>
        <div style={{ position: 'absolute', bottom: 10, left: 10, width: 140, height: 90, backgroundColor: 'white', borderRadius: 10 }} />
      </div>
      {/* Scratching Hand */}
      <div style={{ 
        position: 'absolute', left: handX, top: handY, width: 20, height: 20, 
        backgroundColor: COLORS.skin, borderRadius: '50%', zIndex: 60,
        display: scratchHead || showBread ? 'block' : 'none'
      }} />
      {showBread && (
        <div style={{ position: 'absolute', left: 140, top: 100 }}>
          {[...Array(10)].map((_, i) => (
            <div key={i} style={{
              width: 60, height: 20, backgroundColor: COLORS.bread, border: `2px solid ${COLORS.breadStroke}`,
              borderRadius: 4, position: 'absolute', top: -i * 5
            }} />
          ))}
        </div>
      )}
    </div>
  );
};

const Barber: React.FC<{ 
  shakeHead?: boolean;
  expression?: 'neutral' | 'happy';
}> = ({ shakeHead = false, expression = 'neutral' }) => {
  const frame = useCurrentFrame();
  const rotation = shakeHead ? Math.sin(frame / 2) * 8 : 0;

  return (
    <div style={{ position: 'absolute', left: 1440 - 80, top: 420 - 60, width: 160, height: 320 }}>
      <div style={{ position: 'absolute', left: 220, top: -40, width: 30, height: 180, border: `2px solid ${COLORS.text}`, overflow: 'hidden', backgroundColor: 'white' }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ height: 36, width: '100%', backgroundColor: i % 2 === 0 ? COLORS.barberPoleRed : COLORS.barberPoleBlue }} />
        ))}
      </div>
      <div style={{ position: 'absolute', top: 0, left: 20, width: 120, height: 120, backgroundColor: COLORS.skin, borderRadius: '50%', transform: `rotate(${rotation}deg)` }}>
        <div style={{ position: 'absolute', top: 50, left: 35, width: 10, height: 10, backgroundColor: COLORS.text, borderRadius: '50%' }} />
        <div style={{ position: 'absolute', top: 50, left: 75, width: 10, height: 10, backgroundColor: COLORS.text, borderRadius: '50%' }} />
        <div style={{
           position: 'absolute', top: 80, left: 40, width: 40, height: 20, 
           borderBottom: expression === 'happy' ? `4px solid ${COLORS.text}` : `2px solid ${COLORS.text}`,
           borderRadius: '0 0 20px 20px'
        }} />
      </div>
      <div style={{ position: 'absolute', top: 120, left: 0, width: 160, height: 200, backgroundColor: 'white', border: `2px solid ${COLORS.text}`, borderRadius: 20 }}>
        <div style={{ position: 'absolute', top: 20, left: 20, width: 30, height: 20, backgroundColor: '#CCC' }} />
        <div style={{ position: 'absolute', top: 20, right: 20, width: 30, height: 20, backgroundColor: '#CCC' }} />
      </div>
    </div>
  );
};

const Caption: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: 'absolute', bottom: 120, width: '100%', textAlign: 'center', fontFamily, fontWeight: 700, fontSize: 48, color: COLORS.text }}>
    {text}
  </div>
);

// --- Sub-Scenes ---

const SubScene1 = () => {
  const frame = useCurrentFrame();
  const bubbleOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Audio src={staticFile("/audio/sub1.mp3")} />
      <Baker />
      <ThoughtBubble x={480} y={250} opacity={bubbleOpacity}><ScissorsIcon /></ThoughtBubble>
      <Caption text="Imagine you’re a baker, and you need a haircut." />
    </AbsoluteFill>
  );
};

const SubScene2 = () => {
  const frame = useCurrentFrame();
  const slide = interpolate(frame, [0, 24], [2020, 1440]);
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Audio src={staticFile("/audio/sub2.mp3")} />
      <Baker showBread />
      <div style={{ position: 'absolute', left: slide - 80 }}><Barber /></div>
      <Caption text="You offer the barber ten loaves of bread." />
    </AbsoluteFill>
  );
};

const SubScene3 = () => {
  const frame = useCurrentFrame();
  const bubbleScale = spring({ frame: frame - 6, fps: 30, from: 0, to: 1 });
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Audio src={staticFile("/audio/sub3.mp3")} />
      <Baker expression="confused" showBread />
      <Barber shakeHead />
      <ThoughtBubble x={1440 - 160} y={250} opacity={1} scale={bubbleScale}>
        <div style={{ position: 'relative' }}>
          <BreadIcon />
          <div style={{ position: 'absolute', top: -10, left: 10, fontSize: 40, color: COLORS.redX }}>❌</div>
        </div>
      </ThoughtBubble>
      <Caption text="But what if he doesn’t want bread?" />
    </AbsoluteFill>
  );
};

const SubScene4 = () => {
  const frame = useCurrentFrame();
  const arrowPos = interpolate(frame, [12, 33], [0, 1], { extrapolateRight: 'clamp' });
  const xOpacity = interpolate(frame, [24, 30], [0, 1]);
  const rebound = interpolate(frame, [33, 48], [1, 0], { extrapolateRight: 'clamp' });
  
  const currentPos = frame < 33 ? arrowPos : rebound;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Audio src={staticFile("/audio/sub4.mp3")} />
      <Baker />
      <Barber />
      <ThoughtBubble x={480} y={250} opacity={1}><ScissorsIcon /></ThoughtBubble>
      <ThoughtBubble x={1440 - 160} y={250} opacity={1}><ShoeIcon /></ThoughtBubble>
      
      {/* Arrows */}
      <div style={{ 
        position: 'absolute', left: 480 + 100, top: 600, width: 400 * currentPos, height: 10, 
        backgroundColor: COLORS.arrowBaker, borderRadius: 5 
      }} />
      <div style={{ 
        position: 'absolute', left: 1440 - 100 - (400 * currentPos), top: 620, width: 400 * currentPos, height: 10, 
        backgroundColor: COLORS.arrowBarber, borderRadius: 5 
      }} />

      {/* Large X */}
      <div style={{ 
        position: 'absolute', left: '50%', top: 610, transform: `translate(-50%, -50%) scale(${xOpacity})`,
        fontSize: 150, color: COLORS.redX, fontWeight: 'bold' 
      }}>❌</div>

      <Caption text={frame < 45 ? "That’s the problem with barter—" : "you both have to want what the other has, at the same time."} />
    </AbsoluteFill>
  );
};

const SubScene5 = () => {
  const frame = useCurrentFrame();
  const coinScale = spring({ frame: frame - 3, fps: 30, from: 0, to: 1 });
  const coinRotation = interpolate(frame, [15, 30], [0, 360], { extrapolateRight: 'clamp' });

  // Icons flying out at 14.2s (frame 36 in this sequence)
  const flyProgress = interpolate(frame, [36, 51], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const iconX_Baker = interpolate(flyProgress, [0, 1], [1920/2, 480 + 140]);
  const iconX_Barber = interpolate(flyProgress, [0, 1], [1920/2, 1440 - 100]);
  const iconY = interpolate(flyProgress, [0, 1], [1080/2, 520], { easing: Easing.bezier(0, 1, 1, 1) });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <Audio src={staticFile("/audio/sub5.mp3")} />
      <Baker expression={frame > 45 ? 'happy' : 'neutral'} />
      <Barber expression={frame > 45 ? 'happy' : 'neutral'} />
      
      <div style={{
         position: 'absolute', top: '50%', left: '50%', transform: `translate(-50%, -50%) scale(${coinScale}) rotateY(${coinRotation}deg)`,
         width: 200, height: 200, backgroundColor: COLORS.goldCoin, borderRadius: '50%',
         border: '6px solid #B8860B', display: 'flex', justifyContent: 'center', alignItems: 'center',
         fontSize: 100, fontWeight: 'bold', color: '#B8860B', zIndex: 100
      }}>$</div>

      {frame > 36 && (
        <>
          <div style={{ position: 'absolute', left: iconX_Baker, top: iconY, transform: 'translate(-50%, -50%)' }}>
            <BreadIcon />
          </div>
          <div style={{ position: 'absolute', left: iconX_Barber, top: iconY, transform: 'translate(-50%, -50%)' }}>
            <ScissorsIcon />
          </div>
        </>
      )}

      <Caption text="Currency solves that." />
    </AbsoluteFill>
  );
};

export const Slideshow: React.FC = () => {
  return (
    <Series>
      <Series.Sequence durationInFrames={3 * 30}><SubScene1 /></Series.Sequence>
      <Series.Sequence durationInFrames={3 * 30}><SubScene2 /></Series.Sequence>
      <Series.Sequence durationInFrames={4 * 30}><SubScene3 /></Series.Sequence>
      <Series.Sequence durationInFrames={3 * 30}><SubScene4 /></Series.Sequence>
      <Series.Sequence durationInFrames={3 * 30}><SubScene5 /></Series.Sequence>
    </Series>
  );
};
