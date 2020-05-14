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

let cart = [];

//get products
class Product {

}

//display products
class UI {

}

//using local storage to save datas
class Storage {

}

window.addEventListener("DOMContentLoaded", event => {
    const product = new Product();
    const ui = new UI();
    

});