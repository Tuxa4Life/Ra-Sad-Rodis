import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import { getQuestion, getQuestionCount } from './scraper.js'

const app = express()
app.use(cors())
const server = http.createServer(app)
const io = new Server(server, {
    cors: { origin: '*' },
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`)
})

const rooms = {}

// TODO: kick players with same id
io.on('connection', (socket) => {
    console.log('> Client connected: ', socket.id)
    io.emit('client-count', io.engine.clientsCount)

    const idsNcount = Object.entries(rooms).map(([key, e]) => ({ // Loading already existing rooms while opening page
        name: key,
        count: e.players.length,
        maxCount: e.meta.maxPlayerCount,
    }))
    io.emit('rooms-changed', idsNcount)

    socket.on('client-data-change', ({ id, username, picture }) => {
        socket.data.id = id
        socket.data.username = username
        socket.data.picture = picture

        console.log(`Client '${socket.id}' signed as '${socket.data.username}' with ID: ${socket.data.id}`)
    })

    socket.on('disconnect', () => {
        console.log(`< Client ${socket.id} disconnected.`)
        io.emit('client-count', io.engine.clientsCount)

        for (const [roomId, room] of Object.entries(rooms)) {
            room.players = room.players.filter((p) => p.id !== socket.data.id)

            if (room.players.length === 0) {
                delete rooms[roomId]
                console.log(`Room ${roomId} deleted (no players left).`)
            }
        }

        const idsNcount = Object.entries(rooms).map(([key, e]) => ({
            name: key,
            count: e.players.length,
            maxCount: e.meta.maxPlayerCount,
        }))
        
        io.emit('rooms-changed', idsNcount)
    })

    socket.on('leave-room', ({ roomId }) => {
        console.log('Client ', socket.data.username, ' left room ', roomId)
        socket.leave(roomId)

        for (const [roomId, room] of Object.entries(rooms)) {
            room.players = room.players.filter((p) => p.id !== socket.data.id)

            if (room.players.length === 0) {
                delete rooms[roomId]
                console.log(`Room ${roomId} deleted (no players left).`)
            }
        }

        const idsNcount = Object.entries(rooms).map(([key, e]) => ({
            name: key,
            count: e.players.length,
            maxCount: e.meta.maxPlayerCount,
        }))

        io.emit('rooms-changed', idsNcount)
        io.to(roomId).emit('game-state', rooms[roomId])
    })

    socket.on('create-room', ({ roomId, count, time }) => {
        if (!rooms[roomId]) {
            rooms[roomId] = {
                id: roomId,
                players: [],
                guesser: 0,
                answers: [],
                guesses: 0,
                round: 0,
                meta: {
                    maxPlayerCount: count,
                    maxTime: time,
                },
                question: {
                    id: 0,
                    question: '',
                    answer: '',
                    explanation: '',
                },
                chat: [],
            }
        }

        if (!rooms[roomId].players.find((player) => player.id === socket.data.id)) {
            rooms[roomId].players.push({
                id: socket.data.id,
                username: socket.data.username,
                picture: socket.data.picture,
            })
        }

        socket.join(roomId)

        console.log('Room created:')
        console.log(rooms[roomId])

        const idsNcount = Object.entries(rooms).map(([key, e]) => ({
            name: key,
            count: e.players.length,
            maxCount: e.meta.maxPlayerCount,
        }))

        io.emit('rooms-changed', idsNcount)
        io.to(roomId).emit('game-state', rooms[roomId])

    })

    socket.on('join-room', ({ roomId }) => {
        if (!rooms[roomId].players.find((player) => player.id === socket.data.id)) {
            rooms[roomId].players.push({
                id: socket.data.id,
                username: socket.data.username,
                picture: socket.data.picture,
            })

            console.log(socket.data.username, 'joined room', roomId)
            socket.join(roomId)

            const idsNcount = Object.entries(rooms).map(([key, e]) => ({
                name: key,
                count: e.players.length,
                maxCount: e.meta.maxPlayerCount,
            }))

            io.emit('rooms-changed', idsNcount)
            io.to(roomId).emit('game-state', rooms[roomId])
        }
    })

    socket.on('chat-message', ({roomId, authorId, author, content, picture}) => {
        rooms[roomId].chat.push({
            authorId, author, content, picture
        })

        io.to(roomId).emit('game-state', rooms[roomId])
    })

    socket.on('game-start', (roomId) => {
        io.to(roomId).emit('enter-game', roomId)
    })

    socket.on('fetch-question', async (roomId) => {
        const questionCount = await getQuestionCount()
        const questionData = await getQuestion(Math.floor(Math.random() * (questionCount - 1) + 1))

        const game = rooms[roomId]
        game.question = questionData
        game.round ++
        game.guesser = game.guesser + 1 === game.players.length ? 0 : game.guesser + 1

        console.log(rooms[roomId])
        io.to(roomId).emit('game-state', rooms[roomId])
    })
})
