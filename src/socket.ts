import http from "http";
import { Server } from "socket.io";
import app from "./server";

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

type OnlineUser = {
    userId: number;
    role: "user" | "admin" | "master";
}

const onlineUsers = new Map<string, OnlineUser>();

io.on("connection", socket => {
    console.log("User connected:", socket.id);

    console.log("Handshake auth:", socket.handshake.auth);
    const { userId, role } = socket.handshake.auth;

    if (userId && role) {
        onlineUsers.set(socket.id, { userId, role });
    }

    emitUserStats();

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);

        onlineUsers.delete(socket.id);
        emitUserStats();
    });
});

const emitUserStats = () => {
    let users = 0;
    let admins = 0;
    let masters = 0;

    onlineUsers.forEach(u => {
        if (u.role === "user") users++;
        if (u.role === "admin") admins++;
        if (u.role === "master") masters++;
    });

    io.emit("activeUsers", {
        users,
        admins,
        masters,
        total: users + admins + masters
    })
}

server.listen(5000, () => {
    console.log("Server running.");
});