"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const pino_http_1 = __importDefault(require("pino-http"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const schemes_routes_1 = __importDefault(require("./modules/schemes/schemes.routes"));
const eligibility_routes_1 = __importDefault(require("./modules/eligibility/eligibility.routes"));
const ai_routes_1 = __importDefault(require("./modules/ai/ai.routes"));
const chat_routes_1 = __importDefault(require("./modules/chat/chat.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const users_routes_1 = __importDefault(require("./modules/users/users.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
dotenv_1.default.config();
const app = (0, express_1.default)();
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: 'Too many requests' },
});
app.use((0, pino_http_1.default)());
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(limiter);
app.use(express_1.default.json());
app.use('/api/auth', auth_routes_1.default);
app.use('/api/schemes', schemes_routes_1.default);
app.use('/api/eligibility', eligibility_routes_1.default);
app.use('/api/ai', ai_routes_1.default);
app.use('/api/chat', chat_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/users', users_routes_1.default);
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Server is running' });
});
app.use(error_middleware_1.notFoundHandler);
app.use(error_middleware_1.errorHandler);
exports.default = app;
