import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import "dotenv/config";
import userRouter from "./routes/user.route";
import authRouter from "./routes/auth.route";
import profileRouter from "./routes/profile.route";
import jambRouter from "./routes/questions.route";
import { errorHandler, multerErrorHandler } from "./middleWares/errors.middleware";
import scoresRouter from "./routes/scores.route";
import upgradeRouter from "./routes/upgradeRequest.route";
import activationRouter from "./routes/activate.route";
import dashboardRouter from "./routes/dashboard.route";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}))
app.use("/api/accountActivation", activationRouter);
app.use("/api/auth", authRouter);
app.use("/api/dashboard", dashboardRouter)
app.use("/api/jamb", jambRouter)
app.use("/api/profile", profileRouter)
app.use("/api/scores", scoresRouter);
app.use("/api/upgradeRequests", upgradeRouter);
app.use("/api/user", userRouter)
app.use("/", (req, res) => {
    res.status(404).json("Page not found");
});
// app.use(multerErrorHandler);
app.use(errorHandler);

app.listen(3000, '0.0.0.0', () => 
    console.log("Server listening on port 3000")
);
export default app;