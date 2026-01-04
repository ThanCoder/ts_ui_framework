import { AnyVNode, VElementPropsType, VWidget } from "./vnode";
import { Widget } from "./widget";

export class Element extends Widget {

    constructor(
        private tag: string,
        private children: Widget[] = [],
        private props: VElementPropsType = {},

    ) {
        super();
    }

    build(): AnyVNode {
        return {
            type: 'element',
            tag: this.tag,
            props: this.props,
            // ဒီနေရာမှာ e.build() ကို တန်းမခေါ်ပါနဲ့
            // Widget အနေနဲ့ပဲ လက်ဆင့်ကမ်းပေးရပါမယ်
            children: this.children.map(child => {
                return {
                    type: 'widget',
                    widget: child,
                    // child ထဲက build() ကို Renderer ထဲကျမှ ခေါ်ပါမယ်
                    child: child.build()
                } as any;;
            }),
        }
    }
}