import { StatefulWidget } from "./core/stateful_widget";
import { AnyVNode } from "./core/vnode";
import { Widget } from "./core/widget";
import { Button, Div, H1 } from "./widgets/elements";
import { Text } from "./widgets/text";

export class Counter extends StatefulWidget {
    state = { 'count': 0 }

    render(): Widget {

        return new Div([
            new H1([new Text(`counter ${this.state.count}`)]),
            new Button([new Text('Increment')], {
                onClick: () => {
                    console.log('click');

                    this.setState({ count: this.state.count + 1 })
                }
            })
        ])
    }

}