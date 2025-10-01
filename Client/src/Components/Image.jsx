import { useEffect, useState } from "react";
import { useSockets } from "../Context/useContext";

const Image = ({ imageUrl, styles }) => {
    const { socket } = useSockets()
    const [img, setImg] = useState(null)

    useEffect(() => {
        socket.emit('get-image', imageUrl)
        socket.on('image-data', (data) => setImg(data))
        return () => socket.off('image-data')
    }, [imageUrl, socket])

    return img ? <img style={styles} src={img} alt='Error on the server' /> : <p>Loading image...</p>
}

export default Image