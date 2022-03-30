import Konva from "konva";
import { useCallback, useEffect, useRef } from "react";
import { Group, Image, Line, Rect } from "react-konva";

type PointerMagnifierProps = {
  bgImage?: CanvasImageSource;
  scale: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

const PointerMagnifier: React.FC<PointerMagnifierProps> = ({
  bgImage,
  scale,
  x,
  y,
  width,
  height,
  ...props
}) => {
  const group = useRef<Konva.Group>(null);
  const image = useRef<Konva.Image>(null);
  const movable = useRef<boolean>(false);

  const UpdatePos = useCallback(() => {
    const stage = group.current?.getStage();
    if (stage === null || stage === undefined) return;
    var pos = stage.getPointerPosition();
    if (pos === undefined || pos === null || !movable.current) return;

    group.current?.setPosition(pos);
    image.current?.setPosition({
      x: -pos.x * scale + (width / 2 + x) - scale,
      y: -pos.y * scale + (height / 2 + y) - scale,
    });
  }, [scale, x, y, width, height]);

  const OnTouchStart = useCallback(() => {
    movable.current = true;
    group.current?.show();

    UpdatePos();
  }, [UpdatePos]);

  const OnTouchEnd = useCallback(() => {
    group.current?.hide();
    movable.current = false;
  }, []);

  const OnTouchMove = useCallback(() => {
    UpdatePos();
  }, [UpdatePos]);

  useEffect(() => {
    const stage = group.current?.getStage();
    if (stage === null || stage === undefined) return;

    stage.on("mousedown touchstart", OnTouchStart);
    stage.on("mouseup touchend", OnTouchEnd);
    stage.on("mousemove touchmove", OnTouchMove);
  }, [OnTouchStart, OnTouchEnd, OnTouchMove]);

  return (
    <Group
      ref={group}
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
      <Image ref={image} image={bgImage} scaleX={scale} scaleY={scale} />
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

export default PointerMagnifier;
