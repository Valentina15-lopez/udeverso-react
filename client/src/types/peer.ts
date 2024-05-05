import {
  ADD_ALL_PEERS,
  ADD_PEER_NAME,
  ADD_PEER_STREAM,
  REMOVE_PEER_STREAM,
} from "../reducers/peerActions";

export interface IPeer {
  userName: string;
  peerId: string;
}
export type PeerState = Record<
  string,
  { stream?: MediaStream; userName?: string; peerId: string }
>;
export type PeerAction =
  | {
      type: typeof ADD_PEER_STREAM;
      payload: { peerId: string; stream: MediaStream };
    }
  | {
      type: typeof REMOVE_PEER_STREAM;
      payload: { peerId: string };
    }
  | {
      type: typeof ADD_PEER_NAME;
      payload: { peerId: string; userName: string };
    }
  | {
      type: typeof ADD_ALL_PEERS;
      payload: {
        peers: Record<string, IPeer>;
      };
    };
