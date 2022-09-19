import { Emitter } from "mitt";
import * as Utils from "./utils";

enum State {
  Initial,
  Zoom,
  Pan,
}

export class ZoomPanManager {
  canvas : SVGForeignObjectElement;

  widthPx: number;

  widthUnits : number;

  heightPx: number;

  heightUnits : number;

  emitter : Emitter<ZoomPanEvents>;

  pointerPos : ScreenPosition;

  lastPointerPos: ScreenPosition;

  state : State;

  wheelHandler : (e : WheelEvent) => void;

  pointerDownHandler: (e : PointerEvent) => void;

  pointerMoveHandler: (e : PointerEvent) => void;

  pointerUpHandler: (e : PointerEvent) => void;

  resetStateTimeout : ReturnType<typeof setTimeout> | null;

  constructor(canvas : SVGForeignObjectElement, emitter : Emitter<ZoomPanEvents>) {
    this.canvas = canvas;
    const bounding = this.canvas.getBoundingClientRect();
    this.widthPx = bounding.width;
    this.widthUnits = bounding.width;
    this.heightPx = bounding.height;
    this.heightUnits = bounding.height;
    this.emitter = emitter;
    this.state = State.Initial;

    this.pointerPos = {x : 0, y : 0};
    this.lastPointerPos = {x : 0, y : 0};
    const pointerPositionHandler = (e: ScreenPosition) => this.handlePointerPosition(e);
    this.canvas.addEventListener('pointermove', pointerPositionHandler);
    //this.emitter.on("pointerMoved", pointerPositionHandler);

    this.wheelHandler = (e : WheelEvent) => this.handleWheelInitial(e);
    this.pointerDownHandler = (e : PointerEvent) => this.handlePointerDown(e);
    this.pointerMoveHandler = (e : PointerEvent) => this.handlePointerMove(e);
    this.pointerUpHandler = (e : PointerEvent) => this.handlePointerUp(e);
    this.canvas.addEventListener("wheel", this.wheelHandler);
    this.canvas.addEventListener("pointerdown", this.pointerDownHandler);
    this.resetStateTimeout = null;
    //this.emitter.on("resizeGraph", () => {
    this.canvas.addEventListener("resize", () => {
      const bounding = this.canvas.getBoundingClientRect();
      const viewBox = this.canvas.getAttribute("viewBox");
      if (viewBox === null) {
        throw "[ZoomPanManager::handleResize] viewBox is null";
      }
      const viewBoxSplit = viewBox.split(" ").map((el) => parseFloat(el));
      //const viewBoxLeftOld = viewBoxSplit[0];
      const widthUnitsOld = this.widthUnits;
      const heightUnitsOld = this.heightUnits;
      this.widthUnits *= (bounding.width / this.widthPx);
      this.heightUnits *= (bounding.height / this.heightPx);
      //if (this.heightPx > 0 && this.heightUnits !== 0) {
      //} else if (this.heightUnits === 0) {
      //  this.heightUnits = (bounding.height / this.heightPx);
      //} else {
      //  this.heightUnits = 0;
      //}
      const noWidthDiff = Math.abs(widthUnitsOld - this.widthUnits) < 0.0000001;
      const noHeightDiff = Math.abs(heightUnitsOld - this.heightUnits) < 0.0000001;
      if (noWidthDiff && !noHeightDiff) {
        // Height resize
        const viewBoxTopOld = viewBoxSplit[1];
        const viewBoxHeightOld = viewBoxSplit[3];
        const viewBoxBottomOld = viewBoxTopOld + viewBoxHeightOld;
        viewBoxSplit[1] = viewBoxBottomOld - this.heightUnits;
      }
      viewBoxSplit[2] = this.widthUnits;
      viewBoxSplit[3] = this.heightUnits;
      this.canvas.setAttribute("viewBox", viewBoxSplit.join(" "));
      this.widthPx = bounding.width;
      this.heightPx = bounding.height;
    });
  }

  handlePointerPosition(pos: ScreenPosition) {
    this.pointerPos.x = pos.x;
    this.pointerPos.y = pos.y;
  }

  handlePointerDown(e : PointerEvent) {
    console.log('zoompan', e);
    this.lastPointerPos.x = e.clientX;
    this.lastPointerPos.y = e.clientY;
    document.addEventListener('pointermove', this.pointerMoveHandler);
    document.addEventListener('pointerup', this.pointerUpHandler);
  }

  handlePointerMove(e: PointerEvent) {
    this.state = State.Pan;
    e.preventDefault();
    const viewBox = this.canvas.getAttribute("viewBox");
    if (viewBox === null) {
      throw "[ShaderGraphRenderer::handleWheelPan] No viewBox";
    }
    const viewBoxSplit = viewBox.split(" ").map((el) => parseFloat(el));
    viewBoxSplit[0] -= e.clientX - this.lastPointerPos.x;
    viewBoxSplit[1] -= e.clientY - this.lastPointerPos.y;

    this.canvas.setAttribute("viewBox", viewBoxSplit.join(" "));
    this.checkTimeout();
    //this.emitter.emit("repositionLinks");
    this.lastPointerPos.x = e.clientX;
    this.lastPointerPos.y = e.clientY;
  }

  handlePointerUp(e: PointerEvent) {
    if (this.state === State.Pan) {
      this.emitter.emit('zoomPanInteraction', {type: 'panned'});
      this.state = State.Initial;
    }
    document.removeEventListener('pointermove', this.pointerMoveHandler);
    document.removeEventListener('pointerup', this.pointerUpHandler);
  }

  handleWheelInitial(e : WheelEvent) {
    this.canvas.removeEventListener("wheel", this.wheelHandler);
    if (Math.abs(e.deltaX) < 0.01 && Math.abs(e.deltaY) !== 2) {
      // Zoom
      this.state = State.Zoom;
      this.wheelHandler = (e : WheelEvent) => this.handleWheelZoom(e);
      this.canvas.addEventListener("wheel", this.wheelHandler);
    } else {
      //Panning
      this.state = State.Pan;
      this.wheelHandler = (e : WheelEvent) => this.handleWheelPan(e);
      this.canvas.addEventListener("wheel", this.wheelHandler);
    }
    this.wheelHandler(e);
  }

  handleWheelZoom(e  : WheelEvent) {
    e.preventDefault();
    const viewBox = this.canvas.getAttribute("viewBox");
    if (viewBox === null) {
      throw "[ShaderGraphRenderer] No viewBox";
    }
    let viewBoxSplit = viewBox.split(" ").map((el) => parseFloat(el));
    const bounding = this.canvas.getBoundingClientRect();
    const positions = Utils.convertPixelToUnit(
      viewBoxSplit,
      bounding,
      this.pointerPos.x,
      this.pointerPos.y
    );
    const centerX = positions[0];
    const centerY = positions[1];
    const factor = 0.01;
    // Move mouse position to origin
    viewBoxSplit[0] -= centerX;
    viewBoxSplit[1] -= centerY;

    // Scale
    viewBoxSplit = viewBoxSplit.map((el) => el * (1 + e.deltaY * factor));

    // Move origin to mouse position
    viewBoxSplit[0] += centerX;
    viewBoxSplit[1] += centerY;

    this.widthUnits = viewBoxSplit[2];
    this.heightUnits = viewBoxSplit[3];

    this.canvas.setAttribute("viewBox", viewBoxSplit.join(" "));
    this.checkTimeout();
    //this.emitter.emit("repositionLinks");
  }

  handleWheelPan(e  : WheelEvent) {
    e.preventDefault();
    const viewBox = this.canvas.getAttribute("viewBox");
    if (viewBox === null) {
      throw "[ShaderGraphRenderer::handleWheelPan] No viewBox";
    }
    const viewBoxSplit = viewBox.split(" ").map((el) => parseFloat(el));
    viewBoxSplit[0] += e.deltaX;
    viewBoxSplit[1] += e.deltaY;

    this.canvas.setAttribute("viewBox", viewBoxSplit.join(" "));
    this.checkTimeout();
    //this.emitter.emit("repositionLinks");
  }

  checkTimeout() {
    if (this.resetStateTimeout !== null) {
      clearTimeout(this.resetStateTimeout);
      this.resetStateTimeout = null;
    }
    this.resetStateTimeout = setTimeout(() => {
      if (this.state === State.Pan) {
        this.emitter.emit('zoomPanInteraction', {type: 'panned'});
      } else if (this.state === State.Zoom) {
        this.emitter.emit('zoomPanInteraction', {type: 'zoomed'});
      }
      this.state = State.Initial;
      this.canvas.removeEventListener("wheel", this.wheelHandler);
      this.wheelHandler = (e : WheelEvent) => this.handleWheelInitial(e);
      this.canvas.addEventListener("wheel", this.wheelHandler);
      this.resetStateTimeout = null;
    }, 150);
  }
}

