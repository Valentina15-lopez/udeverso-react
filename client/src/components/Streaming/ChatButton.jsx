import { Button } from "../../common/Button";

export const ChatButton = ({ onClick }) => {
  return (
    <Button className="p-4 mx-2" onClick={onClick} testId="chat-button">
      Chat
    </Button>
  );
};
