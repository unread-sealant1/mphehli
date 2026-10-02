import { Request, Response } from 'express';
import prisma from '../../config/db';

export const getFixtures = async (req: Request, res: Response) => {
  try {
    const fixtures = await prisma.fixture.findMany({
      orderBy: { date: 'asc' },
    });
    res.json(fixtures);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch fixtures' });
  }
};

export const createFixture = async (req: Request, res: Response) => {
  try {
    const fixture = await prisma.fixture.create({
      data: {
        ...req.body,
        date: new Date(req.body.date),
      },
    });
    res.status(201).json(fixture);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create fixture' });
  }
};

export const updateFixture = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const fixture = await prisma.fixture.update({
      where: { id: Number(id) },
      data: {
        ...req.body,
        date: req.body.date ? new Date(req.body.date) : undefined,
      },
    });
    res.json(fixture);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update fixture' });
  }
};

export const deleteFixture = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.fixture.delete({
      where: { id: Number(id) },
    });
    res.json({ message: 'Fixture deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete fixture' });
  }
};
