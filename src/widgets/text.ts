import { AnyVNode } from "../core/vnode";
import { Widget } from "../core/widget";

export class Text extends Widget {
    constructor(private value: string) {
        super()
    }
    build(): AnyVNode {
        return {
            type: 'text',
            text: this.value
        }
    }
}