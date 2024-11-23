import express from 'express'
import schoolRoutes from './routes/schoolRoutes.js';
const app=express()

app.use(express.json())

app.use("/", schoolRoutes)

app.use( (err, req, res, next) => {
    console.log(err.stack)
    res.status(500).send('broken!')
})

app.listen(8080, () => {
    console.log("Server running at Port Number - 8080")
})