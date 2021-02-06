import React from "react";
import { withRouter } from "react-router-dom";


function ChannelPage({ match, socket }) {
    const channelId = match.params.id;
    const [messages, setMessages] = React.useState([]);
    const messageRef = React.useRef();
    const [userId, setUserId] = React.useState("");

    const sendMessage = () => {
        if (socket) {
            socket.emit("channelMessage", {
                channelId,
                message: messageRef.current.value,
            });

            messageRef.current.value = "";
        }
    };

    React.useEffect(() => {
        const token = sessionStorage.getItem("Chat_Token");
        if (token) {
            const payload = JSON.parse(atob(token.split(".")[1]));
            setUserId(payload.id);
        }
        if (socket) {
            socket.on("newMessage", (message) => {
                const newMessages = [...messages, message];
                setMessages(newMessages);
            });
        }
        //eslint-disable-next-line
    }, [messages]);

    React.useEffect(() => {
        if (socket) {
            socket.emit("joinRoom", {
                channelId,
            });
        }

        return () => {
            //Component Unmount
            if (socket) {
                socket.emit("leaveRoom", {
                    channelId,
                });
            }
        };
        //eslint-disable-next-line
    }, []);

    return (
        <div className="channelPage">
            <div className="channelSection">
                <div className="cardHeader">{channelId}</div>
                <div className="channelContent">
                    {messages.map((message, i) => (
                        <div key={i} className="message">
                            <span
                                className={userId === message.userId ? "ownMessage" : "otherMessage"}
                            >
                                {message.name}:
                            </span>{" "}
                            {message.message}
                        </div>
                    ))}
                </div>
                <div className="channelActions">
                    <div>
                        <textarea
                            type="text"
                            rows="5"
                            name="message"
                            placeholder="Say something!"
                            ref={messageRef}></textarea>
                    </div>
                    <div>
                        <button className="join" onClick={sendMessage}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default withRouter(ChannelPage);