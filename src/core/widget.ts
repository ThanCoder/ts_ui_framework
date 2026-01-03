import { Renderer } from "./renderer";
import { AnyVNode } from "./vnode";

export abstract class Widget {

  build(): AnyVNode {
    return { type: 'widget', widget: this }
  }
  abstract render(): Widget;


  _dom?: Node;       // Mounted DOM node
  _lateVnode?: AnyVNode; // Last VNode
  _container?: HTMLElement;

  mount(container: HTMLElement) {
    this._container = container;
    const vnode = this.build();
    const dom = Renderer.mount(vnode, container);
    this._dom = dom;
    this._lateVnode = vnode;
  }

  update() {
    // console.log(this._dom);
    // console.log(this._lateVnode);
    // console.log(this._container);

    if (!this._dom || !this._lateVnode || !this._container) return;
    const newVNode = this.build();
    Renderer.patch(this._lateVnode, newVNode, this._dom);
    this._lateVnode = newVNode;
  }
}
