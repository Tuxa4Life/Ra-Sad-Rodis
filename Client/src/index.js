import { BrowserRouter } from "react-router-dom";
import App from "./App";

const { createRoot } = require("react-dom/client");

const root = createRoot(document.getElementById('root'))
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)