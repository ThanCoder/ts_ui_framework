import { Element } from './widgets/element';
import { Text } from './widgets/text'

export class App {
    run() {
        const ui = new Element("div", [
            new Element("h1", [new Text("Hello")]),
            new Element("p", [new Text("Virtual DOM")])
        ]);


        console.log(ui.build());

    }
}