import { useParams } from "react-router-dom";
import { useSockets, useUserContext } from "../Context/useContext";
import Chat from '../Components/Chat'
import { useEffect, useState } from "react";

const Game = () => {
    const [imageOpen, setImageOpen] = useState(false)
    const [answerOpen, setAnswerOpen] = useState(false)

    const { id } = useParams()
    const { user } = useUserContext()
    const { game, fetchQuestion, lastQuestion } = useSockets()

    // current question shortcut
    const currentQuestion = game?.questions?.[game?.qIndex]

    return <div style={{ width: '100%', display: 'flex', height: '100dvh' }}>
        <div style={{ width: '60%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <h1 style={{textAlign: 'left', width: '80%'}}>შეკითხვა #{game?.qIndex + 1}:</h1>
            {currentQuestion ? (
                <div style={{ padding: '20px', backgroundColor: 'rgba(0, 0, 0, 0.1)', borderRadius: '5px', boxShadow: 'inset 0px 0px 25px -20px #000000', width: '80%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {currentQuestion.image && (
                        <img
                            onClick={() => setImageOpen(true)}
                            style={{ height: '50dvh', width: '90%', objectFit: 'contain', cursor: 'pointer' }}
                            src={currentQuestion.image}
                            alt="ERROR LOADING QUESTION IMAGE"
                        />
                    )}
                    <h1>{currentQuestion.question}</h1>
                </div>
            ) : <p>404: შეკითხვა ვერ ამოიტვირთა</p>}

            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="ui icon action input" style={{ width: '80%', marginTop: '50px' }}>
                    <input type="text" placeholder="პასუხი" />
                    <button className="ui icon button">
                        <i className="check icon"></i>
                    </button>
                </div>
                <div style={{ width: '80%', marginTop: '20px', display: 'flex', justifyContent: 'right' }}>
                    <button onClick={() => lastQuestion(id)} className="ui button secondary inverted">უკან</button>
                    <button onClick={() => setAnswerOpen(true)} className="ui button">პასუხი</button>
                    <button onClick={() => fetchQuestion(id)} className="ui button secondary inverted">შემდეგი</button>
                </div>
            </div>
        </div>

        <div style={{ width: '35%', margin: '2%' }}>
            <Chat roomId={id} chat={game?.chat} id={user?.id} />
        </div>

        {imageOpen && currentQuestion && (
            <div onClick={() => setImageOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <img onClick={e => e.stopPropagation()} style={{ height: '95dvh', width: '95%', objectFit: 'contain' }} src={currentQuestion.image} alt="ERROR LOADING LARGE QUESTION IMAGE" />
                <i style={{ position: 'absolute', top: '30px', right: '20px', color: 'white', fontSize: '50px', cursor: 'pointer' }} className="times icon"></i>
            </div>
        )}

        {answerOpen && currentQuestion && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                <div className="ui card" style={{ width: '500px' }}>
                    <div className="content">
                        <div className="header" style={{ fontSize: '32px' }}>პასუხი: {currentQuestion.answer}</div>
                    </div>
                    {currentQuestion.explanation && (
                        <div className="content" style={{ fontSize: '20px', lineHeight: '25px' }}>
                            <div>{currentQuestion.explanation}</div>
                        </div>
                    )}
                    <div className="extra content">
                        <button onClick={() => setAnswerOpen(false)} className="ui button right floated">დახურვა</button>
                        <button onClick={() => { setAnswerOpen(false); fetchQuestion(id) }} className="ui button right floated inverted secondary">შემდეგი</button>
                    </div>
                </div>
            </div>
        )}
    </div>
}

export default Game
