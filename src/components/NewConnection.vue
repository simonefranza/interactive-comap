<template>
  <span class="title">New Connection</span>
  <div class="form-row">
    <span>Source</span>
    <select v-model="selectedSource">
      <option v-for="node in nodes" 
          :key="node.title" 
          :value="node.title"
        >{{node.title}}</option>
    </select>
  </div>
  <div class="form-row">
    <span>Target</span>
    <select v-model="selectedTarget">
      <option v-for="node in nodes" 
          :key="node.title" 
          :value="node.title"
        >{{node.title}}</option>
    </select>
  </div>
  <button 
    class="btn floaty" 
    @click="addConnection" 
    :disabled="disabledButton">
    Add Connection
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  nodes: MapNode[],
}>();

const emit = defineEmits<{
  (e: 'newConnection', conn: Connection):void,
}>();

const selectedSource = ref<string>();
const selectedTarget = ref<string>();

const disabledButton = computed(() => {
  return selectedTarget.value === undefined || selectedSource.value === undefined;
});

function addConnection() {
  if (disabledButton.value) {
    return;
  }
  emit('newConnection', {
    source: selectedSource.value as string, 
    target: selectedTarget.value as string
  });
  selectedSource.value = undefined;
  selectedTarget.value = undefined;
}
</script>

<style lang="scss" scoped>
.form-row {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.title {
  text-align: center;
}

</style>
<style lang="scss">
.btn {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  &.floaty {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translate(-50%, 0);
  }
}
</style>
