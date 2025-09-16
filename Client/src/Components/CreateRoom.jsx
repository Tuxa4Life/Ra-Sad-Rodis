import { useState } from "react";
import { useNavigate } from 'react-router-dom'

const CreateRoom = ({ close, create }) => {
    const [roomName, setRoomName] = useState('')
    const [playerCount, setPlayerCount] = useState(1)
    const [time, setTime] = useState(60)

    const navigate = useNavigate()

    const submit = (e) => {
        e.preventDefault()
        create(roomName, playerCount, time)
        navigate(`/room/${roomName}`)
    }

    return <div style={{ width: '100%', height: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', top: '0', left: '0', zIndex: '2', backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
        <form onSubmit={submit} className="ui form" style={{ backgroundColor: 'white', width: '400px', padding: '15px', borderRadius: '7px' }}>
            <h1 className="ui header">ოთახის შექმნა</h1>
            <div class="field">
                <label>ოთახის სახელი</label>
                <input type="text" placeholder="ოთახის სახელი" value={roomName} onChange={e => setRoomName(e.target.value.replace(' ', ''))} />
            </div>

            <div class="field">
                <label>მაქსიმალური მონაწილეთა რაოდენობა (მაქს. 6)</label>
                <input type="number" min={1} max={6} placeholder="მაქსიმალური მონაწილეთა რაოდენობა" value={playerCount} onChange={e => setPlayerCount(e.target.value)} />
            </div>

            <div class="field">
                <label>პასუხის გასაცემი დრო (წამი)</label>
                <input type="number" min={10} max={300} placeholder="დრო" value={time} onChange={e => setTime(e.target.value)} />
            </div>

            <button class="ui button primary" style={{fontWeight: '300'}} type="submit">შექმნა</button>
            <button onClick={close} class="ui button" style={{fontWeight: '300'}} type="button">დახურვა</button>
        </form>
    </div>
}

export default CreateRoom;