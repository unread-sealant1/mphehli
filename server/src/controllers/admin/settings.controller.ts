import { Request, Response } from 'express';
import prisma from '../../config/db';

export const getSettings = async (req: Request, res: Response) => {
  try {
    const settings = await prisma.clubSettings.findFirst();
    if (!settings) {
      // Create default settings if none exist
      const newSettings = await prisma.clubSettings.create({
        data: {
          clubName: 'MPHEHLI ALL STARS',
          contactEmail: 'info@mphehliallstarsfc.com',
        },
      });
      return res.json(newSettings);
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.logoUrl = `/uploads/settings/${req.file.filename}`;
    }

    const settings = await prisma.clubSettings.upsert({
      where: { id: 1 },
      update: data,
      create: {
        ...data,
        id: 1,
      },
    });
    res.json(settings);
  } catch (error) {
    console.error('Update Settings Error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};
