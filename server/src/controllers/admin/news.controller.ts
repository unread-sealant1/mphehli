import { Request, Response } from 'express';
import prisma from '../../config/db';

export const getNews = async (req: Request, res: Response) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(news);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};

export const createNews = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.imageUrl = `/uploads/news/${req.file.filename}`;
    }

    const news = await prisma.news.create({
      data: {
        ...data,
        published: data.published === 'true' || data.published === true,
      },
    });
    res.status(201).json(news);
  } catch (error) {
    console.error('Create News Error:', error);
    res.status(500).json({ error: 'Failed to create news article' });
  }
};

export const updateNews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    if (req.file) {
      data.imageUrl = `/uploads/news/${req.file.filename}`;
    }

    const news = await prisma.news.update({
      where: { id: Number(id) },
      data: {
        ...data,
        published: data.published === 'true' || data.published === true,
      },
    });
    res.json(news);
  } catch (error) {
    console.error('Update News Error:', error);
    res.status(500).json({ error: 'Failed to update news article' });
  }
};

export const deleteNews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.news.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'News article deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete news article' });
  }
};
