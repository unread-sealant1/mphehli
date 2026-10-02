import { Request, Response } from 'express';
import prisma from '../../config/db';

// Extend the Express Request type to include multer's file property
interface MulterRequest extends Request {
  file?: any;
}

export const getPlayers = async (req: Request, res: Response) => {
  try {
    const players = await prisma.player.findMany();
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch players' });
  }
};

export const createPlayer = async (req: MulterRequest, res: Response) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.imageUrl = `/uploads/players/${req.file.filename}`;
    }

    const player = await prisma.player.create({
      data: {
        ...data,
        number: data.number ? parseInt(data.number as any) : undefined,
      },
    });
    res.status(201).json(player);
  } catch (error) {
    console.error('Create Player Error:', error);
    res.status(500).json({ error: 'Failed to create player' });
  }
};

export const updatePlayer = async (req: MulterRequest, res: Response) => {
  try {
    const { id } = req.params;
    const data = { ...req.body };
    if (req.file) {
      data.imageUrl = `/uploads/players/${req.file.filename}`;
    }

    const player = await prisma.player.update({
      where: { id: Number(id) },
      data: {
        ...data,
        number: data.number ? parseInt(data.number as any) : undefined,
      },
    });
    res.json(player);
  } catch (error) {
    console.error('Update Player Error:', error);
    res.status(500).json({ error: 'Failed to update player' });
  }
};

export const deletePlayer = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.player.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete player' });
  }
};
