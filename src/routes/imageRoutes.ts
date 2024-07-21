import { Router } from 'express';
import fileUpload from 'express-fileupload';
import {
    mainPage,
    resizeImage,
    cropImage,
    uploadImage,
    downloadImage,
    watermarkImage
} from '../controllers/imageController';
import {
    filePayloadExists,
    fileExtensionLimiter,
    fileSizeLimiter,
    validateImageInputs,
    validateImageCropInputs
} from '../middleware/middleware';

const router = Router();

router.post('/upload',
    fileUpload({ createParentPath: true }),
    filePayloadExists,
    fileSizeLimiter,
    fileExtensionLimiter,
    uploadImage
);

router.post('/resize', validateImageInputs, resizeImage);
router.post('/cropped', validateImageCropInputs, cropImage);
router.get('/download/:filename', downloadImage);
router.post('/watermark',watermarkImage);
router.get('/', mainPage);

export default router;