import { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { getRequest } from "../utils/services";
import { messagesRoute } from "../utils/APIRoutes";

export const useFetchLatestMessage = (chat) => {
  const { newMessage, notifications } = useContext(ChatContext);
  const [latestMessage, setLatestMessage] = useState(null);

  useEffect(() => {
    const getMessages = async () => {
      const response = await getRequest(`${messagesRoute}/${chat?._id}`);

      if (response.error) {
        return console.log("Error getting message...", response);
      }

      const lastMessage = response[response?.length - 1];

      setLatestMessage(lastMessage);
    };
    getMessages();

  }, [newMessage, notifications]);

  return { latestMessage };
};
