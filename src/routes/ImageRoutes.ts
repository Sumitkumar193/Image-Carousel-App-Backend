import { Router } from 'express';
import multer from 'multer';
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
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${crypto.randomBytes(16).toString('hex')}-${file.originalname}`);
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
