import { body, ValidationChain, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Function type for requestTime middleware
                                                                                                           type RequestTimeMiddleware = (req: Request, res: Response, next: NextFunction) => void;

// Middleware to log the request start time
const requestTime: RequestTimeMiddleware = (req, res, next) => {
    console.log(`Request ${req.url} ${req.method} request made on: ${new Date()}`);
    next();
};

// Define the type for the array of validation middleware
type ImageValidationMiddleware = ValidationChain[];

const imageValidation: ImageValidationMiddleware = [
    // Check if the Image field is not empty
    body('file')
        .custom((value, { req }) => {
            if (!req.file) {
                throw new Error('Please upload an image');
            }
            return true;
        }),
    // Check if the uploaded file is an image (PNG, JPG, JPEG)
    body('file')
        .custom((value, { req }) => {
            const allowedMimeTypes: string[] = ['image/png', 'image/jpg', 'image/jpeg'];
            if (!allowedMimeTypes.includes(req.file.mimetype)) {
                throw new Error('Invalid file type. Only PNG, JPG, and JPEG are allowed.');
            }
            return true;
        })
];


export {
    requestTime,
    imageValidation,
    validationResult
}