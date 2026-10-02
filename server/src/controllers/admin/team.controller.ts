import { Request, Response } from 'express';
import prisma from '../../config/db';

export const updateTeamImage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let imageUrl = undefined;

    if (req.file) {
      // Team images should go into their own folder or the 'players' folder
      // For consistency with the current upload middleware, we use 'players' or 'media'
      // Let's use 'media' for team hero shots to separate them from player profiles
      imageUrl = `/uploads/media/${req.file.filename}`;
    }

    const team = await prisma.team.update({
      where: { id: parseInt(id) },
      data: { imageUrl },
    });

    res.json(team);
  } catch (error) {
    console.error('Update Team Image Error:', error);
    res.status(500).json({ error: 'Failed to update team image' });
  }
};

export const getTeams = async (req: Request, res: Response) => {
  try {
    const teams = await prisma.team.findMany();
    res.json(teams);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch teams' });
  }
};
