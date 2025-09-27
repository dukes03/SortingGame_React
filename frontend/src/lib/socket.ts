// lib/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io("http://192.168.1.100:3001", {
      transports: ["websocket"],
    });
  }
  return socket;
};
