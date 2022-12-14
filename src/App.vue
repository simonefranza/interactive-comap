<template>
  <div class="container">
    <span class="toolbar-container">
      <toolbar-component 
        :possibleToggles="possibleToggles"
        :selectedToggles="toggledCopy"
        :nodes="usedNodes"
        :connections="usedConnections"
        @togglesChanged="updateToggles"
        @newData="updateData"
        @downloadFile="downloadFile"
        @removeNode="removeNode"
        @addNode="addNode"
        @removeConnection="removeConnection"
        @addConnection="addConnection"
      ></toolbar-component>
    </span>
    <span class="comap-container">
      <interactive-comap
        :nodes="usedNodes" 
        :connections="usedConnections" 
        :toggled="toggledCopy"
        :nodeStyle="'default'"
        @interaction="handleInteraction"
        ref="intCoMap"
      />
      <button class="btn floaty reset-btn" @click="resetNodes">Reset Position</button>
    </span>
    <div class="interactions-container">
      <div class="interactions-title">Interactions</div>
      <p v-html="formattedInteractions">
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue';
//import InteractiveComap from '../lib/InteractiveComap.vue';
import { InteractiveComap } from 'vue-interactive-comap';
//import 'interactive-comap/dist/style.css';
import ToolbarComponent from './components/ToolbarComponent.vue';
import { nodes, connections, toggled } from '../public/data';

const interactions : string[] = reactive([]);
const toggledCopy = ref([...toggled]);
const usedNodes = ref([...nodes]);
const usedConnections = ref([...connections]);
const intCoMap = ref();

const handleInteraction = ({type, node, data} : Interaction) => {
  const date = new Date().toLocaleDateString("de-AT", 
    {hour:"numeric", minute:"numeric", second:"numeric"});
  interactions.push(`${date} - [${type}${node ? ':' + node : ''}]${data ? ": " + data : ''}`);
}

const possibleToggles = ref<string[]>([]);


const formattedInteractions = computed(() => {
  return interactions.join('<br />');
});

const parseToggles = (nodes : MapNode[]) => {
  possibleToggles.value.splice(0, possibleToggles.value.length);
  nodes.forEach((node) => {
    if (possibleToggles.value.includes(node.toggler)) {
      return;
    }
    possibleToggles.value.push(node.toggler);
  });
}

const updateToggles = (data : string[]) => {
  toggledCopy.value.splice(0, toggledCopy.value.length);
  toggledCopy.value.push(...data);
};

const updateData = (data: UserData) => {
  usedNodes.value = data.nodes;
  usedConnections.value = data.connections;
};

function downloadFile() {
  const data = { nodes: [...usedNodes.value], connections: [...usedConnections.value]};
  const htmlNodes = document.querySelectorAll('.map-node-container');
  htmlNodes.forEach((el) => {
    const title = el.querySelector('.node-title')?.innerHTML;
    const node = data.nodes.find((node) => node.title === title);
    if (node === undefined) {
      throw "Node is undefined";
    }
    const x = el.getAttribute('x');
    const y = el.getAttribute('y');
    if (x === null || y === null) {
      throw "x or y attribute is null";
    }
    node.nx = parseFloat(x);
    node.ny = parseFloat(y);
  });

  const blob = new Blob([JSON.stringify(data, null, 2)]);
  const link = document.createElement("a");
  link.style.display = "none";
  link.href = window.URL.createObjectURL(blob);
  link.download = 'data.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function removeNode(node: MapNode) {
  const idx = usedNodes.value.findIndex((el) => el.title === node.title);
  usedNodes.value.splice(idx, 1);
  for (let i = usedConnections.value.length - 1; i >=0; i--) {
    if (usedConnections.value[i].source === node.title || 
        usedConnections.value[i].target === node.title) {
      usedConnections.value.splice(i, 1);
    }
  }
  parseToggles(usedNodes.value);
}

function addNode(node: MapNode) {
  usedNodes.value.push(node);
  parseToggles(usedNodes.value);
}

function removeConnection(conn: Connection) {
  const idx = usedConnections.value.findIndex((el) => 
    el.source === conn.source && el.target === conn.target);
  usedConnections.value.splice(idx, 1);
}

function addConnection(conn: Connection) {
  usedConnections.value.push(conn);
}

const resetNodes = () => {
  console.log(intCoMap.value);
  intCoMap.value.resetNodes();
}

watch(usedNodes, () => {
  parseToggles(usedNodes.value);
});
onMounted(() => {
  parseToggles(nodes);
});
</script>

<style lang="scss">
body, #app {
  height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
  position: relative;
}
.container {
  height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-areas: "toolbar toolbar" "map interactions";
  grid-template-rows: 230px 1fr;
  grid-template-columns: 3fr 1fr;
}
.toolbar-container {
  grid-area: toolbar;
  max-width: 100vw;
  overflow: scroll;
  scroll-behavior: smooth;
}
.interactions-container {
  border-radius: 1rem;
  grid-area: interactions;
  background: #eee;
  color: #000;
  overflow: scroll;
  margin: 1rem;
  padding-inline: 0.5rem;
  & p {
    text-align: left;
    max-height: 100%;
  }
}
.comap-container {
  grid-area: map;
  border: 1px solid #eee;
  border-radius:1rem;
  margin: 1rem;
  position: relative;
}
.interactions-title {
  background: #eee;
  text-transform: capitalize;
  font-weight: bold;
  position: sticky;
  font-size: 1.5rem;
  padding-block: 0.5rem;
  top: 0;
}

.reset-btn {
  z-index: 20000;
}
</style>
