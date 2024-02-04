import express, {Request} from "express";
import {sendQuery, questionBases} from '../services/openaiService'
const openaiRouter = express.Router();



interface LocationQuery {
    location: string
}
openaiRouter.get('/food', async (req: Request<unknown, unknown, unknown, LocationQuery>, res, next) => {
    try {
        const {location} = req.query
        if(!location){
            throw new Error('location must be defined as a query parameter')
        }
        const aiRes = await sendQuery(questionBases.food, location)
        res.json(aiRes)
    } catch (e) {
        console.error(e)
        next(e)
    }
})


export {
    openaiRouter
}
