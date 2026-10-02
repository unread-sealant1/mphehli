import { Request, Response } from 'express';
import prisma from '../../config/db';

export const getAssets = async (req: Request, res: Response) => {
  try {
    const assets = await prisma.siteAsset.findMany();
    res.json(assets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch site assets' });
  }
};

export const updateAsset = async (req: Request, res: Response) => {
  try {
    const { key, altText } = req.body;
    if (!key) return res.status(400).json({ error: 'Asset key is required' });

    let url = '';
    if (req.file) {
      // Use the 'settings' folder for general site assets
      url = `/uploads/settings/${req.file.filename}`;
    }

    const asset = await prisma.siteAsset.upsert({
      where: { key },
      update: {
        url: url || undefined,
        altText: altText || undefined,
      },
      create: {
        key,
        url: url || '',
        altText: altText || '',
      },
    });

    res.json(asset);
  } catch (error) {
    console.error('Update Asset Error:', error);
    res.status(500).json({ error: 'Failed to update site asset' });
  }
};
