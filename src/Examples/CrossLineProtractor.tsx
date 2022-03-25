import Konva from "konva";
import { Vector2d } from "konva/lib/types";
import { useEffect, useRef } from "react";
import { Arc, Arrow, Group, Text } from "react-konva";
import { createSecureContext } from "tls";

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
          text.current.setAttr('text', rotGroup.current.rotation().toFixed(2));
        }

        if (dragable.current) {
          movGroup.current.setPosition(position);
        }

        prevPointCoord.current = movePosition;
        console.log(prevPointCoord.current);
      }
    }
  };

  useEffect(() => {
    if (stageRef.current !== null) {
      stageRef.current.on("mouseup touchend", onTouchEnd);
      stageRef.current.on("mousemove ontouchmove", onTouchMove);
    }
  }, [stageRef]);

  return (
    <Group ref={movGroup} x={x} y={y} >
      <Group ref={rotGroup} rotation={rotation}>
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
              <Arrow
                x={0}
                y={0}
                points={[0, 0, 0, 140]}
                pointerLength={20}
                pointerWidth={15}
                fill="black"
                stroke="black"
                strokeWidth={2}
              />
              <Arrow
                x={0}
                y={0}
                points={[0, 0, 0, -100]}
                pointerLength={20}
                pointerWidth={15}
                fill="black"
                stroke="black"
                strokeWidth={2}
              />
            </Group>
          )}
          {lineType !== "vertical" && (
            <Group>
              <Arrow
                x={0}
                y={0}
                points={[0, 0, 120, 0]}
                pointerLength={20}
                pointerWidth={15}
                fill="black"
                stroke="black"
                strokeWidth={2}
              />
              <Arrow
                x={0}
                y={0}
                points={[0, 0, -120, 0]}
                pointerLength={20}
                pointerWidth={15}
                fill="black"
                stroke="black"
                strokeWidth={2}
              />
            </Group>
          )}
        </Group>
        <Group
          onMouseDown={() => {
            if (rotable.current === false) {
              dragable.current = true;
              onTouchStart();
            }
          }}
          onTouchStart={() => {
            if (rotable.current === false) {
              dragable.current = true;
              onTouchStart();
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
        shadowColor='white'
        shadowBlur={4}
        shadowOpacity={1} />
    </Group>
  );
};

export default CrossLineProtractor;
