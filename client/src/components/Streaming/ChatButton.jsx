import { Button } from "../../common/Button";

export const ChatButton = ({ onClick }) => {
  return (
    <Button onClick={onClick} testId="chat-button">
      Chat
    </Button>
  );
};
