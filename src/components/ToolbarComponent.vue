<template>
  {{possibleToggles}}
  {{selectedToggles}}
  {{model}}
  <span v-for="tog, idx in possibleToggles" :key="tog">
    <input type="checkbox" value="tog" v-model="model[idx]">
    <label for="tog">{{tog}}</label>
  </span>
</template>

<script setup lang="ts">
import { reactive, onMounted, watch } from 'vue';
const props = defineProps<{
  possibleToggles: string[],
  selectedToggles: string[],
}>();

const emit = defineEmits<{
  (e: 'togglesChanged', ls: string[]): void,
}>();

let model : Boolean[] = reactive([]);

watch(props.possibleToggles, () => {
  console.log('avail', props.possibleToggles);
  model.splice(0, model.length);
  props.possibleToggles.forEach((tog) => {
    console.log("pos", tog);
    model.push(false);
  });
  console.log(model.length);
  props.selectedToggles.forEach((tog) => {
    console.log(props.possibleToggles.findIndex((el) => el === tog));
    model[props.possibleToggles.findIndex((el) => el === tog)] = true;
  });
  console.log(model.length);
});

watch(model, () => {
  const els : string[] = [];
  model.forEach((el, idx) => {
    if (!el) return;
    els.push(props.possibleToggles[idx]);
  });
  console.log('emitting', els);
  emit('togglesChanged', els);
});

onMounted(() => {
  console.log('mounted', props.selectedToggles);
  props.possibleToggles.forEach((tog) => {
    console.log("pos", tog);
    model.push(false);
  });
});
</script>
