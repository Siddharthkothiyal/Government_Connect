import { Request, Response } from 'express';
import prisma from '../../config/prisma';

export class UsersController {
  async saveScheme(req: Request, res: Response) {
    const schemeId = parseInt(req.params.schemeId);
    const saved = await prisma.savedScheme.create({
      data: {
        userId: req.user!.id,
        schemeId,
      },
      include: { scheme: true },
    });
    res.json({ success: true, data: saved });
  }

  async unsaveScheme(req: Request, res: Response) {
    const schemeId = parseInt(req.params.schemeId);
    await prisma.savedScheme.delete({
      where: {
        userId_schemeId: {
          userId: req.user!.id,
          schemeId,
        },
      },
    });
    res.json({ success: true, message: 'Scheme removed from saved' });
  }

  async getSavedSchemes(req: Request, res: Response) {
    const saved = await prisma.savedScheme.findMany({
      where: { userId: req.user!.id },
      include: { scheme: { include: { documents: true, eligibilityRules: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: saved });
  }

  async getSearchHistory(req: Request, res: Response) {
    const history = await prisma.userSearchHistory.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: history });
  }
}
