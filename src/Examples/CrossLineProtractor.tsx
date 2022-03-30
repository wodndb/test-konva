import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { Vector2d } from "konva/lib/types";
import { useEffect, useRef } from "react";
import { Arc, Group, Line, Text } from "react-konva";
import { HideObjectPositionMagnifier, MoveObjectPositionMagnifier, ShowObjectPositionMagnifier } from "./ObjectPositionMagtifier";

const CalculateRotation = (p: Vector2d) => {
  var rotation = (Math.atan2(p.y, p.x) * 180) / Math.PI;
  if (rotation < 0) rotation = 360 + rotation;

  return rotation;
};

const CalculateAngle = (p1: Vector2d, p2: Vector2d, p3: Vector2d) => {
  var rot1 = CalculateRotation({ x: p1.x - p2.x, y: p2.y - p1.y });
  var rot2 = CalculateRotation({ x: p3.x - p2.x, y: p2.y - p3.y });

  if (rot1 > rot2) {
    return rot1 - rot2;
  } else {
    return rot1 + 360 - rot2;
  }
};

type CrossLineProtractorProps = {
  stageRef: React.RefObject<Konva.Stage>;
  x: number;
  y: number;
  rotation: number;
  lineType: "cross" | "horizontal" | "vertical";
};

const CrossLineProtractor: React.FC<CrossLineProtractorProps> = ({
  stageRef,
  x,
  y,
  rotation,
  lineType,
}) => {
  const rotGroup = useRef<Konva.Group>(null);
  const movGroup = useRef<Konva.Group>(null);
  const text = useRef<Konva.Text>(null);
  const rotable = useRef<boolean>(false);
  const dragable = useRef<boolean>(false);
  const prevPointCoord = useRef<Vector2d>({ x: 0, y: 0 });
  const targetNode = useRef<Konva.Node>();

  const onTouchStart = () => {
    if (!stageRef) return;
    if (stageRef.current !== null && movGroup.current != null) {
      const position = stageRef.current.getPointerPosition();
      const groupPosition = movGroup.current.getPosition();
      if (position !== null) {
        prevPointCoord.current = {
          x: position.x - groupPosition.x,
          y: position.y - groupPosition.y,
        };
      }
    }
  };

  const onTouchEnd = () => {
    rotable.current = false;
    dragable.current = false;

    const group = stageRef.current?.findOne("#ObjectPositionMagnifier") as Konva.Group;
    HideObjectPositionMagnifier(group);
  };

  const onTouchMove = () => {
    if (
      stageRef.current !== null &&
      rotGroup.current !== null &&
      movGroup.current != null &&
      (rotable.current || dragable.current)
    ) {
      const position = stageRef.current.getPointerPosition();
      const groupPosition = movGroup.current.getPosition();
      if (position !== null) {
        const movePosition: Vector2d = {
          x: position.x - groupPosition.x,
          y: position.y - groupPosition.y,
        };

        if (rotable.current && text.current !== null) {
          var rot = rotGroup.current.rotation();
          var vRot = CalculateAngle(
            prevPointCoord.current,
            { x: 0, y: 0 },
            movePosition
          );
          if (vRot > 180) vRot -= 360;
          var rotation = rot + vRot;
          if (rotation < -180) rotation += 360;
          if (rotation > 180) rotation -= 360;

          rotGroup.current.rotation(rotation);
          text.current.setAttr("text", rotGroup.current.rotation().toFixed(2));
        }

        if (dragable.current) {
          movGroup.current.setPosition(position);
        }

        prevPointCoord.current = movePosition;

        const group = stageRef.current?.findOne("#ObjectPositionMagnifier") as Konva.Group;
        if(group !== null && group !== undefined) {
          const targetPos = targetNode.current?.getAbsolutePosition();
          if(targetPos !== undefined && targetPos !== null)
          MoveObjectPositionMagnifier(group, targetPos);
        }
      }
    }
  };

  const onTouchObjectStart = (evt: KonvaEventObject<MouseEvent | TouchEvent>) => {
    targetNode.current = evt.target as Konva.Node;
    const group = stageRef.current?.findOne("#ObjectPositionMagnifier") as Konva.Group;
    if(group !== null && group !== undefined) {
      console.log(targetNode.current.getAbsolutePosition());
      ShowObjectPositionMagnifier(group, targetNode.current.getAbsolutePosition());
    }
  }

  useEffect(() => {
    if (stageRef.current !== null) {
      stageRef.current.on("mouseup touchend", onTouchEnd);
      stageRef.current.on("mousemove touchmove", onTouchMove);
    }
  }, [stageRef]);

  return (
    <Group ref={movGroup} x={x} y={y}>
      <Group ref={rotGroup} rotation={rotation}>
        <Group>
          {lineType !== "horizontal" && (
            <Group>
              <Line
                x={0}
                y={0}
                points={[0, 0, 0, 140]}
                stroke="black"
                strokeWidth={2}
              />
              <Line
                x={0}
                y={0}
                points={[0, 0, 0, -100]}
                stroke="black"
                strokeWidth={2}
              />
            </Group>
          )}
          {lineType !== "vertical" && (
            <Group>
              <Line
                x={0}
                y={0}
                points={[0, 0, 120, 0]}
                stroke="black"
                strokeWidth={2}
              />
              <Line
                x={0}
                y={0}
                points={[0, 0, -120, 0]}
                stroke="black"
                strokeWidth={2}
              />
            </Group>
          )}
        </Group>
        <Group
          onMouseDown={() => {
            if (dragable.current === false) {
              rotable.current = true;
              onTouchStart();
            }
          }}
          onTouchStart={() => {
            if (dragable.current === false) {
              rotable.current = true;
              onTouchStart();
            }
          }}
        >
          {lineType !== "horizontal" && (
            <Group>
              <Line
                points={[0, 0, 10, -30, -10, -30]}
                x={0}
                y={140}
                closed={true}
                fill="black"
                stroke="black"
                strokeWidth={2}
                onMouseDown={onTouchObjectStart}
                onTouchStart={onTouchObjectStart}
              />
              <Line
                points={[0, 0, 10, 30, -10, 30]}
                x={0}
                y={-100}
                closed={true}
                fill="black"
                stroke="black"
                strokeWidth={2}
                onMouseDown={onTouchObjectStart}
                onTouchStart={onTouchObjectStart}
              />
            </Group>
          )}
          {lineType !== "vertical" && (
            <Group>
              <Line
                points={[0, 0, -30, 10, -30, -10]}
                x={120}
                y={0}
                closed={true}
                fill="black"
                stroke="black"
                strokeWidth={2}
                onMouseDown={onTouchObjectStart}
                onTouchStart={onTouchObjectStart}
              />
              <Line
                points={[0, 0, 30, 10, 30, -10]}
                x={-120}
                y={0}
                closed={true}
                fill="black"
                stroke="black"
                strokeWidth={2}
                onMouseDown={onTouchObjectStart}
                onTouchStart={onTouchObjectStart}
              />
            </Group>
          )}
        </Group>
        <Group
          onMouseDown={(evt: KonvaEventObject<MouseEvent>) => {
            if (rotable.current === false) {
              dragable.current = true;
              onTouchStart();
              onTouchObjectStart(evt);
            }
          }}
          onTouchStart={(evt: KonvaEventObject<TouchEvent>) => {
            if (rotable.current === false) {
              dragable.current = true;
              onTouchStart();
              onTouchObjectStart(evt);
            }
          }}
        >
          <Arc
            x={0}
            y={0}
            angle={90}
            innerRadius={0}
            outerRadius={15}
            fill="black"
            stroke="black"
            strokeWidth={2}
            rotation={0}
          />
          <Arc
            x={0}
            y={0}
            angle={90}
            innerRadius={0}
            outerRadius={15}
            fill="black"
            stroke="black"
            strokeWidth={2}
            rotation={180}
          />
          <Arc
            x={0}
            y={0}
            angle={90}
            innerRadius={0}
            outerRadius={15}
            fill="white"
            stroke="black"
            strokeWidth={2}
            rotation={90}
          />
          <Arc
            x={0}
            y={0}
            angle={90}
            innerRadius={0}
            outerRadius={15}
            fill="white"
            stroke="black"
            strokeWidth={2}
            rotation={270}
          />
        </Group>
      </Group>
      <Text
        ref={text}
        x={30}
        text={rotation.toFixed(2).toString()}
        fontSize={20}
        shadowEnabled={true}
        shadowColor="white"
        shadowBlur={4}
        shadowOpacity={1}
      />
    </Group>
  );
};

export default CrossLineProtractor;
