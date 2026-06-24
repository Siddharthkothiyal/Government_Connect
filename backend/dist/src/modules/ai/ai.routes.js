"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ai_controller_1 = require("./ai.controller");
const router = (0, express_1.Router)();
const aiController = new ai_controller_1.AIController();
router.post('/explain', (req, res) => aiController.explainScheme(req, res));
exports.default = router;
