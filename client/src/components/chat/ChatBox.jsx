import { useContext, useState, useRef, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import { BsSendFill } from "react-icons/bs"

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const { currentChat, messages, isMessageLoading, sendTextMessage } = useContext(ChatContext);
  const { recipientUser } = useFetchRecipientUser(currentChat, user);
  const [textMessage, setTextMessage] = useState("");
  const scroll = useRef();

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!recipientUser) return (
    <p className="w-full text-center">No conversation selected yet...</p>
  );

  if (isMessageLoading) return (
    <p className="w-full text-center">Loading Chat...</p>
  )

  return (
    <div className="w-full flex flex-col chat-box gap-4">
      <div className="chat-header">
        <strong>{recipientUser?.name}</strong>
      </div>
      <div className="flex h-full flex-col gap-3 messages">
        {messages &&
          messages.map((message, index) => (
            <div
              className={`flex flex-col ${message?.senderId === user?._id
                ? "message flex self self-end grow-0"
                : "message flex self-start grow-0"
                }`}
              key={index}
              ref={scroll}
            >
              <span>{message.text}</span>
              <span className="message-footer">{moment(message.createdAt).calendar()}</span>
            </div>
          ))}
      </div>
      <div className="flex gap-3 chat-input grow-0">
        <InputEmoji value={textMessage} onChange={setTextMessage} fontFamily="nunito" borderColor="rgba(72, 112, 223, 0.2)" />
        <button onClick={() => sendTextMessage(textMessage, user, currentChat._id, setTextMessage)} className="send-btn flex justify-center items-center">
          <BsSendFill />
        </button>
      </div>
    </div>
  )
}
export default ChatBox