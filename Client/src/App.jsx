import { Route, Routes } from "react-router-dom";
import Lobby from "./Pages/Lobby";
import Room from "./Pages/Room";
import Game from "./Pages/Game";

const App = () => {
    return <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/room/:id" element={<Room />} />
        <Route path="/game/:id" element={<Game />} />
    </Routes>
}

export default App;