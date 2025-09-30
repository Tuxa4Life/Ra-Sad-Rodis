import { useState, useEffect } from 'react'

const Timer = ({ time, roundState, roundOver }) => {
    const [seconds, setSeconds] = useState(time)

    useEffect(() => {
        setSeconds(time)

        let interval
        if (roundState) {
            interval = setInterval(() => {
                setSeconds(prev => {
                    if (prev <= 1) {
                        clearInterval(interval)
                        roundOver()
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }

        return () => clearInterval(interval)
    }, [time, roundState])

    return <h1>{seconds}</h1>
}

export default Timer