<template>
  <path ref="link" class="node-link" :d="path">
  </path>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive, onBeforeUnmount, watch } from 'vue';
import MapNodeComponent from './MapNode.vue';

const props = defineProps<{
  source: NodeComponent,
  target: NodeComponent,
}>();

const link = ref();

const sourcePos : ScreenPosition = reactive({ x : 0, y : 0, });
const targetPos : ScreenPosition = reactive({ x : 0, y : 0, });

const path = computed(() => {
  const start = {x: sourcePos.x, y: sourcePos.y};
  const end = {x: targetPos.x, y: targetPos.y};
  const midPoint = {x: (start.x + end.x) / 2, y: (start.y + end.y) / 2};
  const str = `M ${start.x} ${start.y} ` +
  //`Q ${start.x} ` + // for staight lines
  //`Q ${start.x + Math.abs(end.x - start.x) / 3} ` + // for curved lines
  `Q ${start.x + (end.x - start.x) / 3} ` +
  `${start.y}, ${midPoint.x} ${midPoint.y} ` + 
  `T ${end.x} ${end.y}`;
  return str;
});

const computePositions = () => {
  // TODO start always from nearest mid of edge?
  const sourceWidth = parseFloat(props.source?.nodeContainer.getAttribute('width'));
  const sourceHeight = parseFloat(props.source?.nodeContainer.getAttribute('height'));
  const targetWidth = parseFloat(props.target?.nodeContainer.getAttribute('width'));
  const targetHeight = parseFloat(props.target?.nodeContainer.getAttribute('height'));
  sourcePos.x = parseFloat(props.source?.nodeContainer.getAttribute('x')) + sourceWidth / 2;
  sourcePos.y = parseFloat(props.source?.nodeContainer.getAttribute('y')) + sourceHeight / 2;
  targetPos.x = parseFloat(props.target?.nodeContainer.getAttribute('x')) + targetWidth / 2;
  targetPos.y = parseFloat(props.target?.nodeContainer.getAttribute('y')) + targetHeight / 2;
};

const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.type === "attributes") {
      computePositions();
    }
  });
});
onMounted(() => {
  if (link.value === undefined || props.source === undefined || props.target === undefined) {
    return;
  }
  computePositions();

  observer.observe(props.source?.nodeContainer, {
    attributes: true //configure it to listen to attribute changes
  });
  observer.observe(props.target?.nodeContainer, {
    attributes: true //configure it to listen to attribute changes
  });
});

onBeforeUnmount(() => {
  observer.disconnect();
});
</script>

<style lang="scss" scoped>

</style>
