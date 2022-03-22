import { Image, Layer, Stage } from "react-konva";
import useImage from "use-image";
import HorizontalProtractor from "./HorizontalProtractor";
import imageurl from "../resources/skeleton.png";

const HorizontalProtractorExample:React.VFC = () => {
  const p1 = {x: 120, y: 140}
  const p2 = {x: 240, y: 140}
  
  const p3 = {x: 120, y: 350}
  const p4 = {x: 240, y: 350}

  const p5 = {x: 120, y: 540}
  const p6 = {x: 240, y: 540}

  const BackgroundImage: React.FC<{ url: string }> = ({ url }) => {
    const [image] = useImage(url);
    return <Image image={image} scaleX={1} scaleY={1} />;
  };

  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <BackgroundImage url={imageurl} />
      </Layer>
      <HorizontalProtractor p1={p1} p2={p2}/>
      <HorizontalProtractor p1={p3} p2={p4}/>
      <HorizontalProtractor p1={p5} p2={p6}/>
    </Stage>
  )
}

export default HorizontalProtractorExample;