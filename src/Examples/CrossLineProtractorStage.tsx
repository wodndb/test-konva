import Konva from "konva";
import { useRef } from "react";
import { Group, Image, Layer, Stage } from "react-konva";
import useImage from "use-image";
import CrossLineProtractor from "./CrossLineProtractor";
import imageurl from "../resources/skeleton.png";

const CrossLineProtractorStage: React.VFC = () => {
  const [image] = useImage(imageurl);
  const stage = useRef<Konva.Stage>(null);
  const layer = useRef<Konva.Layer>(null);
  const movable = useRef<boolean>(false);
  const group = useRef<Konva.Group>(null);

  return (
    <Stage
      ref={stage}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={() => {
        movable.current = true;
        group.current?.show();

        const pos = stage.current?.getPointerPosition();
        if (pos === undefined || pos === null || !movable.current) return;

        group.current?.setPosition(pos);
      }}
      onMouseUp={() => {
        group.current?.hide();
        movable.current = false;
      }}
      onMouseMove={() => {
        var pos = stage.current?.getPointerPosition();
        if (pos === undefined || pos === null || !movable.current) return;
        group.current?.setPosition(pos);
      }}
    >
      <Layer ref={layer}>
        <Image image={image} scaleX={1} scaleY={1} />
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
        <Group ref={group}
          clip={{
            x: 40,
            y: 40,
            width: 100,
            height: 100,
          }}
        >
          <Image image={image} scaleX={2} scaleY={2} />
        </Group>
      </Layer>
    </Stage>
  );
};

export default CrossLineProtractorStage;
