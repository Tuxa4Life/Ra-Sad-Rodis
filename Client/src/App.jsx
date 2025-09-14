import { Route, Routes } from "react-router-dom";
import Lobby from "./Pages/Lobby";

const App = () => {
    return <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/game/:id" element={<div>Game</div>} />
    </Routes>
}

export default App;