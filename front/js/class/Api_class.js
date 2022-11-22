export class Api {

    async GetProductList() {
        let AllProductsRequest = async () => {
            return new Promise(resolve => {
                fetch('http://localhost:3000/api/products/')
                    .then((response) => response.json())
                    .then((data) => {
                        resolve(data)
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            })
        }
        let result = await AllProductsRequest();
        return result;
    }

    async GetSingleProduct(product_id) {
        let ProductRequest = async () => {
            return new Promise(resolve => {
                fetch('http://localhost:3000/api/products/'+product_id)
                    .then((response) => response.json())
                    .then((data) => {
                        resolve(data)
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            })
        }

        let result = await ProductRequest();
        return result;
    }
}