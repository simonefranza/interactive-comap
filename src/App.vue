<template>
  <InteractiveComap :nodes="nodes" :connections="connections" :toggled="toggled"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import InteractiveComap from './components/InteractiveComap.vue'

export default defineComponent({
  components: {
    InteractiveComap,
  },
  data() {
    return {
      nodes: [
        {
          "title": "binary",
          "description": "a pre-compiled, pre-linked program that is ready to run under a given operating system",
          "toggler": "a",
          "nx": 461.0706787109375,
          "ny": -287.7810974121094
        },
        {
          "title": "program",
          "description": "a sequence of instructions that a computer can interpret and execute",
          "toggler": "b",
          "nx": 461.0706787109375,
          "ny": -287.7810974121094
        },
        {
          "title": "instruction",
          "description": "a line of code written as part of a computer program",
          "toggler": "b",
          "nx": 461.0706787109375,
          "ny": -287.7810974121094
        },
        {
          "title": "compiler",
          "description": "a program that decodes instructions written in a higher order language and produces an assembly language program",
          "toggler": "b",
          "nx": 461.0706787109375,
          "ny": -287.7810974121094
        },
        {
          "title": "parser",
          "description": "a computer program that divides code up into functional components",
          "toggler": "b",
          "nx": 461.0706787109375,
          "ny": -287.7810974121094
        },
        
        {
          "title": "computer science",
          "description": "the branch of engineering science that studies computable processes and structures",
          "toggler": "c",
          "nx": 461.0706787109375,
          "ny": -287.7810974121094
        },
      ],
      connections: [
        {
          source: 'binary',
          target: 'program',
        },
        {
          source: 'program',
          target: 'instruction',
        },
        {
          source: 'program',
          target: 'compiler',
        },
        {
          source: 'program',
          target: 'parser',
        },
        {
          source: 'parser',
          target: 'compiler',
        },
        {
          source: 'program',
          target: 'computer science',
        },
      ],
      toggled: [ 'a', 'b', 'c' ],
    };
  },
});
</script>

<style>
body, #app {
  height: 100vh;
  width: 100vw;
  padding: 0;
  margin: 0;
  position: relative;
}
</style>
