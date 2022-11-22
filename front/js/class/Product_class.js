export class Product {
    constructor(product) {
        if (product) {
            this.id = product._id;
            this.name = product.name;
            this.description = product.description;
            this.img = product.imageUrl;
            this.colors = product.colors;
            this.altTxt = product.altTxt;
            this.price = product.price;
        }
    }

    Card() {
        let link = './product.html?id=' + this.id;
        let card = document.createElement("a");
        card.setAttribute('href', link);
        card.innerHTML = `
        <article class="parent">
            <img src="${this.img}" alt="${this.altTxt}">
            <h3 class="productName">${this.name}</h3>
            <p class="productDescription">${this.description}</p>
        </article>
        `;
        return card;
    }

    Page() {
        let product_img_container = document.querySelector('.item__img');
        let product_colors_container = document.getElementById('colors');

        let product_title_element = document.getElementById('title');
        let product_price_element = document.getElementById('price');
        let product_description_element = document.getElementById('description');

        product_img_container.innerHTML = `
        <img src="${this.img}" alt="${this.altTxt}">
        `;

        for (let index = 0; index < this.colors.length; index++) {
            const color = this.colors[index];
            let option = document.createElement('option');
            option.setAttribute('value', color);
            option.textContent = color;
            product_colors_container.appendChild(option)
        }

        product_title_element.textContent = this.name;
        product_price_element.textContent = this.price;
        product_description_element.textContent = this.description;
    }
}