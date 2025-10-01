import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from 'socket.io-client'

const socket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000')

const SocketContext = createContext()
const SocketProvider = ({ children }) => {
    const [clientCount, setClientCount] = useState(0)
    const [rooms, setRooms] = useState([])
    const [game, setGame] = useState([])
    const [roundState, setRoundState] = useState(false)

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

        socket.on('enter-room', (roomId) => {
            navigate(`/room/${roomId}`)

        })

        socket.on('enter-game', (roomId) => {
            navigate(`/game/${roomId}`)
        })

        socket.on('start-timer', () => setRoundState(true))
    }, [])

    const changeClientData = (id, username, picture) => {
        socket.emit('client-data-change', { id, username, picture })
    }

    const createRoom = (roomId, count, time) => { // routing is from lobby
        socket.emit('join-room', { roomId, count, time })
    }

    const joinRoom = (roomId) => {
        socket.emit('join-room', { roomId })
    }

    const leaveRoom = (roomId) => {
        socket.emit('leave-room', { roomId })
        navigate('/')
    }

    const sendMessage = (roomId, content) => {
        const { id, name, picture } = JSON.parse(localStorage.getItem('user'))
        socket.emit('chat-message', { roomId, authorId: id, author: name, content, picture })
    }

    const startGame = (roomId) => {
        socket.emit('fetch-question', roomId)
        socket.emit('game-start', roomId)
    }

    const fetchQuestion = (roomId) => {
        socket.emit('fetch-question', roomId)
    }

    const lastQuestion = (roomId) => {
        socket.emit('last-question', roomId)
    }

    const data = { socket, clientCount, changeClientData, rooms, game, createRoom, joinRoom, setRoundState, leaveRoom, sendMessage, startGame, fetchQuestion, lastQuestion, roundState }
    return <SocketContext.Provider value={data}>
        {children}
    </SocketContext.Provider>
}
export { SocketProvider }
export default SocketContext