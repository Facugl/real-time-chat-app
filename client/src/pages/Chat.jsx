/* eslint-disable no-unused-vars */
import { useContext } from "react"
import { ChatContext } from "../context/ChatContext"
import UserChats from "../components/chat/UserChats";
import { AuthContext } from "../context/AuthContext";
import PotentialChats from "../components/chat/PotentialChats";
import ChatBox from "../components/chat/ChatBox";

const Chat = () => {
  const { user } = useContext(AuthContext);
  const { userChats, isUserChatsLoading, updateCurrentChat } = useContext(ChatContext);

  return (
    <div className="container">
      <PotentialChats />
      {userChats?.length < 1 ? null : (
        <div className="flex gap-4">
          <div className="messages-box grow-0 gap-3">
            {isUserChatsLoading && <p className="text-neutral-950">Loading chats...</p>}
            {userChats?.map((chat, index) => {
              return (
                <div onClick={() => updateCurrentChat(chat)} key={index}>
                  <UserChats chat={chat} user={user} />
                </div>
              )
            })
            }
          </div>
          <ChatBox />
        </div>
      )
      }
    </div>
  )
}
export default Chat