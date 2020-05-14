const client = contentful.createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: "8giyq4i3wcjo",
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: "BuQwxSF0EdKsATh9r4_vRGeb8DHPd5Es8cg-svEoemk"
});

//variables

const shoppingCartIcon = document.querySelector(".fa-shopping-cart");
const cartItems = document.querySelector(".cart-items");
const addCartButton = document.querySelector(".add-cart-btn");
const closeCartButton = document.querySelector(".close.cart");
const removeItem = document.querySelector(".remove-item");
const increaseItems = document.querySelector(".fa-chevron-up");
const decreaseItems = document.querySelector(".fa-chevron-down");
const itemAmount = document.querySelector(".item-amount");
const cartTotal = document.querySelector(".cart-total");
const clearCartButton = document.querySelector(".clear-cart-btn");
const productDOM = document.querySelector(".product-center")

let cart = [];

//get products
class Product {
    async getProduct() {
        try{
            let contentful = await client.getEntries({
                content_type: 'hbcProducts'
            });

            let products = contentful.items;
            products.map(item => {
                const {title, price} = item.fields;
                const {id} = item.sys;
                const image = item.fields.image.fields.file.url;
                return {title, price, id, image};
            });
            console.log(products);
        
            return products;
        } catch (error) {
            console.log(error);
        };
    };
}

//display products
class UI {
    displayProducts(products) {
        let result = "";
        products.forEach(product => {
            result += `
                <article class="product">
                    <div class="products-images">
                        <img src=${product.image} alt="product" class="product-img">
                        <button class="add-cart-btn" data-id=${product.id}>
                            <i class="fas fa-shopping-cart second-shopping-cart"></i>
                            add to cart
                        </button>
                    </div>
                    <h3>${product.title}</h3>
                    <h4>${product.price} Ft</h4>
                </article>`;
        });
        productDOM.innerHTML = result;
    };
}

//using local storage to save datas
class Storage {

}

document.addEventListener("DOMContentLoaded", () => {
    const products = new Product();
    const ui = new UI();
    
    products.getProduct().then(products => {
        ui.displayProducts(products);
    });
});