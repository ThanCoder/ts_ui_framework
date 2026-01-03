import { Widget } from "../core/widget";
import { Element } from "./element";

export class Div extends Element {
    constructor(children?: Widget[], props?: Record<string, any>) {
        super('div', children, props)
    }
}

export class H1 extends Element {
    constructor(children?: Widget[], props?: Record<string, any>) {
        super('h1', children, props)
    }
}
export class H2 extends Element {
    constructor(children?: Widget[], props?: Record<string, any>) {
        super('h2', children, props)
    }
}
export class H3 extends Element {
    constructor(children?: Widget[], props?: Record<string, any>) {
        super('h3', children, props)
    }
}
export class H4 extends Element {
    constructor(children?: Widget[], props?: Record<string, any>) {
        super('h4', children, props)
    }
}

export class Button extends Element {
    constructor(children?: Widget[], props?: Record<string, any>) {
        super('button', children, props)
    }
}