import { Error } from "./class/Error_class.js";
import { Api } from "./class/Api_class.js";
import { Product } from "./class/Product_class.js";
import { Cart } from "./class/Cart_class.js";

const ErrorClass = new Error;
const ApiClass = new Api;
let error;

const QuantityElement = document.getElementById('quantity');
const ColorElement = document.getElementById('colors');
const AddToCartElement = document.getElementById('addToCart');
let product_id = String


let current_link = window.location.href;
current_link = new URL(current_link);
let search_params = new URLSearchParams(current_link.search);

if (search_params.has('id')) {
    product_id = search_params.get('id');
    if (product_id.length) {

        let ApiClass = new Api;
        let product = await ApiClass.GetSingleProduct(product_id)
        if (product && Object.keys(product).length > 0) {
            let ProductClass = new Product(product);
            ProductClass = ProductClass.Page()
        } else {
            error = 'Le produit que vous recherchez n\'éxiste pas ! Vous allez être redirigé vers l\'accueil !';
            ErrorClass.Notification(error);
            Redirect(2500)
        }

    } else {
        error = 'Identifiant du produit vide ! Vous allez être redirigé vers l\'accueil !';
        ErrorClass.Notification(error);
        Redirect(2500)
    }
} else {
    error = 'Aucun identifiant produit ! Vous allez être redirigé vers l\'accueil !';
    ErrorClass.Notification(error);
    Redirect(2500)
}


// Clic sur le bouton d'ajout au panier //
AddToCartElement.addEventListener('click', () => {
    let id = product_id;
    let color = ColorElement.value;
    let quantity = QuantityElement.value;
    if (color.length > 1 && quantity >= 1) {
        let CheckData = ColorChecker(id, color)
        .then((response) => {
            if (response === true) {
                let CartClass = new Cart;
                CartClass.AddToCart(id, color, quantity)
            } else {
                error = 'Cette couleur n\'existe pas pour ce produit !';
                ErrorClass.Notification(error);
            }
        })

    } else {
        error = 'Veuillez selectionner une couleur et indiquer une quantité !';
        ErrorClass.Notification(error);
    }
})


// Verification du nombre d'articles inscrit sur la page Produit //
QuantityElement.addEventListener('change', (e) => {
    let target = e.target
    if (target.value > 100) {
        target.value = 100;
        error = '100 articles maximum !';
        ErrorClass.Notification(error);
    }
})


// Fonction de redirection vers la page d'accueil //
const Redirect = (timer) => {
    setInterval(() => {
        let current_link = window.location.href;
        current_link = new URL(current_link);
        current_link = current_link.origin
        let Redirect = new Error();
        Redirect.Redirection(current_link)
    }, timer);
}

// Permet la vérification de la véracité de la couleur d'un produit //
const ColorChecker = async (id, color) => {
    let product = await ApiClass.GetSingleProduct(id);
    let colors = product.colors;
    let state = false;
    colors.forEach(element => {
        if (element === color) {
            state = true;
        }
    });
    return state;
}

