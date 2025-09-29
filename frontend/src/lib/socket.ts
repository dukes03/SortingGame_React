// lib/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io("http://http://localhost:3001", {
      transports: ["websocket"],
    });
  }
  return socket;
};
