import { Route, Routes } from "react-router-dom";
import Lobby from "./Pages/Lobby";
import Room from "./Pages/Room";

const App = () => {
    return <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/room/:id" element={<Room />} />
    </Routes>
}

export default App;