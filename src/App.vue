<template>
  <div class="container">
    <span class="toolbar-container">
      <toolbar-component 
        :possibleToggles="possibleToggles"
        :selectedToggles="toggled"
        @togglesChanged="updateToggles"
      ></toolbar-component>
    </span>
    <span class="comap-container">
      <interactive-comap
        :nodes="nodes" 
        :connections="connections" 
        :toggled="toggledCopy"
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
import { ref, reactive, computed, onMounted } from 'vue';
import InteractiveComap from './components/InteractiveComap.vue';
import ToolbarComponent from './components/ToolbarComponent.vue';
import { nodes, connections, toggled } from '../public/data';

const interactions : string[] = reactive([]);
let toggledCopy = ref([...toggled.value]);

const handleInteraction = ({type, node, data} : Interaction) => {
  console.log(type, data);
  const date = new Date().toLocaleDateString("de-AT", 
    {hour:"numeric", minute:"numeric", second:"numeric"});
  interactions.push(`${date} - [${type}${node ? ':' + node : ''}]${data ? ": " + data : ''}`);
}

const possibleToggles = ref<string[]>([]);


const formattedInteractions = computed(() => {
  return interactions.join('<br />');
});

const updateToggles = (data : string[]) => {
  console.log('update', data);
  toggledCopy.value.splice(0, toggledCopy.value.length);
  toggledCopy.value.push(...data);
}
onMounted(() => {
  nodes.value.forEach((node) => {
    if (possibleToggles.value.includes(node.toggler)) {
      return;
    }
    possibleToggles.value.push(node.toggler);
    });
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
  grid-template-rows: 100px 1fr;
  grid-template-columns: 2fr 1fr;
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
