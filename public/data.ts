import { ref } from 'vue';
export const nodes = ref<MapNode[]>([
  {
    "title": "binary",
    "description": "a pre-compiled, pre-linked program that is ready to run under a given operating system",
    "toggler": "c",
    "nx": 82.7491455078125,
    "ny": 176.86184120178223
  },
  {
    "title": "program",
    "description": "a sequence of instructions that a computer can interpret and execute",
    "toggler": "d",
    "nx": 238.15523147583008,
    "ny": 258.28253173828125,
  },
  {
    "title": "instruction",
    "description": "a line of code written as part of a computer program",
    "toggler": "b",
    "nx": 124.95005798339844,
    "ny":  395.1403293609619,
  },
  {
    "title": "compiler",
    "description": "a program that decodes instructions written in a higher order language and produces an assembly language program",
    "toggler": "b",
    "nx": 423.8379898071289,
    "ny": 320.0327339172363 
  },
  {
    "title": "parser",
    "description": "a computer program that divides code up into functional components",
    "toggler": "b",
    "nx": 330.3810272216797,
    "ny": 167.31288528442383,
  },
  
  {
    "title": "computer science",
    "description": "the branch of engineering science that studies computable processes and structures",
    "toggler": "a",
    "nx": 281.75140380859375,
    "ny": 420.69657995352836
  },
]);
export const connections = ref<Connection[]>([
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
]);
export const toggled = ref([ 'c', 'd', 'a', 'b' ]);
