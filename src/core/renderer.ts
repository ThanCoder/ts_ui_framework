// renderer.ts
import { AnyVNode, VElement, VText, VWidget } from "./vnode";
import { StatefulWidget } from "./widget";

export class Renderer {
  // VNode ကို Real DOM ပြောင်းပေးခြင်း
  static createDom(vnode: AnyVNode): Node {
    if (vnode.type === 'widget') {
      const vwidget = vnode as VWidget;
      const widget = vwidget.widget;

      // ၁။ Lifecycle: initState ခေါ်ခြင်း
      widget.initState();

      // ၂။ widget.build() အစား widget.renderVNode() ကို ခေါ်ပါ။
      // ဒါမှသာ Widget ထဲမှာ Widget တွေ ထပ်နေရင် အောက်ဆုံးထိ VNode ပြောင်းပေးမှာပါ။
      const renderedVNode = widget.renderVNode();

      // ၃။ Rendered VNode (element/text) ကို Real DOM ပြောင်းမယ်
      const node = Renderer.createDom(renderedVNode);

      // ၄။ Reference တွေ သိမ်းမယ်
      vnode._dom = node;

      return node;
    }
    if (vnode.type === 'text') {
      const node = document.createTextNode((vnode as VText).text);
      vnode._dom = node;
      return node;
    }

    if (vnode.type === 'element') {
      const velem = vnode as VElement;
      const node = document.createElement(velem.tag);
      velem._dom = node;

      // Props & Styles ထည့်ခြင်း
      if (velem.props) {
        applyProps(node, velem.props);
      }

      // Children များထည့်ခြင်း
      velem.children.forEach(child => {
        node.appendChild(Renderer.createDom(child));
      });

      return node;
    }



    throw new Error("Unknown vnode type");
  }

  // အရေးကြီးဆုံး Diffing Algorithm (Patching)
  static patch(oldVNode: AnyVNode, newVNode: AnyVNode, parentDom: Node) {
    // ၁။ Type မတူရင် အလုံးလိုက် အစားထိုးမယ်
    if (oldVNode.type !== newVNode.type) {
      const newDom = Renderer.createDom(newVNode);
      parentDom.replaceChild(newDom, oldVNode._dom!);
      return;
    }

    // ၂။ Text Node ဖြစ်ရင် စာသားပြောင်းမပြောင်းစစ်မယ်
    if (newVNode.type === 'text') {
      newVNode._dom = oldVNode._dom; // DOM reuse
      if ((oldVNode as VText).text !== (newVNode as VText).text) {
        newVNode._dom!.nodeValue = (newVNode as VText).text;
      }
      return;
    }

    // ၃။ Element ဖြစ်ရင် Props နဲ့ Children ကို Patch လုပ်မယ်
    if (newVNode.type === 'element') {
      const oldEl = oldVNode as VElement;
      const newEl = newVNode as VElement;
      newEl._dom = oldEl._dom; // DOM reuse

      // Update Props (Simple version)
      updateProps(newEl._dom as HTMLElement, oldEl.props, newEl.props);

      // Diff Children (ရိုးရှင်းအောင် index နဲ့ပဲ ဥပမာပြထားပါတယ်)
      const oldChildren = oldEl.children;
      const newChildren = newEl.children;
      const commonLength = Math.min(oldChildren.length, newChildren.length);

      for (let i = 0; i < commonLength; i++) {
        Renderer.patch(oldChildren[i], newChildren[i], newEl._dom!);
      }

      // အသစ်ပိုလာရင် add, အဟောင်းပိုနေရင် remove လုပ်ရမယ့် logic တွေ ဒီမှာ လိုမယ်...
    }

    // renderer.ts (Inside patch method)

    // ၄။ Widget ဖြစ်ရင်
    if (newVNode.type === 'widget') {
      const vWidgetOld = oldVNode as VWidget;
      const vWidgetNew = newVNode as VWidget;

      const oldInstance = vWidgetOld.widget;
      const newInstance = vWidgetNew.widget;

      // အဆင့် (၁) - Widget အမျိုးအစား (Class) နဲ့ Key တူမတူ စစ်မယ်
      const isSameWidget = oldInstance.constructor === newInstance.constructor &&
        oldInstance.key === newInstance.key;
      // console.log(`isSameWidget: ${isSameWidget} `);

      if (isSameWidget) {
        // ၁။ Lifecycle: didUpdateWidget ခေါ်ခြင်း
        newInstance.didUpdateWidget(oldInstance);

        // ၂။ DOM နဲ့ Container Reference တွေကို လက်ဆင့်ကမ်းမယ်
        newInstance._container = oldInstance._container;
        newVNode._dom = oldVNode._dom; // VNode ရဲ့ DOM ref (Root of this widget)

        // ၃။ State ကို လက်ဆင့်ကမ်းမယ်
        if (oldInstance instanceof StatefulWidget && newInstance instanceof StatefulWidget) {
          (newInstance as any).state = (oldInstance as any).state;
        }

        // ၄။ အရင်တစ်ခေါက်က Render လုပ်ထားတဲ့ VNode Tree (oldSubTree) ကို ယူမယ်
        const oldSubTree = oldInstance._vnode;

        // ၅။ အရေးကြီး - newInstance ကို build လုပ်ပြီး VNode Tree ထွက်လာအောင် လုပ်မယ်
        // အရင်က build() အစား renderVNode() ကို ပြောင်းသုံးရပါမယ်
        const newSubTree = newInstance.renderVNode();

        // newInstance ရဲ့ _vnode ကို renderVNode() ထဲမှာတင် update လုပ်ပြီးသားဖြစ်မယ်
        // ဒါပေမဲ့ သေချာအောင် ပြန် assign လုပ်လို့ရပါတယ်
        newInstance._vnode = newSubTree;

        // ၆။ Recursive Patch လုပ်မယ်
        if (oldSubTree && oldSubTree._dom) {
          const actualParent = oldSubTree._dom.parentNode || parentDom;

          Renderer.patch(oldSubTree, newSubTree, actualParent);

          // Patch ပြီးတဲ့အခါ ရလာတဲ့ Real DOM reference ကို newVNode ဆီ လက်ဆင့်ကမ်းမယ်
          newVNode._dom = newSubTree._dom;
        }
      } else {
        // === CASE B: Widget မတူတော့ဘူး (အသစ်လဲမယ်) ===
        if (oldVNode.type === 'widget') {
          oldVNode.widget.dispose(); // Lifecycle: ပျောက်ကွယ်တော့မယ့် Widget ကို နှုတ်ဆက်ခြင်း
        }
        // ၁. အသစ် Create လုပ်
        const newDom = Renderer.createDom(newVNode);

        // ၂. အဟောင်းနေရာမှာ အစားထိုး
        if (oldVNode._dom && parentDom) {
          parentDom.replaceChild(newDom, oldVNode._dom);
        }

        // (Optional) အဟောင်းကို unmount lifecycle ခေါ်လို့ရရင် ဒီမှာ ခေါ်မယ်
      }
      return;
    }
  }

  static mount(vnode: AnyVNode, container: HTMLElement) {
    const dom = Renderer.createDom(vnode);
    container.innerHTML = '';
    container.appendChild(dom);
  }
}

// Helper function to update props
function applyProps(el: HTMLElement, props: any) {
  for (const key in props) {
    if (key === 'style') {
      Object.assign(el.style, props[key]);
    } else if (key.startsWith('on')) {
      const eventName = key.substring(2).toLowerCase();
      el.addEventListener(eventName, props[key]);
    } else {
      el.setAttribute(key, props[key]);
    }
  }
}

function updateProps(el: HTMLElement, oldProps: any, newProps: any) {
  // Diffing logic for props goes here
  // Remove old props, Add new props
}