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
  model.splice(0, model.length);
  props.possibleToggles.forEach((tog) => {
    model.push(false);
  });
  props.selectedToggles.forEach((tog) => {
    model[props.possibleToggles.findIndex((el) => el === tog)] = true;
  });
});

watch(model, () => {
  const els : string[] = [];
  model.forEach((el, idx) => {
    if (!el) return;
    els.push(props.possibleToggles[idx]);
  });
  emit('togglesChanged', els);
});

onMounted(() => {
  props.possibleToggles.forEach((tog) => {
    model.push(false);
  });
});
</script>
