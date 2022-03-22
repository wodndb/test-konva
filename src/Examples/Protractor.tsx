
import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { useEffect, useRef } from "react";
import { Arc, Circle, Layer, Line, Text } from "react-konva";

const CalculateRotation = (p: Vector2d) => {
  var rotation = Math.atan2(p.y, p.x) * 180 / Math.PI;
  if(rotation < 0) rotation = 360 + rotation;

  return rotation;
}

const CalculateAngle = (p1: Vector2d, p2: Vector2d, p3: Vector2d) => {
  var rot1 = CalculateRotation({x: p1.x - p2.x, y: p2.y - p1.y});
  var rot2 = CalculateRotation({x: p3.x - p2.x, y: p2.y - p3.y});

  if(rot1 > rot2) {
    return rot1 - rot2;
  }
  else {
    return rot1 + 360 - rot2;
  }
}

// update all objects on the canvas from the state of the app
const updateObjects = (layer: Konva.Layer) => {
  if (layer === undefined || layer === null) return 0;

  const pos1 = (layer.findOne("#circle-1") as Konva.Circle).position();
  const pos2 = (layer.findOne("#circle-2") as Konva.Circle).position();
  const pos3 = (layer.findOne("#circle-3") as Konva.Circle).position();

  const line = layer.findOne("#connector-1") as Konva.Line;
  const arc = layer.findOne("#arc-1") as Konva.Arc;
  const text = layer.findOne("#text-1") as Konva.Text;

  var rotation = CalculateRotation({x: pos1.x - pos2.x, y: pos2.y - pos1.y});
  var angle = CalculateAngle(pos1, pos2, pos3);

  line.setAttr("points", [pos1.x, pos1.y, pos2.x, pos2.y, pos3.x, pos3.y]);
  arc.setAttr("rotation", -rotation);
  arc.setAttr("angle", angle);
  arc.setPosition(pos2);
  text.setPosition({x: pos2.x + 40, y: pos2.y});
  text.setAttr("text", angle.toFixed(2).toString());

  return angle;
}

type ProtractorProps = {
  p1: Vector2d;
  p2: Vector2d;
  p3: Vector2d;
  onChangeAngle?: (angle:number) => void;
};

const Protractor: React.FC<ProtractorProps> = ({
  p1,
  p2,
  p3,
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
      <Arc
        angle={60}
        id="arc-1"
        x={p2.x}
        y={p2.y}
        innerRadius={0}
        outerRadius={30}
        fill="yellow"
        stroke="black"
        strokeWidth={2}
      />
      <Line
        stroke="black"
        id="connector-1"
        fill="black"
        strokeWidth={2}
        points={[p1.x, p1.y, p2.x, p2.y, p3.x, p3.y]}
      />
      <Text 
        text=""
        id="text-1"
        fontSize={20}
        shadowEnabled={true}
        shadowColor='white'
        shadowBlur={4}
        shadowOpacity={1}
      />
      <Circle
        key={"circle-1"}
        id={"circle-1"}
        x={p1.x}
        y={p1.y}
        radius={10}
        draggable={true}
        onDragMove={onDragMove}
        fill='aqua'
        stroke='black'
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
        fill='aqua'
        stroke='black'
        strokeWidth={2}
      />
      <Circle
        key={"circle-3"}
        id={"circle-3"}
        x={p3.x}
        y={p3.y}
        radius={10}
        draggable={true}
        onDragMove={onDragMove}
        fill='aqua'
        stroke='black'
        strokeWidth={2}
      />
    </Layer>
  );
};

export default Protractor;
