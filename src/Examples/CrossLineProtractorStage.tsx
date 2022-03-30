import Konva from "konva";
import { useRef } from "react";
import { Image, Layer, Stage } from "react-konva";
import useImage from "use-image";
import CrossLineProtractor from "./CrossLineProtractor";
import imageurl from "../resources/skeleton.png";
import PointerMagnifier from "./PointerMagnifier";

const CrossLineProtractorStage: React.VFC = () => {
  const [bgImage] = useImage(imageurl);
  const stage = useRef<Konva.Stage>(null);

  return (
    <Stage
      ref={stage}
      width={window.innerWidth}
      height={window.innerHeight}
    >
      <Layer>
        <Image image={bgImage} scaleX={1} scaleY={1} />
        <CrossLineProtractor
          lineType={"horizontal"}
          stageRef={stage}
          x={200}
          y={200}
          rotation={0}
        />
        <CrossLineProtractor
          lineType={"cross"}
          stageRef={stage}
          x={200}
          y={400}
          rotation={0}
        />
        <CrossLineProtractor
          lineType={"horizontal"}
          stageRef={stage}
          x={200}
          y={600}
          rotation={0}
        />
        <PointerMagnifier bgImage={bgImage} scale={2} x={-50} y={-140} width={100} height={100}/>
      </Layer>
    </Stage>
  );
};

export default CrossLineProtractorStage;
