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
        if (myIndex === undefined || myIndex === -1) {
            const index = game?.players?.findIndex(e => {
                return e.id === user.id
            })

            setMyIndex(index)
        }
    }, [myIndex, game?.players, user])

    const renderedPlayers = game?.players?.map((e, i) => {
        return <div key={i} class="item" style={{ padding: '10px 40px' }}>
            <img onError={(currentImg) => {
                currentImg.onerror = null
                currentImg.target.src = 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
            }} class="ui avatar image" src={e.picture} />
            <div class="content">
                <p class="header" style={{marginTop: '4%'}}>{e.username} {i === 0 ? <i style={{ color: 'orange' }} class="chess queen icon"></i> : null} {myIndex === i ? <span style={{ fontWeight: '300' }}>(შენ)</span> : null}</p>
            </div>
        </div>
    })

    return <div style={{ width: '100%', height: '80dvh', padding: '100px', display: 'flex' }}>
        <button onClick={() => leaveRoom(id)} class="ui basic button" style={{ position: 'absolute', top: '10px', left: '10px' }}>
            <i style={{ transform: 'scaleX(-1)' }} class="icon sign-out"></i>
            Leave room
        </button>

        <div className="details-side" style={{width: '65%', height: '80dvh'}}>
            <h1 style={{ fontSize: '48px' }}>ოთახი: {game?.id}</h1>

            <div class="ui section divider" style={{ width: '70%' }}></div>

            <div className="player-container" style={{ width: '50%' }}>
                <h1 className="ui header">მოთამაშეები ({game?.players?.length}/{game?.meta?.maxPlayerCount}):</h1>
                <div className="ui massive list">{ renderedPlayers }</div>
            </div>

            <div class="ui section divider" style={{ width: '70%' }}></div>

            <h2>დრო: {game?.meta?.maxTime} წამი</h2>

            { myIndex === 0 && <button style={{marginTop: '30px'}} className="ui button">დაწყება</button> }
        </div>
        <div style={{height: '80dvh', width: '35%'}}>
            <Chat chat={game?.chat} id={user?.id} roomId={id}/>
        </div>
    </div>
}

export default Room;