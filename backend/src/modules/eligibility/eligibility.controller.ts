import { Request, Response } from 'express';
import { EligibilityService } from './eligibility.service';
import { eligibilitySchema } from '../../utils/validation';
import prisma from '../../config/prisma';

const eligibilityService = new EligibilityService();

export class EligibilityController {
  async checkEligibility(req: Request, res: Response) {
    const data = eligibilitySchema.parse(req.body);
    
    if (req.user?.id) {
      await prisma.userSearchHistory.create({
        data: {
          userId: req.user.id,
          queryData: data as any,
        },
      });
    }

    const eligibleSchemes = await eligibilityService.checkEligibility(data);
    res.json({ success: true, data: eligibleSchemes });
  }
}
