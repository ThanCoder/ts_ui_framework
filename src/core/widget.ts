import { Renderer } from "./renderer";
import { AnyVNode } from "./vnode";


// Widget ကို VElement or VText ထုတ်ပေးနိုင်အောင် ပြင်ခြင်း
export abstract class Widget {
  // ... existing code
  key?: string;
  _vnode?: AnyVNode; // rendered VNode reference
  _container?: HTMLElement;

  constructor(key?: string) {
    this.key = key;
  }

  // အရေးကြီးဆုံးအချက်: build() က နောက်ထပ် Widget တစ်ခုကို ပြန်ပေးမယ်
  abstract build(): Widget | AnyVNode;

  // Widget တစ်ခုလုံးကို VNode Tree ဖြစ်သွားအောင် recursive လုပ်မယ့် function
  renderVNode(): AnyVNode {
    const built = this.build();
    let vnode: AnyVNode;

    if (built instanceof Widget) {
      // Widget ဖြစ်နေရင် Recursive ဆက်ဆင်းမယ်
      vnode = built.renderVNode();
    } else {
      // AnyVNode (element/text) ဖြစ်နေရင် ရပ်မယ်
      vnode = built;
    }

    this._vnode = vnode; // လက်ရှိ Widget က ဘယ် VNode ကို ထုတ်ပေးလဲဆိုတာ သိမ်းထားမယ်
    return vnode;
  }

  // Widget စတင် Mount လုပ်ပြီးချိန်တွင် ခေါ်မည်
  initState(): void { }

  // Widget update ဖြစ်ခါနီး (Props/State မပြောင်းခင်) တွင် ခေါ်မည်
  didUpdateWidget(oldWidget: Widget): void { }

  // Widget ကို DOM မှ ဖယ်ရှားခါနီးတွင် ခေါ်မည်
  dispose(): void { }

  // Widget Class ထဲမှာ ပြင်ရန်
  mount(dom: HTMLElement) {
    const vnode = this.renderVNode(); // build() အစား renderVNode() ကို သုံးမယ်
    Renderer.mount(vnode, dom);
    this._container = dom;
  }
}

// StatelessWidget
export abstract class StatelessWidget extends Widget {
  constructor(key?: string) {
    super(key);
  }
  abstract render(): Widget;
}



// StatefulWidget
export abstract class StatefulWidget extends Widget {
  protected state: Record<string, any> = {}

  constructor(key?: string) {
    super(key);
  }

  setState(update: Partial<Record<string, any>> | ((state: Record<string, any>) => void)) {
    // 1. Update State
    if (typeof update === 'function') {
      update(this.state);
    } else {
      Object.assign(this.state, update);
    }

    // console.log("Current State:", this.state); // ဒါလေး ထည့်စစ်ကြည့်ပါ

    if (this._vnode && this._vnode._dom) {
      const oldSubTree = this._vnode;

      // အရေးကြီး: renderVNode ကသာ widget tree တစ်ခုလုံးကို VNode အဖြစ် ပြောင်းပေးမှာပါ
      const newSubTree = this.renderVNode();

      const parentDom = oldSubTree?._dom?.parentNode;
      if (parentDom) {
        Renderer.patch(oldSubTree, newSubTree, parentDom);
        this._vnode = newSubTree;
      }
    }
  }
}