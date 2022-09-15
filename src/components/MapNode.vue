<template>
  <foreignObject 
    ref="nodeContainer" 
    @click="clicked = !clicked" 
    class="map-node-container">
    <div 
      ref="nodeDiv"
      class="map-node">
    <span>
      <div class="node-title">{{title}}</div>
      <div class="node-description" v-if="clicked">{{description}}</div>
    </span>
    </div>
  </foreignObject>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import * as Utils from '../utils';

const props = defineProps<{
  title: string,
  description: string,
  toggler: string,
}>();

let clicked = ref(false);
const nodeContainer = ref<InstanceType<typeof SVGForeignObjectElement>>();
const nodeDiv = ref<InstanceType<typeof HTMLElement>>();
let canvas : HTMLElement | undefined | null;

function changeClicked() {
  console.log("clicked");
  clicked.value = true;
};

onMounted(() => {
  canvas = nodeContainer.value?.parentElement;
  if (nodeContainer.value === undefined) {
    throw "nodeContainer is undefined";
  }
  if (nodeDiv.value === undefined) {
    throw "nodeDiv is undefined";
  }
  if (canvas === undefined || canvas === null) {
    throw "canvas is undefined or null";
  }
  let viewBox = canvas.getAttribute("viewBox");
  if (viewBox === undefined || viewBox === null) {
    const size = canvas.getBoundingClientRect();
    canvas.setAttribute('viewBox', `0 0 ${size?.width} ${size?.height}`);
    viewBox = `0 0 ${size?.width} ${size?.height}`;
  }
  const viewBoxSplit = viewBox.split(" ").map((el : string) => parseFloat(el));
  const bounding = canvas.getBoundingClientRect();

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
  const [ x, y ] = Utils.convertPixelToUnit(
    viewBoxSplit,
    bounding,
    0,
    0
  );
  const position = {x, y};
  nodeContainer.value.setAttribute("x", `${position.x}`);
  nodeContainer.value.setAttribute("y", `${position.y}`);

});
</script>
  
<style lang="scss">
.map-node-container {
  position: absolute;
  top: 0;
  left: 0;
  padding: 2px;
  user-select: none;
  overflow: visible;
}
.map-node {
  position: static;
  box-sizing: border-box;
  width: 220px;
  font-family: monospace;
  color: #eee;
  pointer-events: none;
  border-radius: 0.5rem;
  background: red;
}
</style>

<style lang="scss" scoped>
.node {
//  padding-block: 5px;
//  font-size: 0.5rem;
  //margin: 0;
  height: 100%;
  width: 100%;
}
</style>
