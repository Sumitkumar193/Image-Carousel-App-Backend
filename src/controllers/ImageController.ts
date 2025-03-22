import { Request, Response } from 'express';
import fs from 'fs';
import path from 'node:path';
import prisma from '../database/Prisma';
import ApiException from '../errors/ApiException';

export async function GetImages(req: Request, res: Response) {
  try {
    const { pagination } = req.body;
    const { page, limit, offset } = pagination;
    const images = await prisma.image.paginate({
      select: {
        id: true,
        title: true,
        description: true,
        url: true,
        order: true,
        createdAt: true,
      },
      orderBy: [
        {
          order: 'asc',
        },
        {
          createdAt: 'desc',
        },
      ],
      page,
      limit,
      offset,
    });
    return res.status(200).json({ success: true, images });
  } catch (error) {
    if (error instanceof ApiException) {
      return res.status(error.status).json({ message: error.message });
    }
    throw error;
  }
}

export async function reOrderImage(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { order } = req.body;
    const newOrder = parseInt(order, 10);

    if (Number.isNaN(newOrder)) {
      throw new ApiException('Order must be a number', 400);
    }

    const currentImage = await prisma.image.findUnique({
      where: { id },
      select: { order: true },
    });

    if (!currentImage) {
      throw new ApiException('Image not found', 404);
    }

    const currentOrder = currentImage.order;

    // No change needed if the order is the same
    if (currentOrder === newOrder) {
      const image = await prisma.image.findUnique({
        where: { id },
      });
      return res.status(200).json({ success: true, image });
    }

    // Moving up in the list (to a lower order number)
    if (newOrder < currentOrder) {
      await prisma.image.updateMany({
        where: {
          order: {
            gte: newOrder,
            lt: currentOrder,
          },
        },
        data: {
          order: {
            increment: 1,
          },
        },
      });
    }
    // Moving down in the list (to a higher order number)
    else {
      await prisma.image.updateMany({
        where: {
          order: {
            gt: currentOrder,
            lte: newOrder,
          },
        },
        data: {
          order: {
            decrement: 1,
          },
        },
      });
    }

    // Update the target image order
    const image = await prisma.image.update({
      where: { id },
      data: {
        order: newOrder,
      },
    });

    return res.status(200).json({ success: true, image });
  } catch (error) {
    if (error instanceof ApiException) {
      return res.status(error.status).json({ message: error.message });
    }
    throw error;
  }
}

export async function createImage(req: Request, res: Response) {
  try {
    const { file } = req;
    const { title, description } = req.body;

    if (!file) {
      throw new ApiException('Image file is required', 400);
    }

    await prisma.image.updateMany({
      data: {
        order: {
          increment: 1,
        },
      },
    });

    const image = await prisma.image.create({
      data: {
        title,
        description,
        url: `/uploads/${file.filename}`,
        order: 0,
      },
    });

    return res.status(200).json({ success: true, image });
  } catch (error) {
    if (error instanceof ApiException) {
      return res.status(error.status).json({ message: error.message });
    }
    throw error;
  }
}

export async function DeleteImage(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const imageExist = await prisma.image.count({
      where: { id },
    });

    if (!imageExist) {
      throw new ApiException('Image not found', 404);
    }

    const deletedImage = await prisma.image.delete({
      where: { id },
      select: {
        url: true,
      },
    });

    if (fs.existsSync(path.join(__dirname, '../../public/', deletedImage.url))) {
      fs.unlinkSync(path.join(__dirname, '../../public/', deletedImage.url));
    }
    
    return res.status(200).json({ success: true, message: 'Image deleted' });
  } catch (error) {
    if (error instanceof ApiException) {
      return res
        .status(error.status)
        .json({ success: false, message: error.message });
    }
    throw error;
  }
}
