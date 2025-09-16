import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { UserProvider } from './Context/userContext'
import { SocketProvider } from './Context/socketContext'

const { createRoot } = require('react-dom/client')

const root = createRoot(document.getElementById('root'))
root.render(
    <BrowserRouter>
        <SocketProvider>
            <UserProvider>
                <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
                    <App />
                </GoogleOAuthProvider>
            </UserProvider>
        </SocketProvider>
    </BrowserRouter>
)
