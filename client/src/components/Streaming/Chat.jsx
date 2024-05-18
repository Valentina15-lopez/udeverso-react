import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";

export const Chat = () => {
  const { chat, toggleChat } = useContext(ChatContext);
  const [isChatOpen, setIsChatOpen] = useState(true);

  const handleToggleChat = () => {
    setIsChatOpen(!isChatOpen);
    toggleChat();
  };

  return (
    <>
      {isChatOpen && (
        <div className="fixed bottom-0 right-0 mr-16 mb-40 z-50">
          <div className="flex flex-col h-80 max-w-sm bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex justify-between items-center p-4">
              <h2 className="text-lg font-semibold">Chat</h2>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={handleToggleChat}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 5.293a1 1 0 011.414 0L10 8.586l3.293-3.293a1 1 0 111.414 1.414L11.414 10l3.293 3.293a1 1 0 11-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 10 5.293 6.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-col flex-1 p-4 overflow-y-auto">
              {chat.messages.map((message, index) => (
                <ChatBubble
                  message={message}
                  key={
                    message.timestamp + (message?.author || "anonymous") + index
                  }
                />
              ))}
            </div>
            <div className="border-t border-gray-200 px-4 py-2">
              <ChatInput />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
