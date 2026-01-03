import { Text } from "./widgets/text";
import { Button, Div, H1 } from "./widgets/elements";

const app = new Div([
    new H1([new Text("Hello Renderer")]),
    new Button([
        new Text("Click me")
    ], {
        onClick: () => window.alert("Clicked!"),
        style: {
            padding: "10px",
            fontSize: "16px"
        }
    }),
]);

const root = document.getElementById("app")!;
app.mount(root);


