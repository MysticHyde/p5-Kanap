import { Product } from "./class/Product_class.js";
import { Api } from "./class/Api_class.js";

const ApiClass = new Api;
const ProductList = await ApiClass.GetProductList()
const CardsContainer = document.getElementById('items');

ProductList.map(el => {
    let ProductClass = new Product(el);
    let ProductCard = ProductClass.Card();
    CardsContainer.appendChild(ProductCard);
})