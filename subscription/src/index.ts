// index.ts

import express, { Express, Request, Response } from "express";
import { PORT } from "./config";
import { configureExpress } from "./express-config.ts";
import { connectDB } from "./database/index.ts";
import { rateLimit } from "express-rate-limit";
import helmet from "helmet";

const StartServer = async (): Promise<void> => {
  // check if uploads folder exists
  const fs = require("fs");
  const dir = "./uploads";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  console.log('1111');

  const app: Express = express();

  // Connect to the database
  await connectDB();

  console.log('2222');

  // Configure Express app using the module
  await configureExpress(app);

  // Use Helmet!
  app.use(helmet());

  console.log('3333');

  // rate limit
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: "Too many requests from this IP, please try again later.",
  });

  app.use(limiter);

  // Define a simple root route
  console.log("Called");
  app.get("/", (req: Request, res: Response) => {
    console.log("Called");
    res.status(200).send({ message: "Subscription microservices called........" });
  });

  console.log('4444');

  // Start the Express server
  app
    .listen(PORT, () => {
      console.log(`Listening to port ${PORT}`);
    })
    .on("error", (err: NodeJS.ErrnoException) => {
      console.error("Server error:", err);
      process.exit(1);
    });
};

StartServer();
