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
      />
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
import InteractiveComap from './components/InteractiveComap.vue';
import ToolbarComponent from './components/ToolbarComponent.vue';
import { nodes, connections, toggled } from '../public/data';

const interactions : string[] = reactive([]);
const toggledCopy = ref([...toggled]);
const usedNodes = ref([...nodes]);
const usedConnections = ref([...connections]);

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
  grid-template-areas: "toolbar" "map" "interactions";
  grid-template-rows: 200px 1fr 150px;
  grid-template-columns: 1fr;
}
.toolbar-container {
  grid-area: toolbar;
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
  outline: 1px solid #eee;
  border-radius:1rem;
  margin: 1rem;
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
</style>
<style lang="scss">
.map-node {
  position: static;
  box-sizing: border-box;
  font-family: monospace;
  display: inline-block;
  color: #eee;
  pointer-events: none;
  border-radius: 1rem;
  background: lightgoldenrodyellow;
  padding-block: 0.5rem;
  padding-inline: 1.2rem;
  max-width: 300px;
  outline: 1px solid palevioletred;
}
.map-node.old{
  background-image: linear-gradient(133deg, darkviolet, #5f0b83);
}
.map-node.clicked {
  background-image: linear-gradient(73deg, darkviolet, #5f0b83);
  outline: 1px solid darkviolet;
}
.node-title.clicked {
  font-weight: bold;
  text-transform: uppercase;
}
.node-description {
  text-align: left;
}
.node-link {
  stroke: purple;
  stroke-width: 10px;
  fill: lightsteelblue;
}

</style>
