import Konva from "konva";
import { IFrame } from "konva/lib/types";
import { useEffect, useRef } from "react";
import { Circle, Layer, Stage, Star } from "react-konva";

type StarAnimType = {
  lastRotation: number;
  angularVelocity: number;
  controlled: boolean;
};

function animate(star: Konva.Star, frame: IFrame, starAnim: StarAnimType) {
  // 20% slow down per second
  var angularFriction = 0.2;
  var angularVelocityChange =
    (starAnim.angularVelocity * frame.timeDiff * (1 - angularFriction)) / 1000;
  starAnim.angularVelocity -= angularVelocityChange;

  if (starAnim.controlled) {
    starAnim.angularVelocity =
      ((star.rotation() - starAnim.lastRotation) * 1000) / frame.timeDiff;
  } else {
    star.rotate((frame.timeDiff * starAnim.angularVelocity) / 1000);
  }

  starAnim.lastRotation = star.rotation();
}

type KonvaStarProps = {
  starRef: React.RefObject<Konva.Star>;
  onTouchStart: () => void;
};

const KonvaStar: React.VFC<KonvaStarProps> = ({ starRef, onTouchStart }) => {
  return (
    <Star
      ref={starRef}
      x={window.innerWidth / 2}
      y={window.innerHeight / 2}
      outerRadius={80}
      innerRadius={40}
      stroke="#005500"
      fill="#b5ff88"
      strokeWidth={4}
      numPoints={5}
      lineJoin="round"
      shadowOffsetX={5}
      shadowOffsetY={5}
      shadowBlur={10}
      shadowColor="black"
      shadowOpacity={0.5}
      opacity={0.8}
      onMouseDown={onTouchStart}
      onTouchStart={onTouchStart}
    />
  );
};

const KonvaCircle = () => {
  return (
    <Circle
      x={window.innerWidth / 2}
      y={window.innerHeight / 2}
      radius={3}
      fill="#555"
    />
  );
};

const KonvaStarSpinner: React.VFC = () => {
  Konva.angleDeg = false;

  const starAnim = useRef<StarAnimType>({
    angularVelocity: 6,
    lastRotation: 0,
    controlled: false,
  });

  const star = useRef<Konva.Star>(null);
  const stage = useRef<Konva.Stage>(null);
  const layer = useRef<Konva.Layer>(null);

  useEffect(() => {
    console.log("useEffect");
    if (
      star.current === null ||
      layer.current === null ||
      starAnim.current === null
    )
      return;
    const anim = new Konva.Animation(function (frame) {
      if (
        star.current !== null &&
        layer.current !== null &&
        starAnim.current !== null &&
        frame !== undefined
      )
        animate(star.current, frame, starAnim.current);
    }, layer.current);

    setTimeout(function () {
      anim.start();
    });
  }, [star, layer, starAnim]);

  const onStarTouchStart = () => {
    console.log("star touch start");
    starAnim.current = {
      ...starAnim.current,
      controlled: true,
      angularVelocity: 0,
    };
  };

  const onStageTouchEnd = () => {
    console.log("star touch end");
    starAnim.current = { ...starAnim.current, controlled: false };
  };

  const onStageTouchMove = () => {
    if (star.current === null || stage.current === null) return;

    if (starAnim.current.controlled) {
      var mousePos = stage.current.getPointerPosition();
      if (mousePos === null) return;

      var starPos = star.current.getPosition();
      var x = starPos.x - mousePos.x;
      var y = starPos.y - mousePos.y;
      star.current.setAttr("rotation", 0.5 * Math.PI + Math.atan(y / x));

      if (mousePos.x <= stage.current.width() / 2) {
        star.current.rotate(Math.PI);
      }
    }
  };

  return (
    <Stage
      ref={stage}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseUp={onStageTouchEnd}
      onTouchEnd={onStageTouchEnd}
      onMouseMove={onStageTouchMove}
      onTouchMove={onStageTouchMove}
    >
      <Layer ref={layer}>
        <KonvaStar starRef={star} onTouchStart={onStarTouchStart} />
        <KonvaCircle />
      </Layer>
    </Stage>
  );
};

export default KonvaStarSpinner;
