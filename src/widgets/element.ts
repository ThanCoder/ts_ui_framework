import { AnyVNode } from "../core/vnode";
import { Widget } from "../core/widget";

export class Element extends Widget {
    constructor(
        private tag: string,
        private children: Widget[] = [],
        private props: Record<string, any> = {},

    ) {
        super();
    }
    build(): AnyVNode {
        return {
            type: 'element',
            tag: this.tag,
            props: this.props,
            children: this.children.map(e => e.build()),
        }
    }

}