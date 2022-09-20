export const nodes = [
  {
    "title": "binary",
    "description": "a pre-compiled, pre-linked program that is ready to run under a given operating system",
    "toggler": "c",
    "nx": 121.30030822753906,
    "ny": 63.5488224029541
  },
  {
    "title": "program",
    "description": "a sequence of instructions that a computer can interpret and execute",
    "toggler": "d",
    "nx": 263.9640693664551,
    "ny": 138.99618530273438
  },
  {
    "title": "instruction",
    "description": "a line of code written as part of a computer program",
    "toggler": "b",
    "nx": 87.08744812011719,
    "ny": 220.1719150543213
  },
  {
    "title": "compiler",
    "description": "a program that decodes instructions written in a higher order language and produces an assembly language program",
    "toggler": "b",
    "nx": 447.61100006103516,
    "ny": 150.25969314575195
  },
  {
    "title": "parser",
    "description": "a computer program that divides code up into functional components",
    "toggler": "b",
    "nx": 350.7620086669922,
    "ny": 37.17207717895508
  },
  {
    "title": "computer science",
    "description": "the branch of engineering science that studies computable processes and structures",
    "toggler": "a",
    "nx": 307.8663330078125,
    "ny": 237.457963010169
  }
];
export const connections = [
  {
    "source": "binary",
    "target": "program"
  },
  {
    "source": "program",
    "target": "instruction"
  },
  {
    "source": "program",
    "target": "compiler"
  },
  {
    "source": "program",
    "target": "parser"
  },
  {
    "source": "parser",
    "target": "compiler"
  },
  {
    "source": "program",
    "target": "computer science"
  }
];
export const toggled = [ 'a', 'b', 'c', 'd' ];
