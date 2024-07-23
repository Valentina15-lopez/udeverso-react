import React, { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { VideoPlayer } from "./VideoPlayer";
import { NameInput } from "../../common/Name";
import { SocketContext } from "../../context/ContexProvider";
import { ChatContext } from "../../context/ChatContext";
import { Chat } from "../../components/Streaming/Chat";
import { RoomContext } from "../../context/RoomContext";
import { ShareScreenButton } from "./ShareScreenButton";
import { ChatButton } from "./ChatButton";
import { UploadButton } from "./UploadButton";
export const Room = () => {
  const { socket } = useContext(SocketContext);
  const { roomId } = useParams();
  const { toggleChat, chat } = useContext(ChatContext);
  const {
    stream,
    screenStream,
    peers,
    shareScreen,
    screenSharingId,
    setRoomId,
  } = useContext(RoomContext);
  const { userName, userId } = useContext(UserContext);
  const { id } = useParams();
  useEffect(() => {
    setRoomId(roomId || "");
  }, [roomId, setRoomId]);

  const screenSharingVideo =
    screenSharingId === userId ? screenStream : peers[screenSharingId]?.stream;

  const { [screenSharingId]: sharing, ...peersToShow } = peers;

  useEffect(() => {
    if (stream)
      socket.emit("join-room", { roomId: roomId, peerId: userId, userName });
  }, [id, userId, stream, userName]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex grow">
        {screenSharingVideo && (
          <div className="w-full pr-4">
            <VideoPlayer stream={screenSharingVideo} />
          </div>
        )}
        <div
          className={`grid gap-4 ${
            screenSharingVideo ? "grid-cols-1" : "grid-cols-3"
          }`}
        >
          {screenSharingId !== userId && (
            <div>
              <VideoPlayer stream={stream} isOwnStream={true} />
              <NameInput />
            </div>
          )}

          {Object.values(peersToShow)
            .filter((peer) => !!peer.stream)
            .map((peer) => (
              <div key={peer.peerId}>
                <VideoPlayer stream={peer.stream} isOwnStream={false} />
                <div>{peer.userName}</div>
              </div>
            ))}
        </div>
        {chat.isChatOpen && <Chat />}
      </div>
      <div className="fixed bottom-0 right-0 mr-16 mb-16 gap-3">
        <div className="flex gap-3">
          <ChatButton onClick={toggleChat} />
          <UploadButton />
        </div>
      </div>
    </div>
  );
};

export default Room;
