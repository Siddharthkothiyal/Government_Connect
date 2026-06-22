import { Request, Response } from 'express';
import { AdminService } from './admin.service';
import { schemeCreateSchema, schemeUpdateSchema, eligibilityRuleCreateSchema } from '../../utils/validation';

const adminService = new AdminService();

export class AdminController {
  async createScheme(req: Request, res: Response) {
    const data = schemeCreateSchema.parse(req.body);
    const scheme = await adminService.createScheme(data);
    res.json({ success: true, data: scheme });
  }

  async updateScheme(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const data = schemeUpdateSchema.parse(req.body);
    const scheme = await adminService.updateScheme(id, data);
    res.json({ success: true, data: scheme });
  }

  async deleteScheme(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    await adminService.deleteScheme(id);
    res.json({ success: true, message: 'Scheme deleted successfully' });
  }

  async createEligibilityRule(req: Request, res: Response) {
    const data = eligibilityRuleCreateSchema.parse(req.body);
    const rule = await adminService.createEligibilityRule(data);
    res.json({ success: true, data: rule });
  }

  async updateEligibilityRule(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const data = eligibilityRuleCreateSchema.partial().parse(req.body);
    const rule = await adminService.updateEligibilityRule(id, data);
    res.json({ success: true, data: rule });
  }

  async deleteEligibilityRule(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    await adminService.deleteEligibilityRule(id);
    res.json({ success: true, message: 'Eligibility rule deleted successfully' });
  }
}
