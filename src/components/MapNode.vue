<template>
  <foreignObject 
    ref="nodeContainer" 
    class="map-node-container">
    <div 
      ref="nodeDiv"
      :class="['map-node', {'clicked' : clicked}, {'old' : old}]">
      <span>
        <div :class="['node-title', {'clicked' : clicked}]">{{node.title}}</div>
        <div class="node-description" v-if="clicked">{{node.description}}
        </div>
      </span>
    </div>
  </foreignObject>
</template>

<script setup lang="ts">
import {ref, onMounted, nextTick} from 'vue';
import * as Utils from '../lib/utils';
import { NodeMovement }from '../lib/NodeMovement';
import mitt from 'mitt';

const emitter = mitt<Events>();
emitter.on('click', changeClicked);
const emit = defineEmits<{
  (e: 'interaction', interaction: Interaction): void,
}>();

const props = defineProps<{
  node: MapNode,
  connections: Connection[],
}>();

let clicked = ref(false);
let old = ref(false);
const nodeContainer = ref<InstanceType<typeof SVGForeignObjectElement>>();
const nodeDiv = ref<InstanceType<typeof HTMLElement>>();
let canvas : HTMLElement;

async function changeClicked() {
  clicked.value = !clicked.value;
  await nextTick();
  let viewBox = canvas.getAttribute("viewBox");
  if (viewBox === undefined || viewBox === null) {
    throw "[MapNode:changeClicked] viewBox is undefined or null";
  }
  if (nodeContainer.value === undefined) {
    throw "[MapNode:changeClicked] nodeContainer.value is undefined";
  }
  const viewBoxSplit = viewBox.split(" ")
    .map((el : string) => parseFloat(el)) as [number, number, number, number];
  const bounding = canvas.getBoundingClientRect();
  const prevSize : NodeSize = {
    width: parseFloat(nodeContainer.value.getAttribute("width") as string),
    height: parseFloat(nodeContainer.value.getAttribute("height") as string),
  };
  setSvgSize(viewBoxSplit, bounding);
  const currentSize : NodeSize = {
    width: parseFloat(nodeContainer.value.getAttribute("width") as string),
    height: parseFloat(nodeContainer.value.getAttribute("height") as string),
  };
  centerSvg(prevSize, currentSize, viewBoxSplit, bounding);
  emit('interaction', {
    type: clicked.value === true ? 'openedNode' : 'closedNode', 
    node: props.node.title
  });
  old.value = true;
};

let movementHandler : NodeMovement;

const setSvgSize = (viewBoxSplit : [number, number, number, number], bounding : DOMRect) => {
  if (nodeContainer.value === undefined) {
    throw "[MapNode:onMounted] nodeContainer.value is or undefined";
  }
  if (nodeDiv.value === undefined) {
    throw "nodeDiv is undefined";
  }

  nodeContainer.value.style.height = "100%";
  nodeContainer.value.style.width = "100%";
  const divBounding = nodeDiv.value.getBoundingClientRect();
  const [ width, height ] = Utils.convertPixelDistanceToUnit(viewBoxSplit,
    bounding,
    [ divBounding.width, divBounding.height ]);
  nodeContainer.value.setAttribute("width", `${width + 4}`);
  nodeContainer.value.setAttribute("height", `${height + 4}`);
  nodeContainer.value.style.height = "";
  nodeContainer.value.style.width = "";
};

const centerSvg = (prevSize : NodeSize, currentSize : NodeSize,
  viewBoxSplit : [number, number, number, number], bounding : DOMRect) => {
  const nodeX = parseFloat(nodeContainer.value?.getAttribute('x') as string);
  const nodeY = parseFloat(nodeContainer.value?.getAttribute('y') as string);
  const newX = nodeX - (currentSize.width - prevSize.width) / 2;
  const newY = nodeY - (currentSize.height - prevSize.height) / 2;
  nodeContainer.value?.setAttribute('x', newX.toString());
  nodeContainer.value?.setAttribute('y', newY.toString());
};

const setSvgPosition = (viewBoxSplit : [number, number, number, number], bounding : DOMRect) => {
  if (nodeContainer.value === undefined) {
    throw "[MapNode:onMounted] nodeContainer.value is or undefined";
  }
  const [ x, y ] = Utils.convertPixelToUnit(
    viewBoxSplit,
    bounding,
    props.node.nx,
    props.node.ny 
  );
  const position = {x, y};
  nodeContainer.value.setAttribute("x", `${props.node.nx}`);
  nodeContainer.value.setAttribute("y", `${props.node.ny}`);
}

const emitInteraction = (int : Interaction) => {
  int.node = props.node.title;
  emit('interaction', int);
};

defineExpose({
  nodeContainer,
  node: props.node,
});

onMounted(() => {
  const tempCanvas = nodeContainer.value?.parentElement;
  if (tempCanvas === null || tempCanvas === undefined) {
    throw "[MapNode:onMounted] tempCanvas is null or undefined";
  }
  canvas = tempCanvas;
  let viewBox = canvas.getAttribute("viewBox");
  if (viewBox === undefined || viewBox === null) {
    const size = canvas.getBoundingClientRect();
    canvas.setAttribute('viewBox', `0 0 ${size?.width} ${size?.height}`);
    viewBox = `0 0 ${size?.width} ${size?.height}`;
  }
  const viewBoxSplit = viewBox.split(" ")
    .map((el : string) => parseFloat(el)) as [number, number, number, number];
  const bounding = canvas.getBoundingClientRect();
  setSvgSize(viewBoxSplit, bounding);
  setSvgPosition(viewBoxSplit, bounding);
  movementHandler = new NodeMovement(canvas, nodeContainer.value!, emitter, emitInteraction);

});
</script>
  
<style lang="scss" scoped>
.map-node-container {
  position: absolute;
  top: 0;
  left: 0;
  padding: 2px;
  user-select: none;
  overflow: visible;
  cursor: pointer;
}
</style>
