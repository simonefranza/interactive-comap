export const defaultStyle = `
.map-node {
  font-family: monospace;
  color: #eee;
  border-radius: 0.5rem;
  background-image: linear-gradient(133deg, salmon, #5f0b83);
  max-width: 400px;
  border: 1px solid palevioletred;
  padding-block: 0.5rem;
  padding-inline: 1.2rem;
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
