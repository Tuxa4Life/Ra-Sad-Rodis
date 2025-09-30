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
const questionCount = (await getQuestionCount()) || 2000

io.on('connection', (socket) => {
    console.log('> Client connected: ', socket.id)
    io.emit('client-count', io.engine.clientsCount)

    const idsNcount = Object.entries(rooms).map(([key, e]) => ({
        // Loading already existing rooms while opening page
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

    socket.on('join-room', ({ roomId, count = 6, time = 60 }) => {
        if (!rooms[roomId]) {
            rooms[roomId] = {
                id: roomId,
                players: [],
                questions: [],
                qIndex: 0,
                guesser: 0,
                guesses: 0,
                round: 0,
                chat: [],
                meta: {
                    maxPlayerCount: count,
                    maxTime: time,
                },
            }
            console.log('Room created:', rooms[roomId])
        }

        const room = rooms[roomId]
        if (room.players.length === room.meta.maxPlayerCount) return

        if (!room.players.find((p) => p.id === socket.data.id)) {
            room.players.push({
                id: socket.data.id,
                username: socket.data.username,
                picture: socket.data.picture,
            })
        }

        socket.join(roomId)

        const idsNcount = Object.entries(rooms).map(([key, e]) => ({
            name: key,
            count: e.players.length,
            maxCount: e.meta.maxPlayerCount,
        }))
        
        socket.emit('enter-room', roomId) // send client to room

        io.emit('rooms-changed', idsNcount)
        io.to(roomId).emit('game-state', room)
    })

    socket.on('chat-message', ({ roomId, authorId, author, content, picture }) => {
        rooms[roomId].chat.push({
            authorId,
            author,
            content,
            picture,
        })

        io.to(roomId).emit('game-state', rooms[roomId])
    })

    socket.on('game-start', (roomId) => {
        io.to(roomId).emit('enter-game', roomId)
    })

    socket.on('fetch-question', async (roomId) => {
        const game = rooms[roomId]
        if (!game) return

        if (game.qIndex < game.questions.length - 1) {
            game.qIndex ++
            io.to(roomId).emit('game-state', game)
            return
        }
        const usedIds = new Set(game.questions.map((q) => q.id))

        let questionId
        do {
            questionId = Math.floor(Math.random() * questionCount)
        } while (usedIds.has(questionId))

        const questionData = await getQuestion(questionId)

        game.questions.push(questionData)
        game.qIndex = game.questions.length - 1
        game.guesser = (game.guesser + 1) % game.players.length
        game.round ++

        io.to(roomId).emit('game-state', game)
    })

    socket.on('last-question', (roomId) => {
        const game = rooms[roomId]
        game.qIndex = Math.max(0, game.qIndex - 1)
        io.to(roomId).emit('game-state', game)
    })
})
