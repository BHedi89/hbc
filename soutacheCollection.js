const client = contentful.createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: "8giyq4i3wcjo",
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: "BuQwxSF0EdKsATh9r4_vRGeb8DHPd5Es8cg-svEoemk"
});

//variables

const cartItems = document.querySelector(".cart-items");
const cartContent = document.querySelector(".cart-content");
const closeCartButton = document.querySelector(".close-cart");
const removeItem = document.querySelector(".remove-item");
const itemAmount = document.querySelector(".item-amount");
const cartTotal = document.querySelector(".cart-total");
const clearCartButton = document.querySelector(".clear-cart-btn");
const productDOM = document.querySelector(".product-center")
const cartItemDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartBtn = document.querySelector(".cart-btn");

let cart = [];

let cartButtonsList = [];

//get products
class Product {
    async getProducts() {
        try {
          let contentful = await client.getEntries({
            content_type: "hbcSoutache"
          });
          
          let products = contentful.items;
          products = products.map(item => {
            const { title, price } = item.fields;
            const { id } = item.sys;
            const image = item.fields.image.fields.file.url;
            return { title, price, id, image };
          });
    
          return products;
        } catch (error) {
          console.log(error);
        }
      }
}

//display products
class UI {
    displayProducts(products) {
        let result = "";
        products.forEach(product => {
          result += `
            <article class="product">
              <div class="products-images">
                <img
                  src=${product.image}
                  alt="product"
                  class="product-img"
                />
                <button class="add-cart-btn" data-id=${product.id}>
                  <i class="fas fa-shopping-cart second-shopping-cart"></i>
                  add to cart
                </button>
              </div>
              <h3>${product.title}</h3>
              <h4>$${product.price}</h4>
            </article>`;
        });
        productDOM.innerHTML = result;
      }

      getCartButton() {
        let cartButtons = [...document.querySelectorAll(".add-cart-btn")]; //make an array from the buttons
        cartButtonsList = cartButtons;
        
        cartButtons.forEach(button => {
          let buttonId = button.dataset.id;
          let inCart = cart.find(item => item.id === buttonId);

          //if the product is in the cart
          if(inCart) {
            cartButtons.innerText = 'In Cart';
            cartButtons.disabled = true;
          };

          button.addEventListener("click", event => {
            event.target.innerText = 'In Cart';
            event.target.disabled = true;
            //get product from the products
            let cartItem = {...Storage.getProduct(buttonId), amount: 1};
            //add product to the cart
            cart = [...cart, cartItem];
            //save cart in the local storage
            Storage.saveCart(cart);
            //set cart values
            this.setCartValues(cart);
            //display cart items
            this.displayProductToTheCart(cartItem);
            //show the cart
            this.showCart();
          });
        });
      };

      setCartValues(cart) {
        let tempTotal = 0;
        let itemTotal = 0;

        cart.map(item => {
          tempTotal += item.price * item.amount;
          itemTotal += item.amount;
        });

        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemTotal;
      };

      displayProductToTheCart(item) {
        const createDiv = document.createElement("div");
        createDiv.classList.add("cart-item");
        createDiv.innerHTML = ` 
            <img src=${item.image} alt="product">
            <div>
              <h4>${item.title}</h4>
              <h5>${item.price} Ft</h5>
              <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
            <div>
              <i class="fas fa-chevron-up" data-id=${item.id}></i>
              <p class="item-amount">${item.amount}</p>
              <i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>`;
        cartContent.appendChild(createDiv);
      };

      showCart() {
        cartOverlay.classList.add("transparentBcg");
        cartItemDOM.classList.add("showCart");
      };

      setupAPP() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener("click", this.showCart);
        closeCartButton.addEventListener("click", this.hideCart);
      };

      populateCart() {
        cart.forEach(item => this.displayProductToTheCart(item));
      };

      hideCart() {
        cartOverlay.classList.remove("transparentBcg");
        cartItemDOM.classList.remove("showCart");
      };

      cartLogic() {
        clearCartButton.addEventListener("click", () => {
          this.clearCart();
        });

        cartContent.addEventListener("click", event => {
          if(event.target.classList.contains("remove-item")){
            let removeItem = event.target;
            let id = removeItem.dataset.id;
            cartContent.removeChild(removeItem.parentElement.parentElement);
            //remove item
            this.removeItem(id);
          } else if(event.target.classList.contains("fa-chevron-up")) {
            let addAmount = event.target;
            let id = addAmount.dataset.id;
            let tempItem = cart.find(item => item.id === id);
            tempItem.amount = tempItem.amount + 1;
            Storage.saveProduct(cart);
            this.setCartValues(cart);
            addAmount.nextElementSibling.innerText = tempItem.amount;
          } else if(event.target.classList.contains("fa-chevron-down")){
            let lowerAmount = event.target;
            let id = lowerAmount.dataset.id;
            let tempItem = cart.find(item => item.id === id);
            tempItem.amount = tempItem.amount - 1;
            if(tempItem.amount > 0) {
              Storage.saveCart(cart);
              this.setCartValues(cart);
              lowerAmount.previousElementSibling.innerText = tempItem.amount;
            } else {
              cartContent.removeChild(lowerAmount.parentElement.parentElement);
              this.removeItem(id);
            }
          };
        });
      }; 
      
      clearCart() {
        let cartItems = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while(cartContent.children.length > 0){
          cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();
      };

      removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart second-shopping-cart"></i>add to cart`;
      };

      getSingleButton(id) {
        return cartButtonsList.find(button => button.dataset.id === id);
      };
}

//using local storage to save datas
class Storage {
  static saveProduct(products) {
    localStorage.setItem("products", JSON.stringify(products));
  };

  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find(product => product.id === id);
  };

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  static getCart() {
    return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
  };
};

document.addEventListener("DOMContentLoaded", () => {
    const products = new Product();
    const ui = new UI();

    //setup APP
    ui.setupAPP();
    
    products.getProducts().then(products => {
      ui.displayProducts(products);
      Storage.saveProduct(products);
    }).then(() => {
      ui.getCartButton();
      ui.cartLogic();
    });
    
});