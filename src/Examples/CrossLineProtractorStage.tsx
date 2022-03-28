import Konva from "konva";
import { useRef } from "react";
import { Image, Layer, Stage } from "react-konva";
import useImage from "use-image";
import CrossLineProtractor from "./CrossLineProtractor";
import imageurl from "../resources/skeleton.png";

const CrossLineProtractorStage: React.VFC = () => {
  const [image] = useImage(imageurl);
  const stage = useRef<Konva.Stage>(null);
  const layer = useRef<Konva.Layer>(null);
  const movable = useRef<boolean>(false);
  const bgImage = useRef<Konva.Image>(null);

  return (
    <Stage
      ref={stage}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={() => {
        layer.current?.scale({ x: 2, y: 2 });
        movable.current = true;

        const pos = stage.current?.getPointerPosition();
        if (pos === undefined || pos === null || !movable.current) return;
        layer.current?.setPosition({ x: -pos.x, y: -pos.y });

        stage.current?.toImage({callback:(image) =>{
          if(bgImage.current !== null) {
            bgImage.current.image(image)
          }
        }})
      }}
      onMouseUp={() => {
        layer.current?.scale({ x: 1, y: 1 });
        movable.current = false;
        layer.current?.setPosition({ x: 0, y: 0 });
      }}
      onMouseMove={() => {
        var pos = stage.current?.getPointerPosition();
        if (pos === undefined || pos === null || !movable.current) return;
        layer.current?.setPosition({ x: -pos.x, y: -pos.y });
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
      </Layer>
    </Stage>
  );
};

export default CrossLineProtractorStage;
