"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EligibilityController = void 0;
const eligibility_service_1 = require("./eligibility.service");
const validation_1 = require("../../utils/validation");
const prisma_1 = __importDefault(require("../../config/prisma"));
const eligibilityService = new eligibility_service_1.EligibilityService();
class EligibilityController {
    async checkEligibility(req, res) {
        const data = validation_1.eligibilitySchema.parse(req.body);
        if (req.user?.id) {
            await prisma_1.default.userSearchHistory.create({
                data: {
                    userId: req.user.id,
                    queryData: data,
                },
            });
        }
        const eligibleSchemes = await eligibilityService.checkEligibility(data);
        res.json({ success: true, data: eligibleSchemes });
    }
}
exports.EligibilityController = EligibilityController;
