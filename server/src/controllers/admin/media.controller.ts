import { Request, Response } from 'express';
import prisma from '../../config/db';

export const getMedia = async (req: Request, res: Response) => {
  try {
    const media = await prisma.media.findMany({
      orderBy: { uploadedAt: 'desc' },
    });
    res.json(media);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch media' });
  }
};

export const createMedia = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.url = `/uploads/media/${req.file.filename}`;
    }

    const medium = await prisma.media.create({
      data: data,
    });
    res.status(201).json(medium);
  } catch (error) {
    console.error('Create Media Error:', error);
    res.status(500).json({ error: 'Failed to create media record' });
  }
};

export const deleteMedia = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.media.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Media record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete media record' });
  }
};
