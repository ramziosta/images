import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';

export const filePayloadExists: (req: Request, res: Response, next: NextFunction) => any = (req: any, res: any, next: any) => {
    if (!req.files) {
        return res.status(400).send('No files were uploaded. Please attach files.');
    }
    next();
};


// file size limiter middleware
const mb: number = 1;
const FILE_SIZE_LIMIT: number = mb * 1024 * 1024;

export const fileSizeLimiter = (req: any, res: any, next: any) => {
    const files = req.files;
    const filesOverTheLimit: any[] = [];

    Object.keys(files).forEach(key => {
        if (files[key].size > FILE_SIZE_LIMIT) {
            filesOverTheLimit.push(files[key].name);
        }
    });

    if (filesOverTheLimit.length > 0) {
        return res.status(400).send(`Files over the size limit: ${filesOverTheLimit.join(', ')}`);
    }

    next();
};
// file extension limiter middleware
export const fileExtensionLimiter = (req: any, res: any, next: any)  => {
    const files = req.files;
    const allowedExtensions = ['jpg', 'jpeg', 'png'];

    Object.keys(files).forEach(key => {
        const fileExtension = files[key].name.split('.').pop();
        if (!allowedExtensions.includes(fileExtension)) {
            return res.status(422).send(`Invalid file extension: ${fileExtension}`);
        }
    });

    next();
};

export const validateImageInputs = (req: Request, res: Response, next: NextFunction) => {
    const { filename, width, height }: { filename: string, width: number, height: number } = req.body;

    // Validate inputs
    if (!filename || !width || !height) {
        return res.status(400).send('Filename, width, and height are required.');
    }

    let parsedWidth: number = parseInt(String(width));
    let parsedHeight: number = parseInt(String(height));

    // Ensure the parsed values are valid numbers
    if (isNaN(parsedWidth) || isNaN(parsedHeight)) {
        return res.status(400).send('Width and height must be valid numbers.');
    }

    const inputPath: string = path.join(__dirname, '../../images', filename);
    const resizedPath: string = path.join(__dirname, '../../images/resized', filename);
    const croppedPath: string = path.join(__dirname, '../../images/cropped', filename);

    // Ensure the input file exists
    if (!fs.existsSync(inputPath)) {
        return res.status(404).send('File not found.');
    }

    // Ensure the output directory exists
    const resizedDirectory = path.dirname(resizedPath);
    if (!fs.existsSync(resizedDirectory)) {
        fs.mkdirSync(resizedDirectory, { recursive: true });
    }


    // Attach validated data to the request object for use in the controller
    req.body.parsedWidth = parsedWidth;
    req.body.parsedHeight = parsedHeight;
    req.body.inputPath = inputPath;
    req.body.outputPath = resizedPath;

    next();
};

export const validateImageCropInputs = (req: Request, res: Response, next: NextFunction) => {
    const { filename, width, height, top, left }: { filename: string, width: number, height: number, top: number, left: number } = req.body;

    // Validate inputs
    if (!filename || !width || !height || !top || !left) {
        return res.status(400).send('Filename, width, and height are required.');
    }

    let parsedWidth: number = parseInt(String(width));
    let parsedHeight: number = parseInt(String(height));
    let parsedTop: number = parseInt(String(top));
    let parsedLeft: number = parseInt(String(left));

    // Checks the parsed values are valid numbers
    if (isNaN(parsedWidth) || isNaN(parsedHeight)) {
        return res.status(400).send('Width and height must be valid numbers.');
    }

    const fileName: string = path.join(__dirname, '../../images', filename);
    const croppedPath: string  = path.join(__dirname, '../../images/cropped', filename);

    // Checks if the input file exists
    if (!fs.existsSync(fileName)) {
        return res.status(404).send('File not found.');
    }


    // Checks if the cropped directory exists
    const croppedDirectory = path.dirname(croppedPath);
    if (!fs.existsSync(croppedDirectory)) {
        fs.mkdirSync(croppedDirectory, { recursive: true });
    }

    // Attach validated data to the request object for use in the controller
    req.body.parsedWidth = parsedWidth;
    req.body.parsedHeight = parsedHeight;
    req.body.inputPath = fileName;
    req.body.croppedPath = croppedPath;
    req.body.parsedTop = parsedTop;
    req.body.parsedLeft = parsedLeft;

    next();
}