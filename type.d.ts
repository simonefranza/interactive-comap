type Events = {
  click: undefined,
};

type ZoomPanEvents = {
  zoomPanInteraction: Interaction,
};

type MapNode = {
  title: string,
  description: string,
  toggler: string,
  nx: number,
  ny: number,
  mx?: number,
  my?: number,
};

type Connection = {
  source: string,
  target: string,
};

type NodeComponent = {
  node : MapNode,
  nodeContainer : import('src/components/MapNode.vue'),
}

type ScreenPosition = {
  x: number,
  y: number,
};

type NodeSize = {
  width: number,
  height: number,
}

type Interaction = {
  type: string,
  node?: string,
  data?: string,
}
