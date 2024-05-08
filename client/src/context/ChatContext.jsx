import { createContext, useEffect, useReducer, useContext } from "react";
import { chatReducer } from "../reducers/chatReducer";
import {
  addHistoryAction,
  addMessageAction,
  toggleChatAction,
} from "../reducers/chatAction";
import { SocketContext } from "../../src/context/ContexProvider";

// Creación del contexto del chat
export const ChatContext = createContext({
  chat: {
    messages: [],
    isChatOpen: false,
  },
  sendMessage: (message, roomId, author) => {},
  toggleChat: () => {},
});
export const ChatProvider = ({ children }) => {
  const { socket } = useContext(SocketContext);

  const [chat, chatDispatch] = useReducer(chatReducer, {
    messages: [],
    isChatOpen: false,
  });

  const sendMessage = (message, roomId, author) => {
    const messageData = {
      content: message,
      timestamp: new Date().getTime(),
      author,
    };
    chatDispatch(addMessageAction(messageData));

    socket.emit("send-message", roomId, messageData);
  };

  const addMessage = (message) => {
    chatDispatch(addMessageAction(message));
  };

  const addHistory = (messages) => {
    chatDispatch(addHistoryAction(messages));
  };

  const toggleChat = () => {
    chatDispatch(toggleChatAction(!chat.isChatOpen));
  };
  useEffect(() => {
    socket.on("add-message", addMessage);
    socket.on("get-messages", addHistory);
    return () => {
      socket.off("add-message", addMessage);
      socket.off("get-messages", addHistory);
    };
  }, []);
  return (
    <ChatContext.Provider
      value={{
        chat,
        sendMessage,
        toggleChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
