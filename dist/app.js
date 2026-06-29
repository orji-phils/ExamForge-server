"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const user_route_1 = __importDefault(require("./routes/user.route"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const profile_route_1 = __importDefault(require("./routes/profile.route"));
const questions_route_1 = __importDefault(require("./routes/questions.route"));
const errors_middleware_1 = require("./middleWares/errors.middleware");
const scores_route_1 = __importDefault(require("./routes/scores.route"));
const upgradeRequest_route_1 = __importDefault(require("./routes/upgradeRequest.route"));
const activate_route_1 = __importDefault(require("./routes/activate.route"));
const dashboard_route_1 = __importDefault(require("./routes/dashboard.route"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use("/api/accountActivation", activate_route_1.default);
app.use("/api/auth", auth_route_1.default);
app.use("/api/dashboard", dashboard_route_1.default);
app.use("/api/jamb", questions_route_1.default);
app.use("/api/profile", profile_route_1.default);
app.use("/api/scores", scores_route_1.default);
app.use("/api/upgradeRequests", upgradeRequest_route_1.default);
app.use("/api/user", user_route_1.default);
app.use("/", (req, res) => {
    res.status(404).json("Page not found");
});
// app.use(multerErrorHandler);
app.use(errors_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map