import express from 'express';
import path from 'path';
import fs from 'fs/promises'; // Using promises for async file operations
import multer from 'multer';
import { Request, Response } from 'express'; // Define request and response types
import { requestTime, imageValidation, validationResult } from '../middleware/middleware';

const router = express.Router();

// Image upload interface
interface MulterFile {
    originalName: string;
    mimetype: string;

}

router.post(
    '/upload',
    requestTime,
    imageValidation,
    multer.single('image'),
    async (req: Request, res: Response) => {
        // Access uploaded image from req.files
        const image: MulterFile | undefined = req.files?.image;

        // Check if image was uploaded
        if (!image) {
            return res.status(400).json({ error: 'No image uploaded' });
        }

        // Get image details
        const filename = image.originalName;
        const filePath = path.join(__dirname, '../images', filename);

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Validate file type (replace with your validation logic)
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
        const ext = path.extname(filename).toLowerCase();
        if (!allowedExtensions.includes(ext)) {
            return res.status(400).json({ error: 'Invalid file type' });
        }

        // Move the uploaded file (assuming Multer is used for file uploads)
        try {
            await fs.rename(image.path, filePath); // Use fs.promises.rename for async operation
            res.status(201).send('Image uploaded successfully.');
        } catch (err) {
            console.error('Error moving file:', err);
            return res.status(500).send('Internal Server Error');
        }
    }
);


//Image resizing

//Image cropping

//Image downloading






module.exports = router;