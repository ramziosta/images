import {Request, Response} from 'express';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';


export const mainPage = async (req: Request, res: Response) => {
    try {
        const filePath: string = path.join(__dirname, '../public/index.html');
        console.log('File path:', filePath);

        res.sendFile(filePath, (err: Error) => {
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
    const { filename, parsedWidth, parsedHeight } = req.body;

    // Define input and output paths
    const inputPath: string = path.join(__dirname, '../../images', filename);
    const resizePath: string = path.join(__dirname, '../../images/resized', filename);

    try {
        // Perform resizing
        await sharp(inputPath)
            .resize({ width: parsedWidth, height: parsedHeight })
            .toFile(resizePath);

        res.sendFile(resizePath, (err: Error) => {
            if (err) {
                console.error('Error sending resized image:', err);
                res.status(500).send('Error sending resized image.');
            }
        });
    } catch (error) {
        console.error('Error resizing image:', error);
        res.status(500).send('Error resizing image.');
    }
};
export const cropImage = async (req: Request, res: Response) => {
    const { filename, width, height, left, top } = req.body;

    const parsedWidth: number = parseInt(String(width));
    const parsedHeight: number = parseInt(String(height));
    const parsedLeft: number = parseInt(String(left));
    const parsedTop: number = parseInt(String(top));

    // Define input and output paths
    const inputPath: string = path.join(__dirname, '../../images', filename);
    const croppedPath: string = path.join(__dirname, '../../images/cropped', filename);

    try {
        // Ensure the output directory exists
        const cropDir = path.dirname(croppedPath);
        if (!fs.existsSync(cropDir)) {
            fs.mkdirSync(cropDir, { recursive: true });
        }

        // Perform cropping
        await sharp(inputPath)
            .extract({ width: parsedWidth, height: parsedHeight, left: parsedLeft, top: parsedTop })
            .toFile(croppedPath);

        // Send the cropped image file
        res.sendFile(croppedPath, (err: Error) => {
            if (err) {
                console.error('Error sending cropped image:', err);
                res.status(500).send('Error sending cropped image.');
            }
        });
    } catch (error) {
        console.error('Error cropping image:', error);
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


export const greyscaleImage = async (req: Request, res: Response) => {
    const filename: string = req.body.filename;
    const filePath: string = path.join(__dirname, '../../images', filename);
    const greyscalePath: string = path.join(__dirname, '../../images/greyscale', filename);

    try {
        // Ensure the output directory exists
        const greyscaleDir: string = path.dirname(greyscalePath);
        if (!fs.existsSync(greyscaleDir)) {
            fs.mkdirSync(greyscaleDir, { recursive: true });
        }

        if (fs.existsSync(filePath)) {
            await sharp(filePath)
                .greyscale()
                .toFile(greyscalePath);

            res.sendFile(greyscalePath);
        } else {
            res.status(404).send('File not found.');
        }
    } catch (error) {
        console.error('Error applying greyscale to the image:', error);
        res.status(500).send('Error applying greyscale to the image.');
    }
};


export const blurImage = async (req: Request, res: Response) => {
    const filename: string = req.body.filename;
    const userBlurAmount: number = req.body.amount;

    const userMin: number = 1;
    const userMax: number = 10;
    const blurMin: number = 0.3;
    const blurMax: number = 1000;

    // Convert the user blur amount to the Sharp range
    const blurAmount: number = (userBlurAmount - userMin) * (blurMax - blurMin) / (userMax - userMin) + blurMin;
    // Calculate the blur value to ensure it's within the acceptable range
    const calculatedBlurAmount: number = Math.max(blurMin, Math.min(blurAmount, blurMax));

    const filePath: string = path.join(__dirname, '../../images', filename);
    const blurPath: string = path.join(__dirname, '../../images/blurred', filename);

    try {
        // Ensure the output directory exists
        const blurDir: string = path.dirname(blurPath);
        if (!fs.existsSync(blurDir)) {
            fs.mkdirSync(blurDir, { recursive: true });
        }

        if (fs.existsSync(filePath)) {
            await sharp(filePath)
                .blur(calculatedBlurAmount)
                .toFile(blurPath);

            res.sendFile(blurPath);
        } else {
            res.status(404).send('File not found.');
        }
    } catch (error) {
        console.error('Error applying blur to the image:', error);
        res.status(500).send('Error applying blur to the image.');
    }
};