import React, { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { VideoPlayer } from "./VideoPlayer";
import { NameInput } from "../../common/Name";
import { SocketContext } from "../ContexProvider";
import { RoomContext } from "../RoomContext";

export const Room = () => {
  const { socket } = useContext(SocketContext);
  const { roomId } = useParams();
  const { stream, screenStream, peers, screenSharingId, setRoomId } =
    useContext(RoomContext);
  const { userName, userId } = useContext(UserContext);

  useEffect(() => {
    if (stream)
      socket.emit("join-room", { roomId: roomId, peerId: userId, userName });
  }, [roomId, userId, stream, userName]);

  useEffect(() => {
    setRoomId(roomId || "");
  }, [roomId, setRoomId]);

  const screenSharingVideo =
    screenSharingId === userId ? screenStream : peers[screenSharingId]?.stream;

  const { [screenSharingId]: sharing, ...peersToShow } = peers;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-red-500 p-4 text-white">Room id {roomId}</div>
      <div className="flex grow">
        {screenSharingVideo && (
          <div className="w-4/5 pr-4">
            <VideoPlayer stream={screenSharingVideo} />
          </div>
        )}
        <div
          className={`grid gap-4 ${
            screenSharingVideo ? "w-1/5 grid-col-1" : "grid-cols-4"
          }`}
        >
          {screenSharingId !== userId && (
            <div>
              <VideoPlayer stream={stream} />
              <NameInput />
            </div>
          )}

          {Object.values(peersToShow)
            .filter((peer) => !!peer.stream)
            .map((peer) => (
              <div key={peer.peerId}>
                <VideoPlayer stream={peer.stream} />
                <div>{peer.userName}</div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Room;
