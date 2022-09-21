<template>
  <div class="map-container">
    <svg ref="canvas" class="map" preserveAspectRatio="xMinYMin">
      <link-component
        v-for="conn in activeConnections"
        :key="conn.source + conn.target"
        :source="getComponent(conn, 'source')"
        :target="getComponent(conn, 'target')"
        ref="links"
      >
      </link-component>
      <map-node-component
        v-for="node in activeNodes" 
        :key="node.title"
        :node="node"
        :connections="getNodeConnections(node)"
        @interaction="emitInteraction"
        ref="nodeComponents"
      ></map-node-component>
    </svg>
  </div>
</template>

<script setup lang="ts">
import {  onBeforeUnmount, ref, computed, onMounted, nextTick, reactive, watch } from 'vue';
import MapNodeComponent from './MapNode.vue';
import LinkComponent from './LinkComponent.vue';
import { ZoomPanManager } from '../lib/ZoomPanManager';
import { defaultStyle } from '../lib/defaultStyles';
import mitt, { Emitter } from 'mitt';

const emit = defineEmits<{
  (e: 'interaction', interaction: Interaction): void,
}>();

const props = defineProps<{
  nodes: MapNode[],
  connections: Connection[],
  toggled: string[],
  nodeStyle: 'custom' | 'default',
}>();

const emitter = mitt<ZoomPanEvents>();

const canvas = ref();
const nodeComponents = ref([]);
const links = ref([]);
let savedToggled : string[] = [];

let zoomPanManager : ZoomPanManager;

const activeNodes = computed(() => { 
  return props.nodes.filter((el) => {
    return props.toggled.includes(el.toggler);
  })
  //return list.value;
});

const activeConnections = computed(() => {
  const res = props.connections.filter((conn : Connection) => {
    return activeNodes.value.find((node) => conn.source === node.title) &&
      activeNodes.value.find((node) => conn.target === node.title) && 
      existsComponent(conn);
  })
  return res;
});

const getNodeConnections = (node : MapNode) => {
  return activeConnections.value.filter((conn) => {
    return conn.target === node.title || conn.source === node.title;
  });
}

const existsComponent = (conn : Connection) : Boolean => {
  return nodeComponents.value.find((nodeComp : NodeComponent) => {
    return nodeComp.node.title === conn.target;
  }) !== undefined && 
  nodeComponents.value.find((nodeComp : NodeComponent) => {
    return nodeComp.node.title === conn.source;
  }) !== undefined;
};


const getComponent = (conn : Connection, field : 'source' | 'target') => {
const res = nodeComponents.value.find((nodeComp : NodeComponent) => {
  return nodeComp.node.title === conn[field];
});
if (res === undefined) {
  throw `Could not find NodeComponent for connection ${conn.source}-${conn.target}`;
}
return res;
}

const emitInteraction = (data : Interaction) => {
  emit('interaction', data);
};

watch(props.toggled, () => {
  const added = props.toggled.filter(x => !savedToggled.includes(x));
  const removed = savedToggled.filter(x => !props.toggled.includes(x));
  savedToggled = [...props.toggled];
  if (added.length) {
    emit('interaction', {type:'addedToggle', data: JSON.stringify(added)});
  }
  if (removed.length) {
    emit('interaction', {type:'removedToggle', data: JSON.stringify(removed)});
  }

});


function addDefaultStyle() {
  const style = document.createElement('style');
  style.innerHTML = defaultStyle;
  document.head.appendChild(style);
}

onMounted(() => {
  zoomPanManager = new ZoomPanManager(canvas.value, emitter);
  emitter.on('zoomPanInteraction', emitInteraction);
  if (props.nodeStyle === 'default') {
    addDefaultStyle();
  }
});

onBeforeUnmount(() => {
  emitter.off('zoomPanInteraction', emitInteraction);
});
</script>


<style scoped>
.map-container, .map {
  width: 100%;
  height: 100%;
  position: relative;
}
.map-container {
  z-index: 100;
}
.map { 
  z-index: 1000;
}
</style>
