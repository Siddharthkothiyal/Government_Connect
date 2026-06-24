import { Request, Response } from 'express';
import { SchemesService } from './schemes.service';

const schemesService = new SchemesService();

export class SchemesController {
  private getStringParam(value: unknown) {
    if (typeof value === 'string') {
      return value;
    }

    if (Array.isArray(value)) {
      const firstValue = value[0];
      return typeof firstValue === 'string' ? firstValue : undefined;
    }

    return undefined;
  }

  private getNumericParam(value: unknown, fallback: number) {
    const parsed = Number(this.getStringParam(value));
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  }

  async getAllSchemes(req: Request, res: Response) {
    const page = this.getNumericParam(req.query.page, 1);
    const limit = this.getNumericParam(req.query.limit, 10);
    const search = this.getStringParam(req.query.search);
    const category = this.getStringParam(req.query.category);
    const state = this.getStringParam(req.query.state);
    const sortBy = this.getStringParam(req.query.sortBy) || 'createdAt';
    const sortOrder = this.getStringParam(req.query.sortOrder) === 'asc' ? 'asc' : 'desc';

    const result = await schemesService.getAllSchemes(
      page,
      limit,
      search,
      category,
      state,
      sortBy,
      sortOrder
    );

    res.json({ success: true, data: result });
  }

  async getSchemeById(req: Request, res: Response) {
    const id = this.getNumericParam(req.params.id, 0);
    const scheme = await schemesService.getSchemeById(id);
    res.json({ success: true, data: scheme });
  }

  async getSchemesByCategory(req: Request, res: Response) {
    const category = this.getStringParam(req.params.category) || '';
    const schemes = await schemesService.getSchemesByCategory(category);
    res.json({ success: true, data: schemes });
  }
}
