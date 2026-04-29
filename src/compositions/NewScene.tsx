import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

export const NewScene: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);

  return (
    <AbsoluteFill style={{ 
      backgroundColor: "#111", 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      color: 'white',
      fontSize: 80,
      fontFamily: 'Arial'
    }}>
      <div style={{ opacity }}>New Scene Template</div>
    </AbsoluteFill>
  );
};
