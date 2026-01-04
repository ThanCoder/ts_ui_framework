import { AnyVNode } from "../core/vnode";
import { Widget } from "../core/widget";

// TextWidget ဖြည့်စွက်ရန်
export class TextWidget extends Widget {
    constructor(private text: string) {
        super();
    }

    build(): AnyVNode {
        return {
            type: 'text',
            text: this.text
        };
    }
}