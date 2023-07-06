/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { createContext, useCallback, useEffect, useState } from "react";
import { getRequest, postRequest } from "../utils/services";
import { io } from "socket.io-client";
import { messagesRoute, chatsRoute, getUsersRoute, localhost } from "../utils/APIRoutes";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsError, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([""]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [messageError, setMessageError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const newSocket = io(localhost);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    }
  }, [user]);

  // add online users
  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  // send message
  useEffect(() => {
    if (socket === null) return;

    const recipientId = currentChat?.members?.find((id) => id !== user?._id);

    socket.emit("sendMessage", { ...newMessage, recipientId });

  }, [newMessage]);

  // receive message and notifications
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;

      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some(id => id === res.senderId);

      if (isChatOpen) {
        setNotifications(prev => [{ ...res, isRead: true }, ...prev])
      } else {
        setNotifications(prev => [res, ...prev])
      }
    })

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    }
  }, [socket, currentChat]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(getUsersRoute);

      if (response.error) {
        return console.log("Error fetching users", response);
      }
      if (userChats) {
        const pChats = response?.filter((u) => {
          let isChatCreated = false;

          if (user?._id === u._id) return false;

          isChatCreated = userChats?.some((chat) => chat.members[0] === u._id || chat.members[1] === u._id);

          return !isChatCreated;
        });

        setPotentialChats(pChats);
      }
      setAllUsers(response)
    }
    getUsers();
  }, [userChats]);

  useEffect(() => {
    const getUserChats = async () => {
      setIsUserChatsLoading(true);
      setUserChatsError(null);

      if (user?._id) {
        const userId = user?._id;
        const response = await getRequest(`${chatsRoute}/${userId}`);

        if (response.error) {
          return setUserChatsError(response);
        }

        setUserChats(response);
      }

      setIsUserChatsLoading(false);
    }

    getUserChats();
  }, [user, notifications]);

  useEffect(() => {
    const getMessages = async () => {
      setIsMessageLoading(true);
      setMessageError(null);

      const response = await getRequest(`${messagesRoute}/${currentChat?._id}`);

      setIsMessageLoading(false);

      if (response.error) {
        return setMessageError(response);
      }

      setMessages(response);
    }

    getMessages();
  }, [currentChat]);

  const sendTextMessage = useCallback(async (textMessage, sender, currentChatId, setTextMessage) => {
    if (!textMessage) return console.log("You must type something...");

    const response = await postRequest(messagesRoute, JSON.stringify({
      chatId: currentChatId,
      senderId: sender._id,
      text: textMessage,
    }));

    if (response.error) {
      return setSendTextMessageError(response);
    }

    setNewMessage(response);
    setMessages((prev) => [...prev, response]);
    setTextMessage("");
  }, [])

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(chatsRoute, JSON.stringify({
      firstId,
      secondId
    })
    );

    if (response.error) {
      return console.log("Error creating chat", response);
    }

    setUserChats((prev) => [...prev, response]);
  }, []);

  const markAllNotificationsAsRead = useCallback((notifications) => {
    const mNotifications = notifications.map((n) => {
      return { ...n, isRead: true };
    });

    setNotifications(mNotifications);
  }, []);

  const markNotificationAsRead = useCallback((n, userChats, user, notifications) => {
    // find chat to open

    const desiredChat = userChats.find((chat) => {
      const chatMembers = [user._id, n.senderId];
      const isDesiredChat = chat?.members.everys((member) => {
        return chatMembers.includes(member);
      });

      return isDesiredChat;
    });

    // mark notification as read
    const nNotification = notifications.map(el => {
      if (n.secondId === el.secondId) {
        return { ...n, isRead: true }
      } else {
        return el;
      }
    })

    updateCurrentChat(desiredChat);
    setNotifications(nNotification);
  }, []);

  const markThisUserNotificationsAsRead = useCallback((thisUserNotifications, notifications) => {
    // mark notifications as read

    const mNotifications = notifications.map(el => {
      let notification;

      thisUserNotifications.forEach(n => {
        if (n.secondId === el.secondId) {
          notification = { ...n, isRead: true }
        } else {
          notification = el
        }
      })

      return notification;
    })

    setNotifications(mNotifications);
  }, [])

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsError,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        isMessageLoading,
        messageError,
        socket,
        currentChat,
        sendTextMessage,
        onlineUsers,
        notifications,
        allUsers,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        markThisUserNotificationsAsRead,
        newMessage
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};