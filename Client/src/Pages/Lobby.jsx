import { GoogleLogin } from "@react-oauth/google";
import { useSockets, useUserContext } from '../Context/useContext'
import CreateRoom from "../Components/CreateRoom";
import { useState } from "react";

const Lobby = () => {
    const { user, loggedIn, onLogin, logOut } = useUserContext()
    const { clientCount, createRoom, joinRoom, rooms } = useSockets()

    const [createRoomOpen, setCreateRoomOpen] = useState(false)

    const renderedRooms = rooms.map((e, i) => {
        return <div key={i} className="room-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '430px', height: '55px', backgroundColor: 'white', margin: '10px', border: '1px rgba(0, 0, 0, 0.2) solid', borderRadius: '5px' }}>
            <p style={{ margin: '0 0 0 15px', fontSize: '18px' }}>{e.name}</p>
            <div onClick={() => joinRoom(e.name)} class="ui animated vertical button" tabindex="0" style={{ width: '100px', margin: '0 7px 0 0' }}>
                <div class="visible content">{e.count}/{e.maxCount}</div>
                <div class="hidden content" style={{ fontWeight: '300' }}>
                    შესვლა
                </div>
            </div>
        </div>
    })

    return <div className="ui container" style={{ width: '100%', height: '100dvh', display: 'flex', justifyContent: 'center' }}>
        {createRoomOpen && <CreateRoom create={createRoom} close={() => setCreateRoomOpen(false)} />}

        {
            loggedIn && <button onClick={logOut} class="ui basic button" style={{ position: 'absolute', top: '10px', left: '10px' }}>
                <i style={{ transform: 'scaleX(-1)' }} class="icon sign-out"></i>
                Log out
            </button>
        }

        {
            loggedIn && <p style={{ position: 'absolute', width: '100%', bottom: '10px', textAlign: 'center', fontSize: '18px' }}>
                ონლაინ მოთამაშეები: {clientCount === 1 ? '1 (შენ)' : clientCount}
            </p>
        }

        {loggedIn || <div style={{ width: '400px', display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <h1 style={{ textAlign: 'center', margin: '30vh 0 30px 0' }}>სათამაშოდ გაიარეთ რეგისტრაცია</h1>
            <GoogleLogin width={250} onSuccess={(resp) => onLogin(resp)} onError={() => alert("Login Failed")} />
        </div>}

        {
            loggedIn && <div>
                <div className="profile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', marginTop: '15vh' }}>
                    <img onError={(currentImg) => {
                        currentImg.onerror = null
                        currentImg.target.src = 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'
                    }} className="ui avatar image tiny" src={user.picture} alt="" />
                    <h1 style={{ marginTop: '10px' }} className="ui header">{user.name}</h1>
                </div>

                <div className="room-container" style={{ marginTop: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                    <h2>სათამაშო ოთახები</h2>
                    <div className="rooms" style={{ width: '450px', height: '400px', backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: '5px', boxShadow: 'inset 0px 0px 25px -20px #000000', overflowY: 'auto', overflowX: 'hidden' }}>
                        { renderedRooms }
                    </div>

                    <div class="ui horizontal divider">ან</div>

                    <button onClick={() => setCreateRoomOpen(true)} style={{ width: '100%', fontWeight: '300' }} className="ui button">შექმენი ოთახი</button>
                </div>
            </div>
        }
    </div>
}

export default Lobby;