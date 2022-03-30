import Konva from "konva";
import { Vector2d } from "konva/lib/types";
import { Group, Image, Line, Rect } from "react-konva";

type ObjectPositionMagnifierProps = {
  bgImage?: CanvasImageSource;
  scale: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export const ShowObjectPositionMagnifier = (group: Konva.Group, pos:Vector2d) => {
  if(group === undefined || group.id() !== "ObjectPositionMagnifier") return;
  group.show();
  updatePos(group, pos);
}

export const HideObjectPositionMagnifier = (group: Konva.Group) => {
  if(group === undefined || group.id() !== "ObjectPositionMagnifier") return;
  group.hide();
}

export const MoveObjectPositionMagnifier = (group: Konva.Group, pos:Vector2d) => {
  if(group === undefined || group.id() !== "ObjectPositionMagnifier") return;

  updatePos(group, pos);
}

const updatePos = (group: Konva.Group, pos:Vector2d) => {
  const image = group.findOne("#ObjectPositionMagnifierImage");
  const scale = image.scaleX();
  const width = group.clipWidth();
  const height = group.clipHeight();
  const x = group.clipX();
  const y = group.clipY();

  group.setPosition(pos);
  image.setPosition({
    x: -pos.x * scale + (width / 2 + x) - scale,
    y: -pos.y * scale + (height / 2 + y) - scale,
  });
}

const ObjectPositionMagnifier: React.FC<ObjectPositionMagnifierProps> = ({
  bgImage,
  scale,
  x,
  y,
  width,
  height,
  ...props
}) => {
  return (
    <Group
      id={"ObjectPositionMagnifier"}
      clip={{
        x: x,
        y: y,
        width: width,
        height: height,
      }}
      visible={false}
      stroke="grey"
      strokeWidth={5}
    >
      <Rect x={x} y={y} width={width} height={height} fill="white" />
      <Image id={"ObjectPositionMagnifierImage"} image={bgImage} scaleX={scale} scaleY={scale} />
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        stroke="grey"
        strokeWidth={5}
      />
      <Line
        x={x + width / 2}
        y={y + height / 2}
        points={[-5, 0, 5, 0]}
        stroke="red"
      />
      <Line
        x={x + width / 2}
        y={y + height / 2}
        points={[0, -5, 0, 5]}
        stroke="red"
      />
    </Group>
  );
};

export default ObjectPositionMagnifier;
