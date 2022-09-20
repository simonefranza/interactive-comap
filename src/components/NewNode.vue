<template>
  <span class="title">New Node</span>
  <div class="form-row">
    <span>Title</span>
    <input type="text" v-model="title" />
  </div>
  <div class="form-row">
    <span>Description</span>
    <input type="text" v-model="description" />
  </div>
  <div class="form-row">
    <span>Toggler</span>
    <input type="text" v-model="toggler" />
    <span>or</span>
    <select v-model="selectedToggler">
      <option v-for="toggler in togglers" 
          :key="toggler" 
          :value="toggler"
        >{{toggler}}</option>
    </select>
  </div>
  <button 
    class="btn floaty" 
    @click="addNode">
    Add Node
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  togglers: string[],
}>();

const emit = defineEmits<{
  (e: 'newNode', node: MapNode):void,
}>();

const title = ref('');
const description = ref('');
const toggler = ref('');
const selectedToggler = ref('');

function addNode() {
  if (title.value.trim() === '') {
    throw "Title cannot be emtpy";
  }
  const node = {
    title: title.value.trim(), 
    description: description.value.trim(),
    toggler: '',
    nx: 0,
    ny: 0
  };
  if (toggler.value !== '') {
    node.toggler = toggler.value.trim();
  } else {
    node.toggler = selectedToggler.value;
  }
  emit('newNode', node);
  title.value = '';
  description.value = '';
  selectedToggler.value = '';
  toggler.value = '';
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
