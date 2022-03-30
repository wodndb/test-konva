import Konva from "konva";
import { useRef } from "react";
import { Circle, Group, Image, Layer, Line, Rect, Stage } from "react-konva";
import useImage from "use-image";
import CrossLineProtractor from "./CrossLineProtractor";
import imageurl from "../resources/skeleton.png";

const CrossLineProtractorStage: React.VFC = () => {
  const [bgImage] = useImage(imageurl);
  const stage = useRef<Konva.Stage>(null);
  const layer = useRef<Konva.Layer>(null);
  const movable = useRef<boolean>(false);
  const group = useRef<Konva.Group>(null);
  const imageRef = useRef<Konva.Image>(null);

  const OnTouchStart = () => {
    movable.current = true;
    group.current?.show();

    UpdatePos();
  };

  const OnTouchEnd = () => {
    group.current?.hide();
    movable.current = false;
  };

  const OnTouchMove = () => {
    UpdatePos();
  };

  const UpdatePos = () => {
    var pos = stage.current?.getPointerPosition();
    if (pos === undefined || pos === null || !movable.current) return;

    group.current?.setPosition(pos);
    imageRef.current?.setPosition({
      x: -pos.x * 2 + 88,
      y: -pos.y * 2 + 88,
    });
  }

  return (
    <Stage
      ref={stage}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={OnTouchStart}
      onTouchStart={OnTouchStart}
      onMouseUp={OnTouchEnd}
      onTouchEnd={OnTouchEnd}
      onMouseMove={OnTouchMove}
      onTouchMove={OnTouchMove}
    >
      <Layer ref={layer}>
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
        <Group
          ref={group}
          clip={{
            x: 40,
            y: 40,
            width: 100,
            height: 100,
          }}
          visible={false}
          stroke="grey"
          strokeWidth={5}
        >
          <Image ref={imageRef} image={bgImage} scaleX={2} scaleY={2} />
          <Rect x={40} y={40} width={100} height={100} fill={undefined} stroke="grey" strokeWidth={5}/>
          <Line x={90} y={90} points={[-5, 0, 5, 0]} stroke="red"/>
          <Line x={90} y={90} points={[0, -5, 0, 5]} stroke="red"/>
        </Group>
      </Layer>
    </Stage>
  );
};

export default CrossLineProtractorStage;
