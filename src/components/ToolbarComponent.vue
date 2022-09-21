<template>
  <div class="toolbar">
    <div class="file-manager">
      <span class="title">File Manager</span>
      <div class="file-upload">
        <label for="file-uploader" class="btn btn-basic">
          Upload Own Map 
        </label>
        <input id="file-uploader" ref="fileInput" type="file" single />
        <div class="error-message" v-if="errorMessage !== ''">
          {{errorMessage}}
          <button class="btn floaty" @click="errorMessage = ''">Close</button>
        </div>
      </div>
      <div class="file-download">
        <button class="btn" @click="downloadFile">Download JSON</button>
      </div>
    </div>
    <div class="new-node-container">
      <new-node :togglers="possibleToggles" @newNode="addNode" ></new-node>
    </div>
    <div class="new-node-container">
      <new-connection :nodes="nodes" @newConnection="addConnection" >
      </new-connection>
    </div>
    <div class="list-container">
      <span class="title">Nodes</span>
      <div class="list">
        <span v-for="node in nodes" :key="node.title">
          <img alt="X" src="/assets/close-icon.svg" @click="removeNode(node)"/>
          <label for="tog">{{node.title}}</label>
        </span>
      </div>
    </div>
    <div class="list-container">
      <span class="title">Connections</span>
      <div class="list">
        <span v-for="conn in connections" :key="conn.source + '-' + conn.target">
          <img alt="X" src="/assets/close-icon.svg" @click="removeConnection(conn)"/>
          <label for="tog">{{conn.source}} - {{conn.target}}</label>
        </span>
      </div>
    </div>
    <div class="list-container">
      <span class="title">Toggles</span>
      <div class="list">
        <span v-for="tog in possibleToggles" :key="tog">
          <input type="checkbox" value="tog" v-model="model[tog]">
          <label for="tog">{{tog}}</label>
        </span>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch } from 'vue';
import NewNode from './NewNode.vue';
import NewConnection from './NewConnection.vue';
const props = defineProps<{
  possibleToggles: string[],
  selectedToggles: string[],
  nodes: MapNode[],
  connections: Connection[],
}>();

const emit = defineEmits<{
  (e: 'togglesChanged', ls: string[]): void,
  (e: 'newData', data: UserData): void,
  (e: 'downloadFile'): void,
  (e: 'removeNode', node: MapNode): void,
  (e: 'addNode', node: MapNode): void,
  (e: 'removeConnection', conn: Connection): void,
  (e: 'addConnection', conn: Connection): void,
}>();

let model : { [key: string]: boolean} = reactive({});
const fileInput = ref();
const errorMessage = ref('');
const enableDownload = ref(false);

watch(props.possibleToggles, () => {
  const added = props.possibleToggles.filter(x => !(x in model));
  const removed = Object.keys(model).filter(x => !props.possibleToggles.includes(x));
  removed.forEach((el) => delete model[el]);
  added.forEach((el) => model[el] = false);
  props.selectedToggles.forEach((tog) => {
    if (tog in model) {
      model[tog] = true;
    }
  });
});


watch(model, () => {
  const els : string[] = [];
  Object.entries(model).forEach(([key, el]) => {
    if (el) {
      els.push(key);
    }
  });
  emit('togglesChanged', els);
});

function checkJson(json: Object) : string | null {
  if (!('nodes' in json)) {
    return 'Nodes array missing!';
  }
  if (!('connections' in json)) {
    return 'Connections array missing!';
  }
  const castedJson = json as UserData;
  for (let connection of castedJson.connections) {
    if (!castedJson.nodes.find((node) => node.title === connection.source)) { 
      return `Source node of connection (${connection.source}-${connection.target}) not found in nodes`;
    }
    if (!castedJson.nodes.find((node) => node.title === connection.target)) { 
      return `Target node of connection (${connection.source}-${connection.target}) not found in nodes`;
    }
  }
  return null;
}

function downloadFile() {
  emit('downloadFile');
}

function removeNode(node : MapNode) {
  emit('removeNode', node);
}

function addNode(node: MapNode) {
  emit('addNode', node);
}

function removeConnection(conn: Connection) {
  emit('removeConnection', conn);
}

function addConnection(conn: Connection) {
console.log("got conn", conn);
  emit('addConnection', conn);
}

onMounted(() => {
  props.possibleToggles.forEach((tog) => {
    model[tog] = false;
  });
  fileInput.value.addEventListener("change", handleFiles, false);
  function handleFiles(event : Event) {
    if (event === null || event.target === null) {
      return;
    }
    const reader = new FileReader();
    const files = (event.target as HTMLInputElement).files;
    if (files === undefined || files === null || files?.length < 1) {
      return;
    }
    reader.readAsText(files[0], "UTF-8");
    reader.onload = function (evt : ProgressEvent) {
      if (evt.target === null) {
        return;
      }
      try {
        const parsed = JSON.parse(reader.result as string);
        const err = checkJson(parsed);
        if (err === null) {
          emit('newData', parsed);
          enableDownload.value = true;
        } else {
          errorMessage.value = err;
        }
      } catch (e : any) {
        errorMessage.value = e.toString();

      }
    }
    reader.onerror = function (evt) {
      errorMessage.value = evt.toString();
    }
  }
});
</script>

<style lang="scss" scoped>
.toolbar {
  width: 100vw;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  position: relative;
  align-items: flex-start;
  padding: 1rem;
  box-sizing: border-box;
  gap: 0.8rem;
}
.list-container {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid white;
  padding: 0.5rem;
  border-radius: 1rem;
}
.list {
  height: 100%;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  scroll-behavior: smooth;
  align-items: flex-start;
  position: relative;
  gap: 0.5rem;
  text-align: left;
  & img {
    width: 1rem;
    cursor: pointer;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    visibility: hidden;
  }
  & span:hover img {
    visibility: initial;
  }
}

.file-manager {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid white;
  padding: 0.5rem;
  border-radius: 1rem;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
}

.file-upload {
  position: relative;
  display: flex;
  flex-direction: column;
}

.new-node-container {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  text-align: left;
  border: 1px solid white;
  padding: 0.5rem;
  border-radius: 1rem;
}

input[type="file"] {
  display: none;
}
.btn-basic {
  border-radius: 8px;
  border: 1px solid transparent;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;

  appearance: auto;
  writing-mode: horizontal-tb !important;
  text-rendering: auto;
  color: buttontext;
  letter-spacing: normal;
  word-spacing: normal;
  line-height: normal;
  text-transform: none;
  text-indent: 0px;
  text-shadow: none;
  display: inline-block;
  text-align: center;
  align-items: flex-start;
  box-sizing: border-box;
  margin: 0em;

  &:focus, &:focus-visible {
    border: 4px auto -webkit-focus-ring-color;
  }
  &:hover {
    border-color: #646cff;
  }
}
.error-message {
  position: fixed;
  max-width: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #ddd;
  padding: 1rem;
  border: black;
  border-radius: 1rem;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  font-weight: 500;
  color: red;
}
</style>
