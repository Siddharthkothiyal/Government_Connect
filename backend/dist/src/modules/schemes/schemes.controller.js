"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemesController = void 0;
const schemes_service_1 = require("./schemes.service");
const transform_1 = require("../../utils/transform");
const schemesService = new schemes_service_1.SchemesService();
class SchemesController {
    getStringParam(value) {
        if (typeof value === 'string') {
            return value;
        }
        if (Array.isArray(value)) {
            const firstValue = value[0];
            return typeof firstValue === 'string' ? firstValue : undefined;
        }
        return undefined;
    }
    getNumericParam(value, fallback) {
        const parsed = Number(this.getStringParam(value));
        return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
    }
    async getAllSchemes(req, res) {
        const page = this.getNumericParam(req.query.page, 1);
        const limit = this.getNumericParam(req.query.limit, 10);
        const search = this.getStringParam(req.query.search);
        const category = this.getStringParam(req.query.category);
        const state = this.getStringParam(req.query.state);
        const sortBy = this.getStringParam(req.query.sortBy) || 'createdAt';
        const sortOrder = this.getStringParam(req.query.sortOrder) === 'asc' ? 'asc' : 'desc';
        const result = await schemesService.getAllSchemes(page, limit, search, category, state, sortBy, sortOrder);
        res.json({ success: true, data: result });
    }
    async getSchemeById(req, res) {
        const idParam = this.getStringParam(req.params.id);
        let scheme;
        if (idParam && !isNaN(Number(idParam))) {
            const id = Number(idParam);
            scheme = await schemesService.getSchemeById(id);
        }
        else {
            scheme = await schemesService.getSchemeByNameOrId(idParam || '');
        }
        if (!scheme) {
            res.status(404).json({ success: false, message: 'Scheme not found' });
            return;
        }
        const frontendScheme = (0, transform_1.toFrontendScheme)(scheme);
        res.json(frontendScheme);
    }
    async getSchemesByCategory(req, res) {
        const category = this.getStringParam(req.params.category) || '';
        const schemes = await schemesService.getSchemesByCategory(category);
        res.json({ success: true, data: schemes });
    }
}
exports.SchemesController = SchemesController;
