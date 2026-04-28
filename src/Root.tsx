import { Composition } from "remotion";
import { Slideshow } from "./Slideshow";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Slideshow"
        component={Slideshow}
        durationInFrames={16 * 30} // 16 seconds
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
