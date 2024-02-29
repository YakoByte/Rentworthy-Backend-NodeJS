import { Request, Response, NextFunction } from 'express';
import * as fs from 'fs/promises'; // Use promises for safer asynchronous operations

export async function loggerFunction(req: Request, res: Response, next: NextFunction): Promise<void> {
    var logMessage = `\nAPI Headers:\n`;

    // Loop through headers and add them to the message
    for (const [key, value] of Object.entries(req.headers)) {
        logMessage += `${key}: ${value}\n`;
    }

    logMessage += `\nAPI Data:\n`;

    try {
        // Stringify request body with indentation
        logMessage += JSON.stringify(req.body, null, 2);
    } catch (error: any) {
        // Log error message if parsing fails
        logMessage += `Error parsing request data: ${error.message}\n`;
    }

    try {
        // Append log message to the file asynchronously
        await fs.appendFile('api_logs.txt', logMessage); // Adjust file name as needed
    } catch (error: any) {
        // Handle potential file write errors gracefully (e.g., log error, retry)
        console.error('Error writing log to file:', error.message);
    }

    next();
}
