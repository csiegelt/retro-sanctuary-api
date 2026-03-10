import express from 'express';
const router = express.Router();

const products = [
    { id: 1, title: 'Producto 1', description: 'Descripción del producto 1', price: 100 },
    { id: 2, title: 'Producto 2', description: 'Descripción del producto 2', price: 200 },
    { id: 3, title: 'Producto 3', description: 'Descripción del producto 3', price: 300 }
];

router.get('/', (req, res) => {
    console.log('GET /api/products');
    res.json({ products });
});

router.get('/:id', (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const product = products.find(p => p.id === productId);

    if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json({ product });
});

router.post('/', (req, res) => {
    const newProduct = {
        id: products.length + 1,
        ...req.body
    };
    products.push(newProduct);
    res.status(201).json({ product: newProduct });
});

export { router };