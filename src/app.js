const express = require("express")
const ProductManager = require("./desafio_entregable2")

const PORT = 3000
const app = express()

const manager = new ProductManager('products.json');

app.get('/', (req, res) => {
    res.json('Welcome, to access the products go to the route localhost:8080/products')
})

app.get("/products", async(req, res)=>{
    let limit = parseInt(req.query.limit)
    const products = await manager.getProducts()
    if(!limit){
        return res.json(products)
    }
    limit = limit<products.length ? limit : products.length
    const arr = []
    for(let i =0; i<limit; i++){
        arr.push(products[i])
    }
    return res.json(arr)
})

app.get('/products/:pid', async (req, res) => {
    const pid = req.params.pid
    const prod = await manager.getProductbyId(pid)
    return res.json(prod)
})

app.listen(PORT, ()=>{
    console.log(`Server ON LINE en puerto ${PORT}`)
})