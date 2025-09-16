import { useParams } from "react-router-dom";
import { useSockets } from "../Context/useContext";

const Room = () => {
    const { leaveRoom } = useSockets()
    const { id } = useParams()

    return <div style={{ width: '100%', height: '100dvh' }}>
        <button onClick={() => leaveRoom(id)} class="ui basic button" style={{ position: 'absolute', top: '10px', left: '10px' }}>
            <i style={{ transform: 'scaleX(-1)' }} class="icon sign-out"></i>
            Leave room
        </button>
    </div>
}

export default Room;