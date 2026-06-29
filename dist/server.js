"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app_1 = __importDefault(require("./app"));
const server = http_1.default.createServer(app_1.default);
const port = process.env.PORT || 5000;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*"
    }
});
const onlineUsers = new Map();
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
        if (u.role === "user")
            users++;
        if (u.role === "admin")
            admins++;
        if (u.role === "master")
            masters++;
    });
    io.emit("activeUsers", {
        users,
        admins,
        masters,
        total: users + admins + masters
    });
};
server.listen(port, () => {
    console.log("Server running on port", port);
});
//# sourceMappingURL=server.js.map