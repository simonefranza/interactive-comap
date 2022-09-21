export const defaultStyle = `
.map-node {
  position: static;
  box-sizing: border-box;
  font-family: monospace;
  display: inline-block;
  color: #eee;
  pointer-events: none;
  border-radius: 0.5rem;
  background-image: linear-gradient(133deg, salmon, #5f0b83);
  padding-block: 0.5rem;
  padding-inline: 1.2rem;
  max-width: 500px;
  border: 1px solid palevioletred;
  cursor: pointer;
  z-index: 2000;
  pointer-events: all;
}
.map-node.old{
  background-image: linear-gradient(133deg, darkviolet, #5f0b83);
}
.map-node.clicked {
  background-image: linear-gradient(73deg, darkviolet, #5f0b83);
  border: 1px solid darkviolet;
}
.node-title.clicked {
  font-weight: bold;
  text-transform: uppercase;
}
.node-description {
  text-align: left;
}
.node-link {
  stroke: violet;
  stroke-width: 3px;
  fill: transparent;
}
`;
