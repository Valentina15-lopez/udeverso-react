import { Button } from "../../common/Button";

export const ChatButton = ({ onClick }) => {
  return (
    <div>
      <Button onClick={onClick} testId="chat-button" isLight={false}>
        Chat
      </Button>
    </div>
  );
};
