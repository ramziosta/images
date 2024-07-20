import { Router } from 'express';
import multer from 'multer';
import { mainPage, uploadImage, resizeImage, cropImage, downloadImage } from '../controllers/imageController';

const router: Router = Router();
const upload = multer({ dest: 'images/' });

router.post('/upload', upload.single('image'), uploadImage);
router.post('/resize', resizeImage);
router.post('/crop', cropImage);
router.get('/download/:filename', downloadImage);
router.get('/', mainPage);

export default router;