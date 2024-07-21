import { Router } from 'express';
import fileUpload from 'express-fileupload';
import {
    mainPage,
    resizeImage,
    cropImage,
    uploadImage,
    downloadImage, greyscaleImage, blurImage
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
router.get('/download/images/:filename', downloadImage);
router.post('/greyscale', greyscaleImage);
router.post('/blur', blurImage);
router.get('/', mainPage);

export default router;