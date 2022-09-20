<template>
  <div class="toolbar">
    <div class="toggles">
      <span class="title">Toggles</span>
      <div class="toggle-list">
        <span v-for="tog, idx in possibleToggles" :key="tog">
          <input type="checkbox" value="tog" v-model="model[idx]">
          <label for="tog">{{tog}}</label>
        </span>
      </div>
    </div>

    <div class="file-manager">
      <div class="file-upload">
        <input ref="fileInput" type="file" single />
        <div style="color:red" v-if="errorMessage !== ''">
          {{errorMessage}}
        </div>
      </div>
      <div class="file-download">
        <button v-if="enableDownload" @click="downloadFile">Download</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch } from 'vue';
const props = defineProps<{
  possibleToggles: string[],
  selectedToggles: string[],
}>();

const emit = defineEmits<{
  (e: 'togglesChanged', ls: string[]): void,
  (e: 'newData', data: UserData): void,
  (e: 'downloadFile'): void,
}>();

let model : Boolean[] = reactive([]);
const fileInput = ref();
const errorMessage = ref('');
const enableDownload = ref(false);

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

onMounted(() => {
  props.possibleToggles.forEach((tog) => {
    model.push(false);
  });
  fileInput.value.addEventListener("change", handleFiles, false);
  function handleFiles() {
    console.log(this.files);
    var reader = new FileReader();
    reader.readAsText(this.files[0], "UTF-8");
    reader.onload = function (evt : ProgressEvent) {
      console.log('load', evt);
      try {
        const parsed = JSON.parse(evt.target.result);
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
      console.log('err', evt);
    }
  }
});
</script>

<style lang="scss" scoped>
.toolbar {
  width: 100vw;
  height: 100%;
  display: flex;
  justify-content: center;
  position: relative;
  align-items: flex-start;
  padding: 1rem;
  box-sizing: border-box;
  gap: 3rem;
}
.toggles {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  & .title {
    position: relative;
    background: #242424;
  }
}
.toggle-list {
  width: 50vw;
  height: 100%;
  overflow: scroll;
  display: flex;
  flex-flow: row wrap;
  scroll-behavior: smooth;
  align-items: flex-start;
  position: relative;
  gap: 0.5rem;
}

.file-manager {
  position: relative;
  width: 50vw;
  height: 100%;
  display: flex;
  flex-direction: row;
}

.file-upload {
  position: relative;
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.file-download {
  width: 50%;
}
</style>
