"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const eligibility_controller_1 = require("./eligibility.controller");
const router = (0, express_1.Router)();
const eligibilityController = new eligibility_controller_1.EligibilityController();
router.post('/', (req, res) => eligibilityController.checkEligibility(req, res));
exports.default = router;
