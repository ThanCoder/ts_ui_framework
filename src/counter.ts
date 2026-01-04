import { AnyVNode } from "./core/vnode";
import { StatefulWidget, Widget } from "./core/widget";
import { Button, Div, H1 } from "./widgets/elements";
import { Text } from "./widgets/text";

export class Counter extends StatefulWidget {
    build(): Widget | AnyVNode {
        return new Div([
            new H1([new Text(`counter ${this.state.count}`)]),
            new Button([new Text('Increment')], {
                onClick: () => {
                    this.setState({ count: this.state.count + 1 })

                }
            })
        ])
    }

    state = { count: 1 }

    initState(): void {
        console.log('init');

    }
    didUpdateWidget(oldWidget: Widget): void {
        console.log(`new wiget: ${oldWidget}`);

    }
    dispose(): void {
        console.log(`dispose`);

    }
}