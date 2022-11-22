import { Error } from "./class/Error_class.js";
import { Cart } from "./class/Cart_class.js";




const ErrorClass = new Error;
const CartClass = new Cart;

let cart_list = localStorage.getItem('cart');
cart_list = JSON.parse(localStorage.getItem('cart'));
let cart_items_element = document.getElementById('cart__items');
let order = document.getElementById('order')



// Affichage de la liste de produits lors de l'initialisation de la page
if (cart_list != null && cart_list.length > 0) {
    CartClass.GenerateHTML()
    .then(function (response) {
        cart_items_element.innerHTML = response;
        CartItemsChange();
        CartClass.Total()
        .then(function (res) {
            let totalQuantity_element = document.getElementById('totalQuantity');
            let totalPrice_element = document.getElementById('totalPrice');
            totalQuantity_element.textContent = res.quantity;
            totalPrice_element.textContent = res.price;
        })
        .catch(function (err) {
            console.log(err);
        })
    })
    .catch(function (err) {
        console.log(err);
    })
} else {
    CartClass.EmptyCart();
}








// Permet de declencher une fonction selon la class de l'element cliqué
function CartItemsChange() {
    let cart__items_element = document.getElementById('cart__items')
    addEvent(cart__items_element, 'click keyup focusout', (e) => {
        let target = e.target
        let target_name = target.className
        let parent = target.closest('.cart__item')
        let product_id = parent.getAttribute("data-id")
        let product_color = parent.getAttribute("data-color")

        switch (target_name) {
            case "deleteItem":
                CartClass.DeleteProduct(product_id, product_color, parent)
                break;

            case "itemQuantity":
                let product_quantity = target.value
                CartClass.UpdateQuantity(product_id, product_color, product_quantity, target)
                break;
        }
        CartClass.Total()
            .then(function (res) {
                let totalQuantity_element = document.getElementById('totalQuantity');
                let totalPrice_element = document.getElementById('totalPrice');
                totalQuantity_element.textContent = res.quantity;
                totalPrice_element.textContent = res.price;
            })
            .catch(function (err) {
                console.log(err);
            })
    })
}






addEvent(order, 'click submit', function (e) {
    e.preventDefault()
    let el_firstName = document.getElementById('firstName')
    let el_lastName = document.getElementById('lastName')
    let el_address = document.getElementById('address')
    let el_city = document.getElementById('city')
    let el_email = document.getElementById('email')

    let error_state = false


    // Insertion des données dans un objet
    let contact = {
        firstName: el_firstName.value,
        lastName: el_lastName.value,
        address: el_address.value,
        city: el_city.value,
        email: el_email.value,
    }
    // Création de la liste des messages d'erreurs
    let errors = {
        firstName: 'Le prénom est incorrect',
        lastName: 'Le nom de famille est incorrect',
        address: 'L\'adresse n\'est pas valide',
        city: 'La ville n\'est pas valide',
        email: 'L\'adresse email est incorrecte'
    }

    // Vérification des valeurs insérées et création des erreurs côté front
    for (const property in contact) {
        validator = InputCheckout(property, contact[property])
        if (validator === false) {
            console.log(property + 'ok');
            // error_state = true
            // errorsGenerator(property, errors[property])
        } else {
            console.log(property + 'pas ok');
            // errorsGenerator(property, '')
        }
    }

    // if (products.length < 1) {
    //     error_state = true
    //     alert('Aucun produit dans le panier')
    // }



    // if (error_state === false) {

    //     let datas = {
    //         contact: contact,
    //         products: []
    //     }

    //     for (let i = 0; i < products.length; i++) {
    //         const product = products[i];
    //         datas.products.push(product.id)
    //     }
    //     sendOrder(datas);
    // }

})










// function sendOrder(datas) {
//     url = 'http://localhost:3000/api/products/order'

//     fetch(url, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(datas),
//     })
//         .then((res) => res.json())
//         .then((response) => {
//             console.log(response);
//             localStorage.clear();
//             let redirect = "./confirmation.html?id=" + response.orderId;
//             window.location.href = redirect;
//         })
//         .catch(() => {
//             alert("Erreur: Envoi des données immpossible, veuillez rééssayer.");
//         });
// }


//////////////////////////////////////////////////////////////
//                                                          //
// Fonction pour vérifier les champs                        //
//                                                          //
//////////////////////////////////////////////////////////////
function InputCheckout(type, val) {
    let validate = Boolean
    let value = String(val)

    if (String(val).length < 3) {
        validate = false
        return validate
    }

    switch (String(type)) {
        case 'firstName':
            validate = /^[a-zA-Z]+[ -]?[a-zA-Z]+$/igm.test(value)
            break
        case 'lastName':
            validate = /^[a-zA-Z]+[ -]?[a-zA-Z]+$/igm.test(value)
            break
        case 'address':
            validate = /^[a-zA-Z0-9éêèà\s-]+$/igm.test(value)
            break
        case 'email':
            validate = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/igm.test(value)
            break

        case 'city':
            // validate = /^[a-zA-Z][a-zA-Z\s-]+[a-zA-Z]$/igm.test(value)
            validate = /^[a-zA-Z0-9éèà\s-]+$/igm.test(value)
            break
    }
    return validate
}




//////////////////////////////////////////////////////////////
//                                                          //
// Fonction de création d'erreurs                           //
//                                                          //
//////////////////////////////////////////////////////////////
function errorsGenerator(id, error) {
    let input = document.getElementById(id + 'ErrorMsg')

    input.textContent = error
}

//////////////////////////////////////////////////////////////
//                                                          //
// Fonction pour ajouter rapidement plusieurs Events        //
//                                                          //
//////////////////////////////////////////////////////////////
function addEvent(element, eventNames, listener) {
    var events = eventNames.split(' ');
    for (var i = 0, iLen = events.length; i < iLen; i++) {
        element.addEventListener(events[i], listener, false);
    }
}