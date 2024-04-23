const express = require('express')
const path = require('path')
const app = express()
const PORT = 8080 
const cartsRouter = require("./routes/carts.router.js")
const productsRouter = require("./routes/products.router.js")
app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use("/", cartsRouter)
app.use("/", productsRouter)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})