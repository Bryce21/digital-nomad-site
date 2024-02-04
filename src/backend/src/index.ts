import express, {Express, NextFunction, Request, RequestHandler, Response} from "express";

import {
    Client,
} from "@googlemaps/google-maps-services-js";
import {openaiRouter} from './routes/openaiRoutes'
import {placesRouter} from './routes/placesRoutes'


const client = new Client({})

const app: Express = express();
const port = process.env.PORT || 3000;

// set cors - todo restrict this more eventually
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use('/openai', openaiRouter)

app.use('/places', placesRouter)


app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
