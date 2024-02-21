const fs = require('fs')

class ProductManager {
    constructor(path) {
        this.path = path
        this.format = 'utf-8'
    }

    getProducts = async () => {
        const list = await this.read();
        return list
    }

    getNextID = list => {
        const count = list.length
        return (count > 0) ? list[count - 1].id + 1 : 1
    }

    existProduct = (code, list) => { 
        return list.some((prod) => prod.code ===code);
    }

    getProductbyId = async (id) => {
        const list = await this.getProducts();
        return list.find((prod) => prod.id == id) ?? "Not Found";
    }

    addProduct = async (title, description, price, thumbnail, code, stock) =>{
        const list = await this.read();
        const nextID = this.getNextID(list);
        const exis = this.existProduct(code, list);
        if(!exis){
            const newProduct = {
                id: nextID,
                code: code ?? 0,
                title: title ?? "",
                description: description ?? "",
                price: price ?? 0.0,
                thumbnail: thumbnail ?? "",
                stock: stock ?? 0
            }
            list.push(newProduct);
            await this.write(list);
            return newProduct;
        }
        return 'ya hay un producto con ese codigo'
    }

    read = () => {
        if(fs.existsSync(this.path)){
            return fs.promises.readFile(this.path, this.format).then(r => JSON.parse(r))
        }return []
    }

    write = async list => {
        await fs.promises.writeFile(this.path, JSON.stringify(list))
    }

    updateProduct = async (id, campo, update) => {
        const list = await this.getProducts();
        const idx = list.indexOf((e) => e.id == id);
        
        if(idx < 0) return "product not found";
        list[idx][campo] = update;
        await this.write(list);
        return list[idx][campo];
    }

    updateProductObj = async (id, obj) => {
        obj.id = id;
        const list = await this.read();

        const idx = list.findIndex((e) => e.id == id);
        if (idx < 0) return;
        list[idx] = obj;
        await this.write(list);
    }

    deleteProduct = async (id) => {
        const list = await this.getProducts();
        const idx = list.findIndex((e) => e.id == id);
        if (idx < 0) return;
        list.splice(idx, 1);
        await this.write(list);
        return list;
    }
}

module.exports = ProductManager

/*const run = async () => {
const productsManager = new ProductManager('desafio_entregable.json');
console.log(await productsManager.getProducts());

await productsManager.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25);
await productsManager.addProduct("Computadora portatil", "Notebook lenovo", 85000, "https://mla-s1-p.mlstatic.com/873896-MLA48241212970_112021-F.jpg", 1, 93);
await productsManager.addProduct("Auriculares", "Auriculares con microfono", 5000, "https://http2.mlstatic.com/D_NQ_NP_824972-MLA44676439845_012021-O.webp", 2, 300);
await productsManager.addProduct("mouse inalámbrico", "mouse inalámbrico logitech M280", 10000, "https://http2.mlstatic.com/D_NQ_NP_918568-MLA32146214305_092019-O.webp", 5, 225);

console.log(await productsManager.getProducts())
console.log("-----------------------------------------")

console.log("Intento agregar los mismos productos");
await productsManager.addProduct('producto prueba', 'Este es un producto prueba', 200, 'Sin imagen', 'abc123', 25);
await productsManager.addProduct("Computadora portatil", "Notebook lenovo", 85000, "https://mla-s1-p.mlstatic.com/873896-MLA48241212970_112021-F.jpg", 1, 93);
console.log("-----------------------------------------")
console.log(await productsManager.getProducts());

console.log("-----------------------------------------------");
console.log("Borro productos");

productsManager.deleteProduct(1)

console.log("------------------------------------------------");
console.log("Actualizo productos");
productsManager.updateProduct(3, 'title', 'Texto relleno')
console.log(await productsManager.getProductbyId(2))

console.log("-------------------------------------------");

console.log(await productsManager.getProductbyId(3));

console.log("---------------------------------------");

console.log(await productsManager.getProducts());

console.log("FIN");
}
run()*/



