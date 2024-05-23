import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import cartsRouter from './routes/carts.router.js'
import productsRouter from './routes/products.router.js'

const app = express()
const PORT = 8080 

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine','handlebars')

app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use("/", cartsRouter)
app.use("/", productsRouter)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})