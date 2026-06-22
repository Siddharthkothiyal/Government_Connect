import { Request, Response } from 'express';
import { SchemesService } from './schemes.service';

const schemesService = new SchemesService();

export class SchemesController {
  async getAllSchemes(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const category = req.query.category as string;
    const state = req.query.state as string;
    const sortBy = (req.query.sortBy as string) || 'createdAt';
    const sortOrder = (req.query.sortOrder as 'asc' | 'desc') || 'desc';

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
    const id = parseInt(req.params.id);
    const scheme = await schemesService.getSchemeById(id);
    res.json({ success: true, data: scheme });
  }

  async getSchemesByCategory(req: Request, res: Response) {
    const category = req.params.category;
    const schemes = await schemesService.getSchemesByCategory(category);
    res.json({ success: true, data: schemes });
  }
}
