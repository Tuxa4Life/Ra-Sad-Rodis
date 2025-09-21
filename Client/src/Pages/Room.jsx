import { useParams } from "react-router-dom";
import { useSockets, useUserContext } from "../Context/useContext";
import { useEffect, useState } from "react";
import Chat from "../Components/Chat";

const Room = () => {
    const { game, leaveRoom } = useSockets()
    const { id } = useParams()
    const { user } = useUserContext()

    const [myIndex, setMyIndex] = useState(-1)

    useEffect(() => {
        if (myIndex === null || myIndex === -1) {
            const index = game?.players?.findIndex(e => {
                return e.id === user.id
            })

            setMyIndex(index)
        }
    }, [user, game?.players])

    const renderedPlayers = game?.players?.map((e, i) => {
        return <div key={i} class="item" style={{ padding: '10px 40px' }}>
            <img class="ui avatar image" src={e.picture} />
            <div class="content">
                <p class="header">{e.username} {i === 0 ? <i style={{ color: 'orange' }} class="chess queen icon"></i> : null} {myIndex === i ? <span style={{ fontWeight: '300' }}>(შენ)</span> : null}</p>
            </div>
        </div>
    })

    return <div style={{ width: '100%', height: '100dvh', padding: '100px', display: 'flex' }}>
        <button onClick={() => leaveRoom(id)} class="ui basic button" style={{ position: 'absolute', top: '10px', left: '10px' }}>
            <i style={{ transform: 'scaleX(-1)' }} class="icon sign-out"></i>
            Leave room
        </button>

        <div className="details-side" style={{width: '65%', height: '100dvh'}}>
            <h1 style={{ fontSize: '48px' }}>ოთახი: {game?.id}</h1>

            <div class="ui section divider" style={{ width: '70%' }}></div>

            <div className="player-container" style={{ width: '50%' }}>
                <h1 className="ui header">მოთამაშეები ({game?.players?.length}/{game?.meta?.maxPlayerCount}):</h1>
                <div className="ui massive list">{renderedPlayers}</div>
            </div>

            <div class="ui section divider" style={{ width: '70%' }}></div>

            <h2>დრო: {game?.meta?.maxTime} წამი</h2>

            { myIndex === 0 && <button style={{marginTop: '30px'}} className="ui button">დაწყება</button> }
        </div>
        <div style={{height: '70dvh', width: '35%'}}>
            <Chat />
        </div>
    </div>
}

export default Room;