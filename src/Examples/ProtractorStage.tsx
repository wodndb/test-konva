import { Image, Layer, Stage } from "react-konva";
import useImage from "use-image";
import Protractor from "./Protractor";
import imageurl from "../resources/sample.jpg";

const ProtractorStage: React.VFC = () => {
  const p1 = { x: 100, y: 50 };
  const p2 = { x: 200, y: 100 };
  const p3 = { x: 300, y: 50 };

  const onChangeAngle = (angle: number) => {
    //console.log(angle);
  };

  const BackgroundImage: React.FC<{ url: string }> = ({ url }) => {
    const [image] = useImage(url);
    return <Image image={image} scaleX={0.2} scaleY={0.2} />;
  };

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <BackgroundImage url={imageurl} />
      </Layer>
      <Protractor p1={p1} p2={p2} p3={p3} onChangeAngle={onChangeAngle} />
    </Stage>
  );
};

export default ProtractorStage;
