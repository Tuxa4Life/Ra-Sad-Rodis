import { createContext, useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode'
import { useSockets } from "./useContext";

const UserContext = createContext()
const UserProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [user, setUser] = useState({id: '', name: '', picture: ''})
    const { changeClientData } = useSockets()

    useEffect(() => {
        const userObj = JSON.parse(localStorage.getItem('user'))
        if (userObj) {
            setLoggedIn(true)
            setUser(userObj)
            changeClientData(userObj.id, userObj.name, userObj.picture)
        }
    }, [])

    const onLogin = (response) => {
        const { sub, name, picture } = jwtDecode(response.credential)
        localStorage.setItem('user', JSON.stringify({ id: sub, name, picture }))
        setLoggedIn(true)
        setUser(JSON.parse(localStorage.getItem('user')))

        changeClientData(sub, name, picture)
    }

    const logOut = () => {
        localStorage.clear('user')
        setUser({id: '', name: '', picture: ''})
        setLoggedIn(false)
    }

    const data = { loggedIn, user, onLogin, logOut }
    return <UserContext.Provider value={data}>
        { children }
    </UserContext.Provider>
}

export { UserProvider };
export default UserContext;