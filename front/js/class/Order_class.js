import { Api } from "./Api_class.js";

const ApiClass = new Api();

export class Order {

    NewOrder(data) {
        ApiClass.NewOrder(data)
            .then((response) => {
                localStorage.clear();
                let redirect = "./confirmation.html?id=" + response.orderId;
                window.location.href = redirect;
            })
            .catch(() => {
                alert("Erreur: Envoi des données immpossible, veuillez rééssayer.");
            });

    }

}