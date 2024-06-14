import { useContext } from "react";
import { RoomContext } from "../../context/RoomContext";
import { UserContext } from "../../context/UserContext";

export const ChatBubble = ({ message }) => {
  const { peers } = useContext(RoomContext);
  const { userId } = useContext(UserContext);
  const author = message.author && peers[message.author].userName;
  const userName = author || "Anonimus";
  const isSelf = message.author === userId;
  const time = new Date(message.timestamp).toLocaleTimeString();
  return (
    <div className={`m-2 flex ${isSelf ? "justify-end" : "justify-start"}`}>
      <div className="flex flex-col">
        <div
          className={`inline-block py-2 px-4 rounded ${
            isSelf ? "bg-blue-200" : "bg-blue-400"
          }`}
        >
          {message.content}
          <div className="text-xs opacity-50">{time}</div>
        </div>
        <div className="text-md">{isSelf ? "You" : userName}</div>
      </div>
    </div>
  );
};
