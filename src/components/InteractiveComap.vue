<template>
  {{toggled}}tog
  <div class="map-container">
    <svg ref="canvas" class="map" preserveAspectRatio="xMinYMin">
      <link-component
        v-for="conn in activeConnections"
        :key="conn.source + conn.target"
        :source="getComponent(conn, 'source')"
        :target="getComponent(conn, 'target')"
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
import { ref, computed } from 'vue';
import MapNodeComponent from './MapNode.vue';
import LinkComponent from './LinkComponent.vue';

const emit = defineEmits<{
  (e: 'interaction', interaction: Interaction): void,
}>();

const props = defineProps<{
  nodes: MapNode[],
  connections: Connection[],
  toggled: string[],
}>();

const nodeComponents = ref([]);

const activeNodes = computed(() => { 
  return props.nodes.filter((el) => {
    return props.toggled.includes(el.toggler);
  })
});

const activeConnections = computed(() => {
  return props.connections.filter((conn) => {
    return activeNodes.value.find((node) => conn.source === node.title) &&
      activeNodes.value.find((node) => conn.target === node.title) && 
      nodeComponents.value.find((nodeComp : NodeComponent) => 
      nodeComp.node.title == conn.target || nodeComp.node.title == conn.source);
  })
});

const getNodeConnections = (node : MapNode) => {
  return activeConnections.value.filter((conn) => {
    return conn.target === node.title || conn.source === node.title;
  });
}
const getComponent = (conn : Connection, field : 'source' | 'target') => {
  return nodeComponents.value.find((nodeComp : NodeComponent) => {
    return nodeComp.node.title === conn[field];
  });
}

const emitInteraction = (data : Interaction) => {
  console.log(data);
  emit('interaction', data);
};
</script>


<style scoped>
.map-container, .map {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
