import { Widget } from "./widget";

export type VNodeType = 'element' | 'text' | 'widget'

export interface VNode {
    type: VNodeType
    key?: string; // Optional for stable diff
}

export interface VText extends VNode {
    type: 'text',
    text: string
}

export interface VElement extends VNode {
    type: 'element',
    tag: string,
    props?: Record<string, any>,
    children: AnyVNode[]
}
export interface VWidget extends VNode {
    type: 'widget',
    widget: Widget
}
export type AnyVNode = VText | VElement | VWidget;