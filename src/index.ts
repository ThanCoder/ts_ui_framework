import { Text } from "./widgets/text";
import { Button, Div, H1 } from "./widgets/elements";
import { Counter } from "./counter";
import { TextWidget } from "./widgets/widgets";



const app = new Div([
    new TextWidget('hello'),
    new H1([new TextWidget('hello')]),
    new Counter(),
    new Counter(),
    new Counter(),
    new Counter(),
],);

const root = document.getElementById("app")!;
app.mount(root);


