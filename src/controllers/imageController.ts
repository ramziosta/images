import {Request, Response} from 'express';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';


export const mainPage = async (req: Request, res: Response) => {
    try {
        const filePath = path.join(__dirname, '../public/index.html');
        console.log('File path:', filePath);

        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                if (!res.headersSent) {
                    res.sendStatus(500); // Send a 500 status code if there's an error
                }
            } else {
                console.log('main page');
            }
        });
    } catch (err) {
        console.error('Catch error:', err);
        if (!res.headersSent) {
            res.sendStatus(500); // Send a 500 status code if there's an error
        }
    }
};

export const uploadImage = async (req: Request, res: Response) => {
    const files = req.files as { [key: string]: any };
    console.log(files);

    Object.keys(files).forEach(key => {
        const imagePath: string = path.join(__dirname, '../../images', files[key].name);
        files[key].mv(imagePath, (err: Error) => {
            if (err) {
                console.error('Error moving file:', err);
            }
        })
    })
    return res.json({status: 'Uploaded', message: `Image Uploaded, ${Object.keys(files).length}`});
};


// Resize an image
export const resizeImage = async (req: Request, res: Response) => {
    const { inputPath, outputPath, parsedWidth, parsedHeight } = req.body;

    try {
        await sharp(inputPath)
            .resize({ width: parsedWidth, height: parsedHeight })
            .toFile(outputPath);
        res.status(200).send({ message: 'Image resized successfully.', filename: req.body.filename });
    } catch (error) {
        console.error('Error resizing image:', error);
        res.status(500).send('Error resizing image.');
    }
};

export const cropImage = async (req: Request, res: Response) => {
    const { inputPath, croppedPath, parsedWidth, parsedHeight, parsedLeft, parsedTop } = req.body;

    try {
        await sharp(inputPath)
            .extract({ width: parsedWidth, height: parsedHeight, left: parsedLeft, top: parsedTop })
            .toFile(path.join(croppedPath));
        res.status(200).send({ message: 'Image cropped successfully.', inputPath });
    } catch (error) {
        res.status(500).send('Error cropping image.');
    }
};


export const downloadImage = (req: Request, res: Response) => {
    const filename: string = req.params.filename;
    const filePath: string = path.join('images', filename);
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).send('File not found.');
    }
};


