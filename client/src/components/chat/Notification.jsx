/* eslint-disable no-unused-vars */
import { useContext } from "react";
import { useState } from "react";
import { TbMessageCircle2Filled } from "react-icons/tb";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { unreadNotificationsFunc } from "../../utils/unreadNotifications";
import moment from "moment";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const { notifications, userChats, allUsers, markAllNotificationsAsRead, markNotificationAsRead } = useContext(ChatContext);

  const unreadNotifications = unreadNotificationsFunc(notifications);
  const modifiedNotifications = notifications.map((n) => {
    const sender = allUsers.find(user => user._id === n.senderId);

    return {
      ...n,
      senderName: sender?.name
    }
  })

  return (
    <div className="notifications">
      <div onClick={() => setIsOpen(!isOpen)} className="notifications-icon">
        <TbMessageCircle2Filled />
        {unreadNotifications?.length === 0 ? null : (
          <span className="notification-count">
            <span>{unreadNotifications?.length}</span>
          </span>
        )}
      </div>
      {isOpen ? (<div className="notifications-box">
        <div className="notifications-header">
          <h3>Notifications</h3>
          <div onClick={() => markAllNotificationsAsRead(notifications)} className="mark-as-read">
            Mark all as read
          </div>
        </div>
        {modifiedNotifications?.length === 0 ? (
          <span className="notification">No notification yet...</span>
        ) : null}
        {modifiedNotifications &&
          modifiedNotifications.map((n, index) => {
            return (
              <div
                onClick={() => {
                  markNotificationAsRead(n, userChats, user, notifications)
                  setIsOpen(false);
                }}
                key={index}
                className={
                  n.isRead ? "notification" : "notification not-read"
                }
              >
                <span>{`${n.senderName} sent you a new message`}</span>
                <span className="notification-time">
                  {moment(n.date).calendar()}
                </span>
              </div>
            )
          })}
      </div>) : null
      }
    </div >
  )
}

export default Notification;