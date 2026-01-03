import { AnyVNode } from "./vnode";
import { Widget } from "./widget";

export abstract class StatefulWidget extends Widget {
    protected state: Record<string, any> = {};

    // render() returns a Widget describing the current state
    abstract render(): Widget;

    // build() calls render and wraps into VNode
    build(): AnyVNode {
        return { type: 'widget', widget: this };
    }


    setState(next: Partial<Record<string, any>>) {
        Object.assign(this.state, next);
        this.update();

    }
}