import Konva from "konva";
import { useRef } from "react";
import { Layer, Stage } from "react-konva";
import CrossLineProtractor from "./CrossLineProtractor";

const CrossLineProtractorStage: React.VFC = () => {
  const stage = useRef<Konva.Stage>(null);

  return (
    <Stage
      ref={stage}
      width={window.innerWidth}
      height={window.innerHeight}
    >
      <Layer>
        <CrossLineProtractor lineType={"horizontal"} stageRef={stage} x={200} y={200} />
        <CrossLineProtractor lineType={"cross"} stageRef={stage} x={200} y={400} />
      </Layer>
    </Stage>
  );
};

export default CrossLineProtractorStage;
