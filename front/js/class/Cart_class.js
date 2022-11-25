import { Error } from "./Error_class.js";
import { Api } from "./Api_class.js";

export class Cart {

    AddToCart(id, color, quantity) {
        let ErrorClass = new Error;
        let ApiClass = new Api;
        let error;
        let color_state = false;
        let colors_list;
        let cart_list;
        let cart_product_push = [];
        let product_color = color;
        let product_quantity = quantity;
        let product_id = id;
        var regNumber = /^\d+$/;
        let testNumber = regNumber.test(product_quantity);
        // Vérification que la valeur est bien un Int
        if (testNumber == true) {
            product_quantity = parseInt(product_quantity)
            // Vérification de l'existance de la couleur pour ce produit via l'API
            ApiClass.GetSingleProduct(product_id)
                .then(function (product) {
                    colors_list = product.colors
                    for (let i = 0; i < colors_list.length; i++) {
                        let valid_color = colors_list[i];
                        //  Vérification de la couleur selectionnée avec la liste des couleurs disponibles du produit
                        if (valid_color === product_color) {
                            color_state = true
                        }
                    }
                    // Si la couleur existe, création/update du panier
                    if (color_state === true) {
                        cart_list = localStorage.getItem('cart')
                        // Vérification de l'existance du panier
                        if (cart_list === null) {
                            cart_product_push.push(
                                {
                                    'id': product_id,
                                    'color': product_color,
                                    'quantity': product_quantity
                                })
                            cart_product_push = JSON.stringify(cart_product_push)
                            localStorage.setItem('cart', cart_product_push)
                        }
                        else {
                            cart_list = JSON.parse(cart_list)
                            let element_state = false
                            cart_list.forEach(element => {
                                // Si l'element existe déjà dans le panier, passage de l'état sur True
                                if (element.id == product_id && element.color == product_color && element_state === false) {
                                    element_state = true
                                    product_quantity = parseInt(product_quantity) + parseInt(element.quantity)
                                    if (product_quantity > 100) {
                                        // Si le nombre de produits est supérieur à 100, message d'alerte et quantité à 100
                                        error = 'Vous avez ' + product_quantity + ' produits, la limite est fixé à 100';
                                        ErrorClass.Notification(error)
                                        product_quantity = 100
                                        element.quantity = 100
                                    }
                                    else {
                                        element.quantity = product_quantity
                                    }
                                }
                            })
                            if (element_state == false) {
                                // Si l'état est False, le produit n'éxiste pas encore dans le panier. Création de l'article dans le panier
                                cart_list.push(
                                    {
                                        'id': product_id,
                                        'color': product_color,
                                        'quantity': product_quantity
                                    })
                            }
                            cart_product_push = JSON.stringify(cart_list)
                            localStorage.setItem('cart', cart_product_push)
                        }
                    }
                    else {
                        error = "Cette couleur n'existe pas !";
                        ErrorClass.Notification(error);
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    error = 'Impossible de récupérer le contenu de la requête';
                    ErrorClass.Notification(error);
                });
        }
        else {
            error = 'Veuillez renseigner un chiffre/nombre dans le champs "Nombre d\'articles"';
            ErrorClass.Notification(error);
        }
    }



    async GenerateHTML() {
        let ApiClass = new Api;
        let cart_list = localStorage.getItem('cart');
        cart_list = JSON.parse(localStorage.getItem('cart'));

        if (cart_list.length > 0) {

            let CreateArticle = async () => {
                return new Promise(resolve => {
                    ApiClass.GetProductList()
                        .then(function (products) {
                            let articles = '';

                            cart_list.forEach(function (cart_product) {
                                let found_product = products.find(element => element['_id'] === cart_product.id);
                                let product_price = found_product.price;
                                let product_img = found_product.imageUrl;
                                let product_name = found_product.name;
                                let product_altTxt = found_product.altTxt;
                                let product_color = cart_product.color;

                                articles = articles + `
                            <article class="cart__item" data-id="${cart_product.id}" data-color="${product_color}">
                                <div class="cart__item__img">
                                <img src="${product_img}" alt="${product_altTxt}">
                                </div>
                                <div class="cart__item__content">
                                <div class="cart__item__content__description">
                                    <h2>${product_name}</h2>
                                    <p>${product_color}</p>
                                    <p>${product_price} €</p>
                                </div>
                                <div class="cart__item__content__settings">
                                    <div class="cart__item__content__settings__quantity">
                                    <p>Qté : </p>
                                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cart_product.quantity}">
                                    </div>
                                    <div class="cart__item__content__settings__delete">
                                    <p class="deleteItem">Supprimer</p>
                                    </div>
                                </div>
                                </div>
                            </article>
                            `
                            });

                            resolve(articles);
                        })
                        .catch(function (err) {
                            console.log(err);
                        })
                })
            }
            let result = await CreateArticle();
            return result;
        }

    }




    UpdateQuantity(id, color, new_quantity, target) {
        let updated_cart = [];
        let cart_list = localStorage.getItem('cart');
        cart_list = JSON.parse(cart_list)

        for (let i = 0; i < cart_list.length; i++) {
            let element = cart_list[i];

            if (element.id === id && element.color === color) {

                if (new_quantity <= 0) {
                    target.value = 1
                    element.quantity = 1
                    updated_cart.push(element)
                }
                if (new_quantity > 100) {
                    alert('limité à 100 !')
                    target.value = 100
                    element.quantity = 100;
                    updated_cart.push(element)
                }
                if (new_quantity <= 100 && new_quantity > 0) {
                    element.quantity = new_quantity;
                    updated_cart.push(element)
                }
            } else {
                updated_cart.push(element)
            }
        }
        updated_cart = JSON.stringify(updated_cart)
        localStorage.setItem('cart', updated_cart)
    }



    DeleteProduct(id, color, article) {
        let updated_cart = [];
        let cart_list = localStorage.getItem('cart');
        cart_list = JSON.parse(cart_list);
        for (let i = 0; i < cart_list.length; i++) {
            let element = cart_list[i];

            if (element.id === id && element.color === color) {
                let remove_product_html = article;
                if (remove_product_html <= 0) {
                    remove_product_html.remove();
                } else {
                    article.remove()
                }
            } else {
                updated_cart.push(element);
            }
        }
        if (updated_cart.length <= 0) {
            this.EmptyCart();
        }
        updated_cart = JSON.stringify(updated_cart);

        localStorage.setItem('cart', updated_cart);

    }

    async Total() {

        let GetTotal = async () => {
            return new Promise(resolve => {

                let ApiClass = new Api;
                let ErrorClass = new Error;

                let total_price = 0;
                let total_quantity = 0;

                let cart_list = localStorage.getItem('cart');
                cart_list = JSON.parse(localStorage.getItem('cart'));
                if (cart_list != null && cart_list.length > 0) {

                    ApiClass.GetProductList()
                        .then(function (products) {

                            cart_list.forEach(function (cart_product) {
                                let found_product = products.find(element => element['_id'] === cart_product.id);
                                let product_price = found_product.price;

                                total_price = total_price + (Number(cart_product.quantity) * Number(product_price));
                                total_quantity = (Number(total_quantity) + Number(cart_product.quantity));
                            });
                            resolve({
                                'price': total_price,
                                'quantity': total_quantity
                            });

                        })
                        .catch(function (err) {
                            console.log(err);
                        })
                } else {
                    ErrorClass.Notification('Veuillez n\'avez aucun article pour le moment');
                }

            })
        }
        let result = await GetTotal();
        return result;
    }


    EmptyCart() {
        let cart__order_element = document.getElementsByClassName('cart__order');
        let totalQuantity_element = document.getElementById('totalQuantity');
        let totalPrice_element = document.getElementById('totalPrice');
        let cart_items_element = document.getElementById('cart__items');

        cart_items_element.innerHTML = `
        <p>Aucun article dans votre panier</p>
        `
        cart__order_element[0].style.display = "none";
        totalQuantity_element.textContent = 0
        totalPrice_element.textContent = 0
    }


}
