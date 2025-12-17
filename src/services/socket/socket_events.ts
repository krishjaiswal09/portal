// src/services/socket/socket_events.ts
import { Socket } from "socket.io-client";

// ---------- RESOURCE EVENTS ----------
export const emitNewResource = (socket: Socket, resource: any) => {
  socket.emit("newResource", resource);
};

export const onNewResource = (socket: Socket, callback: (resource: any) => void) => {
  socket.on("newResource", callback);
};

export const offNewResource = (socket: Socket) => {
  socket.off("newResource");
};

// ---------- CONVERSATION EVENTS ----------
export const emitCreateConversation = (socket: Socket, data: { title?: string; isGroup: boolean; participantIds: string[] }) => {
  socket.emit("createConversation", data);
};

export const onConversationCreated = (socket: Socket, callback: (conversation: any) => void) => {
  socket.on("conversationCreated", callback);
};

export const offConversationCreated = (socket: Socket) => {
  socket.off("conversationCreated");
};

// ---------- MESSAGE EVENTS ----------
export const emitSendMessage = (socket: Socket, data: { conversationId: string; senderId: string; message: string; media_url?: string; messageType: "text" | "image" | "video" | "file" }) => {
  socket.emit("sendMessage", data);
};

export const onNewMessage = (socket: Socket, callback: (message: any) => void) => {
  socket.on("newMessage", callback);
};

export const offNewMessage = (socket: Socket) => {
  socket.off("newMessage");
};

// ---------- JOIN CONVERSATION ----------
export const emitJoinConversation = (socket: Socket, data: { conversationId: string; userId: string }) => {
  socket.emit("joinConversation", data);
};
