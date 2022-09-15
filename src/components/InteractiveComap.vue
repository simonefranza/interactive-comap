<template>
  <div class="map-container">
    <svg ref="canvas" class="map" preserveAspectRatio="xMinYMin">
      <map-node 
        v-for="node in nodes" 
        :key="node.title"
        :title="node.title"
        :description="node.description"
        :toggler="node.toggler"
      ></map-node>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue';
import MapNode from './MapNode.vue';

interface Node {
  title: string,
  description: string,
  toggler: string,
  nx: number,
  ny: number,
}
interface Connection {
  source: string,
  target: string,
}

const props = defineProps<{
  nodes: Node[],
  connections: Connection[],
  toggled: string[],
}>();
</script>


<style scoped>
.map-container, .map {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
