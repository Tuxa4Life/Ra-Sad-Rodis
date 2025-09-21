const Chat = () => {
    return <form style={{ width: '100%', height: '100%' }}>
        <div style={{ height: '90%', border: '1px solid rgba(34, 36, 38, .15)', borderRadius: '3px' }}></div>
        <div class="ui icon input" style={{ width: '100%', marginTop: '5px' }}>
            <input type="text" placeholder="Message" />
            <i class="inverted circular paper plane link icon"></i>
        </div>
    </form>
}

export default Chat;