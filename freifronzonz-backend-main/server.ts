import express, { Request, Response } from 'express'
import routes from './src/app/routes/index'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import { PORT } from './src/config/config'
import rateLimit from 'express-rate-limit'
import hpp from 'hpp'
import helmet from 'helmet'

import passport from "./src/config/passport"
import path from 'path'
import { uploadLimitHandler } from './src/helpers/files/multer'
import { initiateSuperAdmin } from './src/initialization/initiateSuperAdmin'
import { autoTrackVisitor } from './src/middleware/visitor.middleware'
import handleWebhook from './src/app/service/stripe/webhook'

//Initialize Express
const app = express()

//Passport initializing
app.use(passport.initialize());

//Middleware
//Webhooks

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://freifronzonz-client.vercel.app',
    'https://www.ops.wine',
    'https://ops.wine',
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}));


app.use(hpp())
app.use(helmet())
app.post('/api/v1/stripe/webhook', express.raw({ type: 'application/json' }), handleWebhook);

app.use(express.json({ limit: '100mb' }))
app.use(express.urlencoded({ limit: '100mb', extended: true }))
app.use(cookieParser())

// initiate super admin
initiateSuperAdmin();

app.use(autoTrackVisitor);

// Request Rate Limit
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 6000 })
app.use(limiter)

app.set('etag', false);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

//Routes
app.use('/api/v1', routes);

// Multer limiter
app.use(uploadLimitHandler);

app.get('/', (req: Request, res: Response) => res.send("API Working"))
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({ status: "fail", data: "Incorrect API" });
});

//Port
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`)
})

export default app;