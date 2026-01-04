import { AnyVNode, VElement, VElementPropsType } from "../core/vnode";
import { Widget } from "../core/widget";
import { Element } from "../core/element";

export class Div extends Element {
    constructor(children?: Widget[], props?: VElementPropsType) {
        super('div', children, props)
    }
}

export class H1 extends Element {
    constructor(children?: Widget[], props?: VElementPropsType) {
        super('h1', children, props)
    }
}
export class H2 extends Element {
    constructor(children?: Widget[], props?: VElementPropsType) {
        super('h2', children, props)
    }
}
export class H3 extends Element {
    constructor(children?: Widget[], props?: VElementPropsType) {
        super('h3', children, props)
    }
}
export class H4 extends Element {
    constructor(children?: Widget[], props?: VElementPropsType) {
        super('h4', children, props)
    }
}

export class Button extends Element {
    constructor(children?: Widget[], props?: VElementPropsType) {
        super('button', children, props)
    }
}

// HTML Element များအတွက် (ဥပမာ- div, h1, button)
export class Container extends Element {
    constructor(children?: Widget[], props?: VElementPropsType) {
        super('div', children, props)
    }
}