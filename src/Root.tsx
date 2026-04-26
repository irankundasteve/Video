import { Composition } from "remotion";
import { Slideshow } from "./Slideshow";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Slideshow"
        component={Slideshow}
        durationInFrames={180 * 30} // 3 minutes * 30 fps
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
