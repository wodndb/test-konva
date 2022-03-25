import Konva from "konva";
import { useRef } from "react";
import { Image, Layer, Stage } from "react-konva";
import useImage from "use-image";
import CrossLineProtractor from "./CrossLineProtractor";
import imageurl from "../resources/skeleton.png";

const BackgroundImage: React.FC<{ url: string }> = ({ url }) => {
  const [image] = useImage(url);
  return <Image image={image} scaleX={1} scaleY={1} />;
};

const CrossLineProtractorStage: React.VFC = () => {
  const stage = useRef<Konva.Stage>(null);

  return (
    <Stage
      ref={stage}
      width={window.innerWidth}
      height={window.innerHeight}
    >
      <Layer>
        <BackgroundImage url={imageurl} />
      </Layer>
      <Layer>
        <CrossLineProtractor lineType={"horizontal"} stageRef={stage} x={200} y={200} rotation={0}/>
        <CrossLineProtractor lineType={"cross"} stageRef={stage} x={200} y={400} rotation={0}/>
        <CrossLineProtractor lineType={"horizontal"} stageRef={stage} x={200} y={600} rotation={0}/>
      </Layer>
    </Stage>
  );
};

export default CrossLineProtractorStage;
