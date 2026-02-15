"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
console.log("App Module Initialized");
const nasaRoutes_1 = __importDefault(require("./routes/nasaRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const missionRoutes_1 = __importDefault(require("./routes/missionRoutes"));
const isroRoutes_1 = __importDefault(require("./routes/isroRoutes"));
const marsRoutes_1 = __importDefault(require("./routes/marsRoutes"));
const spaceWeatherRoutes_1 = __importDefault(require("./routes/spaceWeatherRoutes"));
const osdrRoutes_1 = __importDefault(require("./routes/osdrRoutes"));
const nasaMediaRoutes_1 = __importDefault(require("./routes/nasaMediaRoutes"));
const apodRoutes_1 = __importDefault(require("./routes/apodRoutes"));
const neoRoutes_1 = __importDefault(require("./routes/neoRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const techTransferController_1 = require("./controllers/techTransferController");
const app = (0, express_1.default)();
// Middleware
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://astro-view-beta.vercel.app'
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            console.log('Blocked by CORS:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
// Routes
console.log("Registering TechTransfer route at /api/tech-transfer");
app.get("/api/tech-transfer", (req, res, next) => {
    console.log(`[Route Check] Hit /api/tech-transfer with query:`, req.query);
    next();
}, techTransferController_1.getTechTransferData);
app.get("/api/test-route", (req, res) => res.json({ message: "Routing is working" }));
app.use("/api/auth", authRoutes_1.default);
app.use("/api/nasa", nasaRoutes_1.default);
app.use("/api/missions", missionRoutes_1.default);
app.use("/api/isro", isroRoutes_1.default);
app.use("/api/mars", marsRoutes_1.default);
app.use("/api/space-weather", spaceWeatherRoutes_1.default);
app.use("/api/osdr", osdrRoutes_1.default);
app.use("/api/nasa-media", nasaMediaRoutes_1.default);
app.use("/api/apod", apodRoutes_1.default);
app.use("/api/neo", neoRoutes_1.default);
app.use("/api/chat", chatRoutes_1.default);
app.get("/", (req, res) => {
    res.send("AstroView API is running");
});
exports.default = app;
