import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { useEffect, useRef } from "react";
import { Circle, Layer, Line, Text } from "react-konva";

const CalculateAngle = (p1: Vector2d, p2: Vector2d) => {
  return Math.atan2(p1.y - p2.y, p2.x - p1.x) * 180 / Math.PI;
}

// update all objects on the canvas from the state of the app
const updateObjects = (layer: Konva.Layer) => {
  if (layer === undefined || layer === null) return 0;

  const pos1 = (layer.findOne("#circle-1") as Konva.Circle).position();
  const pos2 = (layer.findOne("#circle-2") as Konva.Circle).position();

  const line = layer.findOne("#connector-1") as Konva.Line;
  const text = layer.findOne("#text-1") as Konva.Text;

  var angle = CalculateAngle(pos1, pos2);

  line.setAttr("points", [pos1.x, pos1.y, pos2.x, pos2.y]);
  text.setPosition({x: pos2.x, y: pos2.y + 20});
  text.setAttr("text", angle.toFixed(2).toString() + "°");

  return angle;
}

type HorizaontalProtractorProps = {
  p1: Vector2d;
  p2: Vector2d;
  onChangeAngle?: (angle: number) => void;
};

const HorizontalProtractor: React.FC<HorizaontalProtractorProps> = ({
  p1,
  p2,
  onChangeAngle,
}) => {
  const layer = useRef<Konva.Layer>(null);

  useEffect(() => {
    if(layer.current !== null) {
      updateObjects(layer.current);
    }
  }, [layer.current])

  const onDragMove = (evt: KonvaEventObject<DragEvent>) => {
    const layer = evt.target.getLayer();
    if (layer !== null) {
      const angle = updateObjects(layer);
      if(onChangeAngle !== undefined) onChangeAngle(angle);
    }
  };

  return (
    <Layer ref={layer}>
      <Line
        stroke="black"
        id="connector-1"
        fill="black"
        strokeWidth={2}
        points={[p1.x, p1.y, p2.x, p2.y]}
      />
      <Text 
        text=""
        id="text-1"
        fontSize={20}
        shadowEnabled={true}
        shadowColor='white'
        shadowBlur={10}
        shadowOpacity={1}
        fontStyle='bold'
      />
      <Circle
        key={"circle-1"}
        id={"circle-1"}
        x={p1.x}
        y={p1.y}
        radius={10}
        draggable={true}
        onDragMove={onDragMove}
        fill="aqua"
        stroke="black"
        strokeWidth={2}
      />
      <Circle
        key={"circle-2"}
        id={"circle-2"}
        x={p2.x}
        y={p2.y}
        radius={10}
        draggable={true}
        onDragMove={onDragMove}
        fill="aqua"
        stroke="black"
        strokeWidth={2}
      />
    </Layer>
  );
};

export default HorizontalProtractor;
