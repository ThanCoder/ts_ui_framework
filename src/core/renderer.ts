import { AnyVNode } from "./vnode";

export class Renderer {
    static mount(vnode: AnyVNode, container: HTMLElement): Node {
        if (vnode.type === 'widget') {
            const widget = vnode.widget;
            if (!widget._container) widget._container = container;
            const childVNode = widget.render().build();
            const dom = this.mount(childVNode, container);
            widget._dom = dom;
            widget._lateVnode = childVNode;
            return dom;
        }

        if (vnode.type === 'element') {
            const el = document.createElement(vnode.tag);
            if (vnode.props?.onClick) el.addEventListener('click', vnode.props.onClick);
            for (const [key, val] of Object.entries(vnode.props ?? {})) {
                if (key !== 'onClick') (el as any)[key] = val;
            }
            vnode.children.forEach(c => this.mount(c, el));
            container.appendChild(el);
            return el;
        }

        if (vnode.type === 'text') {
            const t = document.createTextNode(vnode.text);
            container.appendChild(t);
            return t;
        }

        throw new Error('Unknown VNode type');
    }


    private static createDom(vnode: AnyVNode): Node {
        switch (vnode.type) {
            case 'text':
                return document.createTextNode(vnode.text);
            case 'element':
                const el = document.createElement(vnode.tag)

                if (vnode.props) {
                    for (const [key, value] of Object.entries(vnode.props)) {
                        this.setProp(el, key, value);
                    }
                }
                vnode.children.forEach(child => {
                    el.appendChild(this.createDom(child))
                })
                return el;
            case 'widget':
                const widget = vnode.widget;

                if (!widget._container) {
                    // assign container before mounting
                    throw new Error('Widget container not set');
                }

                // mount child widget into its container
                const childVNode = widget.render().build();
                const dom = this.createDom(childVNode);

                widget._dom = dom;
                widget._lateVnode = childVNode;

                // append to container
                widget._container.appendChild(dom);

                return dom;
        }
        // throw Error(`[createDom:error]: ${vnode.type}`)
    }

    private static setProp(el: HTMLElement, key: string, value: any) {

        // event
        if (key.startsWith("on") && typeof value === "function") {
            const event = key.substring(2).toLowerCase();
            el.addEventListener(event, value);
            return;
        }

        // style
        if (key === "style" && typeof value === "object") {
            Object.assign(el.style, value);
            return;
        }

        // attribute    
        el.setAttribute(key, String(value))
    }

    static patch(oldVNode: AnyVNode, newVNode: AnyVNode, dom: Node): Node {
        if (oldVNode.type !== newVNode.type) {
            const newDom = this.createDom(newVNode);
            dom.parentNode?.replaceChild(newDom, dom);
            return newDom;
        }

        if (newVNode.type === "text" && oldVNode.type === "text") {
            if (oldVNode.text !== newVNode.text) dom.textContent = newVNode.text;
            return dom;
        }

        if (newVNode.type === "element" && oldVNode.type === "element") {
            const el = dom as HTMLElement;

            // props diff
            const oldProps = oldVNode.props || {};
            const newProps = newVNode.props || {};
            for (const key in newProps) {
                if (oldProps[key] !== newProps[key]) this.setProp(el, key, newProps[key]);
            }
            for (const key in oldProps) {
                if (!(key in newProps)) el.removeAttribute(key);
            }

            // children diff
            const oldChildren = oldVNode.children;
            const newChildren = newVNode.children;

            const max = Math.max(oldChildren.length, newChildren.length);

            for (let i = 0; i < max; i++) {
                const oldChild = oldChildren[i];
                const newChild = newChildren[i];

                if (!oldChild && newChild) {
                    el.appendChild(this.createDom(newChild));
                } else if (!newChild && oldChild) {
                    el.removeChild(el.childNodes[i]);
                } else if (oldChild && newChild) {
                    this.patch(oldChild, newChild, el.childNodes[i]);
                }
            }

            return el;
        }
        if (oldVNode.type === 'widget' && newVNode.type === 'widget') {
            console.log('widget');

            // const oldWidget = oldVNode.widget;
            // const newWidget = newVNode.widget;

            // if (oldWidget === newWidget) {
            //     // same instance, just update
            //     newWidget.update();
            //     return newWidget._dom!;
            // } else {
            //     // different widget instance → replace DOM
            //     const newDom = this.createDom(newWidget.build());
            //     dom.parentNode?.replaceChild(newDom, dom);
            //     return newDom;
            // }
        }


        return dom;
    }

}
