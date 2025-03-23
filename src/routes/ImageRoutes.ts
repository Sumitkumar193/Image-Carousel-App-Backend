import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {
  GetImages,
  reOrderImage,
  createImage,
  DeleteImage,
} from '../controllers/ImageController';
import Paginate from '../middlewares/Pagination';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const savePath = path.join(__dirname, '../../public/uploads');
    if (!fs.existsSync(savePath)) {
      fs.mkdirSync(savePath, { recursive: true });
    }
    cb(null, savePath);
  },
  filename: (req, file, cb) => {
    cb(null, crypto.randomBytes(16).toString('hex') + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
      return cb(new Error('Only image files are allowed!'));
    }
    return cb(null, true);
  },
});

const ImageRouter = Router();

ImageRouter.get('/', Paginate, GetImages);
ImageRouter.put('/:id', reOrderImage);
ImageRouter.post('/', upload.single('image'), createImage);
ImageRouter.delete('/:id', DeleteImage);

export default ImageRouter;
