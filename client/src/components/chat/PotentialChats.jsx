import { useContext } from "react";
import { AuthContext, ChatContext } from "../../context/";

const PotentialChats = () => {
  const { user } = useContext(AuthContext);
  const { potentialChats, createChat, onlineUsers } = useContext(ChatContext);

  return (
    <>
      <div className="all-users">
        {potentialChats &&
          potentialChats.map((u, index) => {
            return (
              <div onClick={() => createChat(user._id, u._id)} className="single-user" key={index}>
                {u.name}
                <span className={
                  onlineUsers?.some((user) => user?.userId === u._id) ? "user-online" : ""
                }></span>
              </div>
            )
          })}
      </div>
    </>
  )
}
export default PotentialChats