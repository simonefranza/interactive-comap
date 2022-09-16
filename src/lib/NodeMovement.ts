import * as Utils from './utils';
import { Emitter } from 'mitt';

const CLICK_DURATION = 180;

export class NodeMovement {
  canvas : HTMLElement;
  node : SVGForeignObjectElement;
  startDragPos : ScreenPosition = {x : 0, y : 0};
  startDragPosUnit : ScreenPosition = {x : 0, y : 0};
  startDragTime : number = 0;
  nodeEmitter : Emitter<Events>; 
  emitInteraction: (int: Interaction) => void;

  pointerDownHandler: (e: PointerEvent) => void;
  pointerMovedHandler: (e: PointerEvent) => void;
  pointerUpHandler: () => void;

  constructor(canvas : HTMLElement, node : SVGForeignObjectElement, emitter : Emitter<Events>, 
   emitInteraction: Function) {
    this.canvas = canvas;
    this.node = node;
    this.nodeEmitter = emitter;
    this.emitInteraction = emitInteraction;
    this.pointerDownHandler = (event : PointerEvent) => this.handlePointerDown(event);
    this.pointerMovedHandler = (event : PointerEvent) => this.handlePointerMove(event);
    this.pointerUpHandler = () => this.handlePointerUp();
    this.node.addEventListener('pointerdown', this.pointerDownHandler);
  }

  handlePointerDown(event : PointerEvent) {
    console.log(event);
    this.saveStartPosition(event);
    this.moveNodeToFront();
    document.addEventListener('pointermove', this.pointerMovedHandler);
    document.addEventListener('pointerup', this.pointerUpHandler);
  };

  saveStartPosition(e : PointerEvent) {
    this.startDragTime = Date.now();
    this.startDragPos = { x : e.clientX, y : e.clientY };
    const x = this.node.getAttribute("x");
    const y = this.node.getAttribute("y");
    if (x === null || y === null) {
      throw "[saveStartPosition] x or y is null";
    }
    this.startDragPosUnit = { x : parseFloat(x), y : parseFloat(y)};
  }

  moveNodeToFront() {
    this.node.remove();
    this.canvas.appendChild(this.node);
  }

  handlePointerMove(event: PointerEvent) {
    const bounding = this.canvas.getBoundingClientRect();
    const viewBox = this.canvas.getAttribute("viewBox");
    if (viewBox === null) {
      throw "[RendererNode] viewBox is null";
    }
    this.node.style.cursor = "move";
    const viewBoxSplit = viewBox.split(" ").map((el) => parseFloat(el));
    const [ distX, distY ] = Utils.convertPixelDistanceToUnit(
      viewBoxSplit,
      bounding,
      [ event.clientX - this.startDragPos.x,
        event.clientY - this.startDragPos.y ]
    );
    this.node.setAttribute("x", (this.startDragPosUnit.x + distX).toString());
    this.node.setAttribute("y", (this.startDragPosUnit.y + distY).toString());

    //this.nodeRenderer.moveLinks();
  }

  handlePointerUp() {
    if (Date.now() - this.startDragTime < CLICK_DURATION) {
      this.nodeEmitter.emit('click');
    } else {
      const currentPosX = parseFloat(this.node.getAttribute('x') as string);
      const currentPosY = parseFloat(this.node.getAttribute('y') as string);
      this.emitInteraction({type: 'movedNode', 
        data: `x: ${this.startDragPosUnit.x.toFixed(2)}, y: ${this.startDragPosUnit.y.toFixed(2)} -> ` + 
      `x: ${currentPosX.toFixed(2)}, y: ${currentPosY.toFixed(2)}`});
    }
    this.node.style.cursor = "";
    console.log(this.node.getAttribute('x'), this.node.getAttribute('y'));
    document.removeEventListener('pointermove', this.pointerMovedHandler);
    document.removeEventListener('pointerup', this.pointerUpHandler);
  }
}
