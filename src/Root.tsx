import { Composition } from "remotion";
import { Slideshow } from "./Slideshow";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Slideshow"
        component={Slideshow}
        durationInFrames={185 * 30} // 3:05 duration
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
