import { useEffect, useRef, useState } from "react"
import { useSockets } from "../Context/useContext"

const Chat = ({ chat, id, roomId }) => {
    const [message, setMessage] = useState('')
    const { sendMessage } = useSockets()
    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView();
    }, [chat])

    const submit = (e) => {
        e.preventDefault()
        if (!message) return

        sendMessage(roomId, message)
        setMessage('')
    }

    const renderedMessages = chat?.map((message, i) => {
        const isOwn = id === message.authorId

        const sameAuthorAsPrev = chat[i - 1] ? chat[i - 1].authorId === message.authorId : false
        const sameAuthorAsNext = chat[i + 1] ? chat[i + 1].authorId === message.authorId : false

        return <div key={i} className="item" style={{ display: 'flex', width: '100%', justifyContent: isOwn ? 'right' : 'left', flexDirection: isOwn ? 'row-reverse' : 'row', marginBottom: (sameAuthorAsPrev || sameAuthorAsNext) ? '-3px' : '8px', }}>
            {sameAuthorAsPrev && <div style={{ width: '35px', height: '35px' }}></div>}
            {!sameAuthorAsPrev && <img onError={(currImg) => currImg.target.src = 'https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg'} style={{ width: '35px', height: '35px', objectFit: 'cover' }} className="ui avatar mini image" src={message.picture} />}

            <div className="content" style={{ padding: isOwn ? '0 7px 0 0' : '0 0 0 7px', maxWidth: '70%', }} >
                {!sameAuthorAsPrev && <p className="header" style={{ textAlign: isOwn ? 'right' : 'left', margin: 0 }} > {message.author} </p>}
                <div className="description" style={{ background: isOwn ? 'rgba(0, 150, 255, .2)' : 'rgba(0, 0, 0, .1)', padding: '7px', borderRadius: '6px', width: 'fit-content', marginLeft: isOwn ? 'auto' : 0, marginRight: isOwn ? 0 : 'auto', }} >
                    { message.content }
                </div>
            </div>
        </div>
    })

    return (
        <form onSubmit={submit} style={{ width: '100%', height: '100%' }}>
            <div className="ui list" style={{ height: '90%', border: '1px solid rgba(34, 36, 38, .15)', borderRadius: '5px', padding: '7px', overflowY: 'auto' }} >
                {renderedMessages}
                <div ref={bottomRef} />
            </div>
            <div className="ui icon input" style={{ width: '100%', marginTop: '5px' }}>
                <input type="text" placeholder="Message" value={message} onChange={(e) => setMessage(e.target.value)} />
                <i onClick={submit} className="inverted circular paper plane link icon"></i>
            </div>
        </form>
    )

}

export default Chat;