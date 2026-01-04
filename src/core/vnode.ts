import { CssStyle } from "./css_style";
import { Widget } from "./widget";

export type VNodeType = 'element' | 'text' | 'widget'

export interface VNode {
    type: VNodeType
    key?: string; // Optional for stable diff
    _dom?: Node       // ← patching လုပ်ဖို့ DOM reference
}

export interface VText extends VNode {
    type: 'text',
    text: string
}

export interface VElement extends VNode {
    type: 'element',
    tag: string,
    props?: VElementPropsType,
    children: AnyVNode[]
}
export interface VWidget extends VNode {
    type: 'widget',
    widget: Widget,
    child: AnyVNode
}
export type AnyVNode = VText | VElement | VWidget;

export type VElementPropsType = {
    style?: Partial<CSSStyleDeclaration | CssStyle>,
    [key: string]: any
};