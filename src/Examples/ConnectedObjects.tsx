import Konva from "konva";
import { KonvaEventObject } from "konva/lib/Node";
import { useEffect, useRef } from "react";
import { Circle, Layer, Line, Stage, Text } from "react-konva";

type targetType = {
  id?: string;
  x: number;
  y: number;
};

// function to generate a list of "targets" (circles)
const generateTargets = (): targetType[] => {
  return [...Array(10)].map((_, i) => ({
    id: 'target-'+i.toString(),
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    rotation: Math.random() * 180,
    isDragging: false,
  }));
};

type connectorType = {
  id: string;
  from: string;
  to: string;
};

// function to generate arrows between targets
const generateConnectors = (targets: targetType[]): connectorType[] => {
  var number = 10;
  var result = [];
  while (result.length < number) {
    var from = Math.floor(Math.random() * targets.length).toString();
    var to = Math.floor(Math.random() * targets.length).toString();
    if (from === to) {
      continue;
    }
    result.push({
      id: 'connector-'+result.length.toString(),
      from: 'target-'+from,
      to: 'target-'+to,
    });
  }
  return result;
};

const getConnectorsPoints = (from: targetType, to: targetType): number[] => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  let angle = Math.atan2(-dy, dx);

  const radius = 50;

  return [
    from.x + -radius * Math.cos(angle + Math.PI),
    from.y + radius * Math.sin(angle + Math.PI),
    to.x + -radius * Math.cos(angle),
    to.y + radius * Math.sin(angle),
  ];
};

// update all objects on the canvas from the state of the app
function updateObjects(
  stage: Konva.Stage,
  targets: targetType[],
  connectors: connectorType[]
) {
  const layer = stage?.findOne(".main-layer").getLayer();

  if (layer === undefined || layer === null) return;

  // targets.forEach((target) => {
  //   var node = layer.findOne("#" + target.id) as Konva.Circle;
  //   node.setPosition(target);
  // });
  connectors.forEach((connect) => {
    var line = layer.findOne("#" + connect.id) as Konva.Line;
    var fromNode = layer.findOne("#" + connect.from) as Konva.Circle;
    var toNode = layer.findOne("#" + connect.to) as Konva.Circle;

    const points = getConnectorsPoints(fromNode.position(), toNode.position());
    line.setAttr("points", points);
  });
}

const ConnectedObjects: React.VFC = () => {
  const targets = generateTargets();
  const connectors = generateConnectors(targets);
  const stage = useRef<Konva.Stage>(null);

  // 컴포넌트 시작할 때 선 그리기 초기화 용도
  useEffect(() => {
    if (stage.current != null)
      updateObjects(stage.current, targets, connectors);
  }, [stage.current]);

  return (
    <Stage width={window.innerWidth} height={window.innerHeight} ref={stage}>
      <Layer name="main-layer">
        <Text text="Hi" />
        {targets.map((target) => {
          return (
            <Circle
              key={target.id}
              id={target.id}
              x={target.x}
              y={target.y}
              radius={20 + Math.random() * 20}
              draggable={true}
              onDragMove={
                (e) => {
                  const stage = e.target.getStage();
                  if(stage !== null) {
                    updateObjects(stage, targets, connectors);
                  }
                }
              }
              fill="#89b717"
            />
          );
        })}
        {connectors.map((connector) => {
          return <Line stroke='black' id={connector.id} fill='black' strokeWidth={2}/>;
        })}
      </Layer>
    </Stage>
  );
};

export default ConnectedObjects;
