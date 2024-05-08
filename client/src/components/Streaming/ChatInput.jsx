import { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import { RoomContext } from "../../context/RoomContext";
import { UserContext } from "../../context/UserContext";
import { Button } from "../../common/Button";

export const ChatInput = () => {
  const [message, setMessage] = useState("");
  const { sendMessage } = useContext(ChatContext);
  const { userId } = useContext(UserContext);
  const { roomId } = useContext(RoomContext);
  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(message, roomId, userId);
          setMessage("");
        }}
      >
        <div className="flex">
          <textarea
            className="border rounded w-full"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <Button
            testId="send-msg-button"
            type="submit"
            className="bg-rose-400 p-2 ml-2 rounded-lg text-lg hover:bg-rose-600 text-white"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};
