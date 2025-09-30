import { useParams } from "react-router-dom";
import { useSockets, useUserContext } from "../Context/useContext";
import { useEffect, useState } from "react";
import Chat from "../Components/Chat";

const Room = () => {
    const { game, leaveRoom, startGame } = useSockets()
    const { id } = useParams()
    const { user } = useUserContext()

    const [myIndex, setMyIndex] = useState(-1)
    const [btnText, setBtnText] = useState('დააკოპირე')

    useEffect(() => {
        if (!game?.players) return
        const index = game.players.findIndex(e => e.id === user.id)
        setMyIndex(index)
    }, [game?.players, user.id])

    const renderedPlayers = game?.players?.map((e, i) => {
        return <div key={i} className="item" style={{ padding: '10px 40px' }}>
            <img onError={(currentImg) => {
                currentImg.onerror = null
                currentImg.target.src = 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
            }} className="ui avatar image" src={e.picture} />
            <div className="content">
                <p className="header" style={{ marginTop: '4%' }}>{e.username} {i === 0 ? <i style={{ color: 'orange' }} className="chess queen icon"></i> : null} {myIndex === i ? <span style={{ fontWeight: '300' }}>(შენ)</span> : null}</p>
            </div>
        </div>
    })

    return <div style={{ width: '100%', height: '80dvh', padding: '100px', display: 'flex' }}>
        <button onClick={() => leaveRoom(id)} className="ui basic button" style={{ position: 'absolute', top: '10px', left: '10px' }}>
            <i style={{ transform: 'scaleX(-1)' }} className="icon sign-out"></i>
            Leave room
        </button>

        <div className="details-side" style={{ width: '65%', height: '80dvh' }}>
            <h1 style={{ fontSize: '48px' }}>ოთახი: {game?.id}</h1>

            <div className="ui section divider" style={{ width: '70%' }}></div>

            <div className="player-container" style={{ width: '50%' }}>
                <h1 className="ui header">მოთამაშეები ({game?.players?.length}/{game?.meta?.maxPlayerCount}):</h1>
                <div className="ui massive list">{renderedPlayers}</div>
            </div>

            <div className="ui section divider" style={{ width: '70%' }}></div>

            <h2>დრო: {game?.meta?.maxTime} წამი</h2>

            {myIndex === 0 ? <button onClick={() => startGame(id)} style={{ marginTop: '30px' }} className="ui huge button">დაწყება</button> : <button style={{ marginTop: '30px', fontWeight: '300', color: 'black' }} className="ui button disabled">ველოდებით ოთახის შემქმნელს რომ დაიწყოს თამაში</button>}

            <div style={{ marginTop: '50px' }}>
                <h3>გააზიარე:</h3>
                <div onClick={() => {
                    setBtnText('დაკოპირებულია!')
                    navigator.clipboard.writeText(`http://${window.location.hostname}/room/${id}`).then(() => setTimeout(() => setBtnText('დააკოპირე'), 1500))
                }} class="ui animated vertical button" tabIndex="0">
                    <div class="visible content">http://{window.location.hostname}/room/{id}</div>
                    <div class="hidden content">{btnText}</div>
                </div>
            </div>
        </div>
        <div style={{ height: '80dvh', width: '35%' }}>
            <Chat chat={game?.chat} id={user?.id} roomId={id} />
        </div>
    </div>
}

export default Room;