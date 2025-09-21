import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from 'socket.io-client'

const socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000')

const SocketContext = createContext()
const SocketProvider = ({ children }) => {
    const [clientCount, setClientCount] = useState(0)
    const [rooms, setRooms] = useState([])
    const [game, setGame] = useState([])

    const navigate = useNavigate()
    useEffect(() => {
        socket.on('client-count', (count) => {
            setClientCount(count)
        })

        socket.on('rooms-changed', (rooms) => {
            setRooms(rooms)
        })

        socket.on('game-state', (data) => {
            setGame(data)
        })

    }, [])

    const changeClientData = (id, username, picture) => {
        socket.emit('client-data-change', { id, username, picture })
    }

    const createRoom = (roomId, count, time) => { // routing is from lobby
        socket.emit('create-room', { roomId, count, time })
    }

    const joinRoom = (roomId) => {
        socket.emit('join-room', { roomId })
        navigate(`/room/${roomId}`)
    }

    const leaveRoom = (roomId) => {
        socket.emit('leave-room', { roomId })
        navigate('/')
    }

    const data = {clientCount, changeClientData, rooms, game, createRoom, joinRoom, leaveRoom}
    return <SocketContext.Provider value={data}>
        { children }
    </SocketContext.Provider>
}
export { SocketProvider }
export default SocketContext