/* eslint-disable react/prop-types */
import { useFetchRecipientUser, useFetchLatestMessage } from "../../hooks";
import avatar from "../../assets/avatar.svg";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import moment from "moment";

const UserChats = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipientUser(chat, user);

  const { onlineUsers, notifications, markThisUserNotificationsAsRead } = useContext(ChatContext);

  const { latestMessage } = useFetchLatestMessage(chat);

  const unreadNotifications = unreadNotificationsFunc(notifications
  );
  const thisUserNotifications = unreadNotifications?.filter(n => n.senderId == recipientUser?._id)

  const isOnline = onlineUsers?.some((user) => user?.userId === recipientUser?._id);

  const truncateText = (text) => {
    let shortText = text.substring(0, 20);

    if (text.length > 20) {
      shortText = shortText + "...";
    }

    return shortText;
  };

  return (
    <div onClick={() => {
      if (thisUserNotifications?.length !== 0) {
        markThisUserNotificationsAsRead(thisUserNotifications, notifications);
      }
    }} className="flex gap-3 user-card items-center justify-between p-2" role="button">
      <div className="flex">
        <div className="me-2">
          <img src={avatar} alt="User avatar" className="h-8" />
        </div>
        <div className="text-content">
          <div className="name">{recipientUser?.name}</div>
          <div className="text">
            {latestMessage?.text && (
              <span>
                {truncateText(latestMessage?.text)}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="date">
          {moment(latestMessage?.createdAt).calendar()}
        </div>
        <div className={thisUserNotifications?.length > 0 ? "this-user-notifications" : ""}>
          {thisUserNotifications?.length > 0 ?
            thisUserNotifications?.length : ""}
        </div>
        <span className={isOnline ? "user-online" : ""}></span>
      </div>
    </div>
  )
}
export default UserChats;