"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const admin_service_1 = require("./admin.service");
const validation_1 = require("../../utils/validation");
const adminService = new admin_service_1.AdminService();
class AdminController {
    getNumericParam(value) {
        return Number(Array.isArray(value) ? value[0] : value);
    }
    async createScheme(req, res) {
        const data = validation_1.schemeCreateSchema.parse(req.body);
        const scheme = await adminService.createScheme(data);
        res.json({ success: true, data: scheme });
    }
    async updateScheme(req, res) {
        const id = this.getNumericParam(req.params.id);
        const data = validation_1.schemeUpdateSchema.parse(req.body);
        const scheme = await adminService.updateScheme(id, data);
        res.json({ success: true, data: scheme });
    }
    async deleteScheme(req, res) {
        const id = this.getNumericParam(req.params.id);
        await adminService.deleteScheme(id);
        res.json({ success: true, message: 'Scheme deleted successfully' });
    }
    async createEligibilityRule(req, res) {
        const data = validation_1.eligibilityRuleCreateSchema.parse(req.body);
        const rule = await adminService.createEligibilityRule(data);
        res.json({ success: true, data: rule });
    }
    async updateEligibilityRule(req, res) {
        const id = this.getNumericParam(req.params.id);
        const data = validation_1.eligibilityRuleCreateSchema.partial().parse(req.body);
        const rule = await adminService.updateEligibilityRule(id, data);
        res.json({ success: true, data: rule });
    }
    async deleteEligibilityRule(req, res) {
        const id = this.getNumericParam(req.params.id);
        await adminService.deleteEligibilityRule(id);
        res.json({ success: true, message: 'Eligibility rule deleted successfully' });
    }
}
exports.AdminController = AdminController;
