import { Composition } from "remotion";
import { Slideshow as BakerBarberKinetic } from "./compositions/BakerBarberKinetic";
import { BitcoinTheShift } from "./compositions/BitcoinTheShift";
import { NewScene } from "./compositions/NewScene";
import { BarterBreakdown } from "./compositions/BarterBreakdown";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BakerBarberKinetic"
        component={BakerBarberKinetic}
        durationInFrames={16 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="BitcoinTheShift"
        component={BitcoinTheShift}
        durationInFrames={50 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="NewScene"
        component={NewScene}
        durationInFrames={5 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="BarterBreakdown"
        component={BarterBreakdown}
        durationInFrames={16 * 30}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
