import { Request, Response } from 'express';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import multer, { Multer } from 'multer';

// Define storage configuration with typed properties
interface StorageConfig {
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => void;
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => void;
}

const storage: multer.StorageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../images'));
    },
    filename: function (req: Request, file, cb) {
        cb(null, file.originalname); // Use original file name
    }
});

export const upload: Multer = multer({ storage }); // Explicitly define upload type

// Define request body schema for functions using it
interface ImageResizeBody {
    filename: string;
    width: number;
    height: number;
}

interface ImageCropBody {
    filename: string;
    width: number;
    height: number;
    left: number;
    top: number;
}

export const uploadImage = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.status(200).send({ filename: req.file.originalname });
};

export const resizeImage = async (req: Request<ImageResizeBody>, res: Response) => {
    const { filename, width, height } = req.body;
    let parsedWidth = parseInt(String(width));
    let parsedHeight = parseInt(String(height));
    try {
        await sharp(path.join('images', filename))
            .resize({ width: parsedWidth, height: parsedHeight })
            .toFile(path.join('processed', filename));
        res.status(200).send({ message: 'Image resized successfully.', filename });
    } catch (error) {
        res.status(500).send('Error resizing image.');
    }
};

export const cropImage = async (req: Request<{}, {}, ImageCropBody>, res: Response) => {
    const { filename, width, height, left, top } = req.body;

    let parsedWidth = parseInt(String(width));
    let parsedHeight = parseInt(String(height));
    let parsedLeft = parseInt(String(left));
    let parsedTop = parseInt(String(top));

    try {
        await sharp(path.join('images', filename))
            .extract({ width: parsedWidth, height: parsedHeight, left: parsedLeft, top: parsedTop })
            .toFile(path.join('processed', filename));
        res.status(200).send({ message: 'Image cropped successfully.', filename });
    } catch (error) {
        res.status(500).send('Error cropping image.');
    }
};
export const downloadImage = (req: Request, res: Response) => {
    const filename: string = req.params.filename;
    const filePath: string = path.join('processed', filename);
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).send('File not found.');
    }
};

export const mainPage = async (req: Request, res: Response) => {
    try {
        res.send('localhost:3000/images');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
};
