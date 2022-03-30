import Konva from "konva"
import { useEffect, useRef } from "react"
import { Group, Image, Line, Rect } from "react-konva"

type MagnifierProps = {
  bgImage?: CanvasImageSource
  scale: number
}

const Magnifier: React.FC<MagnifierProps> = ({bgImage, scale, ...props}) => {
  const group = useRef<Konva.Group>(null);
  const image = useRef<Konva.Image>(null);
  const movable = useRef<boolean>(false);

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
    const stage = group.current?.getStage();
    if(stage === null || stage === undefined) return;
    var pos = stage.getPointerPosition();
    if (pos === undefined || pos === null || !movable.current) return;

    group.current?.setPosition(pos);
    image.current?.setPosition({
      x: -pos.x * scale + 90 - scale,
      y: -pos.y * scale + 90 - scale,
    });
  }

  useEffect(() => {
    const stage = group.current?.getStage();
    if(stage === null || stage === undefined) return;

    stage.on("mousedown touchstart", OnTouchStart);
    stage.on("mouseup touchend", OnTouchEnd);
    stage.on("mousemove touchmove", OnTouchMove);
  }, [group.current, scale])

  return (
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
    <Rect x={40} y={40} width={100} height={100} fill="white"/>
    <Image ref={image} image={bgImage} scaleX={scale} scaleY={scale} />
    <Rect x={40} y={40} width={100} height={100} stroke="grey" strokeWidth={5}/>
    <Line x={90} y={90} points={[-5, 0, 5, 0]} stroke="red"/>
    <Line x={90} y={90} points={[0, -5, 0, 5]} stroke="red"/>
  </Group>
  )
}

export default Magnifier;