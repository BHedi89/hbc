"use strict";

const client = contentful.createClient({
  // This is the space ID. A space is like a project folder in Contentful terms
  space: "8giyq4i3wcjo",
  // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
  accessToken: "BuQwxSF0EdKsATh9r4_vRGeb8DHPd5Es8cg-svEoemk"
});

//variables
const productDOM = document.querySelector(".product-center")
const productDOM2 = document.querySelector(".product-center2")
const shopNowBtn = document.querySelector(".banner-button");
const menuBtn = document.querySelector(".menu-btn");
const menuOverlay = document.querySelector(".menu-overlay");
const workshopDOM = document.querySelector(".wrapper");
const modalContent = document.querySelector(".modal-content");

//buttons arrays
let infoButtonsList = [];

//get products from Contentful
class Product {
  async getProducts() {
    try {
      let contentful = await client.getEntries({
        content_type: "hbcProducts"
      });

      let products = contentful.items;
      products = products.map(item => {
        const { title, price, description, type } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image, description, type };
      });

      return products;
    } catch (error) {
      console.log(error);
    };
  };
}

//get workshop cards from Contentful
class Workshop {
  async getWorkshopCards() {
    try {
      let contentful = await client.getEntries({
        content_type: "workshopCard"
      });

      let cards = contentful.items;
      cards = cards.map(item => {
        const { title, description } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, description, id, image };
      });

      return cards;
    } catch (error) {
      console.log(error);
    };
  };
}

class UI {
  //display bead products from Contentful
  displayBeadProducts(products) {
    let result = "";

    products.forEach(product => {
      if (product.type === "bead") {
        result += `
          <article class="product">
            <div class="card">
                <div class="products-images">
                  <img
                    src=${product.image}
                    alt="product"
                    class="product-img card-img-top" 
                  />
                </div>
                <i class="fas fa-search-plus" data-id=${product.id}></i>
            </div>
          </article>`;
      }
    });
    productDOM.innerHTML = result;
  }

  //display soutache products from Contentful
  displaySoutacheProducts(products) {
    let result = "";

    products.forEach(product => {
      if (product.type === "soutache") {
        result += `
          <article class="product">
            <div class="card">
                <div class="products-images">
                    <img
                    src=${product.image}
                    alt="product"
                    class="product-img card-img-top" 
                    />
                </div>
                <i class="fas fa-search-plus" data-id=${product.id}></i>
            </div>
        </article>`;
      }
    });
    productDOM2.innerHTML = result;
  }

  //scroll down to product with "shop now" button
  scrollDownToProducts() {
    shopNowBtn.addEventListener("click", () => {
      window.open("https://hedisbeadcollectionwebshop.netlify.app");
    });
  };

  //get the menu from menu icon on the header
  getMenu() {
    menuBtn.addEventListener("click", () => {
      document.getElementById("myMenu").style.width = "250px";
      this.showMenu();
    });
  };

  //close the menu with it's "x" button
  closeMenu() {
    let closeMenuBtn = document.querySelector("#closeMenu");

    closeMenuBtn.addEventListener("click", () => {
      document.getElementById("myMenu").style.width = "0";
      this.hideMenu();
    });
  };

  //show the menu
  showMenu() {
    menuOverlay.classList.add("transparentBcgMenu");
  };

  //hide the menu
  hideMenu() {
    menuOverlay.classList.remove("transparentBcgMenu");
  };

  //scroll to the home page
  scrollToHomePage() {
    let homeMenuBtn = document.querySelector(".menu-to-home");
    let homePage = document.querySelector(".page-bcg");

    homeMenuBtn.addEventListener("click", () => {
      document.getElementById("myMenu").style.width = "0";
      this.hideMenu();
      homePage.scrollIntoView();
    });
  };

  //scroll down to the product page from menu
  scrollProductsFromMenu() {
    let productsMenu = document.querySelector(".products");
    let productMenuBtn = document.querySelector(".menu-to-products");

    productMenuBtn.addEventListener("click", () => {
      document.getElementById("myMenu").style.width = "0";
      this.hideMenu();
      productsMenu.scrollIntoView();
    });
  };

  //scroll down to the about page from menu
  scrollDownAbout() {
    let aboutMenu = document.querySelector(".about");
    let aboutMenuBtn = document.querySelector(".menu-to-about");

    aboutMenuBtn.addEventListener("click", () => {
      document.getElementById("myMenu").style.width = "0";
      this.hideMenu();
      aboutMenu.scrollIntoView();
    });
  }

  //scroll down to the contactpage from menu
  scrollDownContact() {
    let contactMenu = document.querySelector(".contact");
    let contactMenuBtn = document.querySelector(".menu-to-contact");

    contactMenuBtn.addEventListener("click", () => {
      document.getElementById("myMenu").style.width = "0";
      this.hideMenu();
      contactMenu.scrollIntoView();
    });
  };

  //validate the contact form
  validation() {
    // contact from validations
    let nameInput = document.getElementById("nameInput");
    let emailInput = document.getElementById("emailInput");
    let messageInput = document.getElementById("messageInput");

    let submitBtn = document.querySelector(".form");

    let emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;

    //hide alert message
    $('.alert').hide();

    submitBtn.addEventListener("submit", (e) => {
      e.preventDefault();
      nameInput.classList.remove("is-invalid");
      emailInput.classList.remove("is-invalid");
      messageInput.classList.remove("is-invalid");

      let isGood = true;
      //name validation
      if (nameInput.value === "") {
        nameInput.classList.add("is-invalid");
        isGood = false;
      }

      //email validation
      if (!emailRegex.test(emailInput.value)) {
        emailInput.classList.add("is-invalid");
        isGood = false;
      }

      if (messageInput.value === "") {
        messageInput.classList.add("is-invalid");
        isGood = false;
      }

      nameInput.value = "";
      emailInput.value = "";
      messageInput.value = "";

      //show alert message
      $('.alert').show();

    }, false);
  };

  //display the workshop cards from Contentful
  displayWorkshopCards(cards) {
    let result = "";
    cards.forEach(card => {
      result += `
        <div class="card workshop-card">
          <img src=${card.image} alt="">                
              <div class="descriptions">
              <h1>${card.title}</h1>
              <p>${card.description}</p>
              <button>Apply</button>
          </div>
        </div>`;
    });
    workshopDOM.innerHTML = result;
  };

  //scroll down to workshop page from menu
  scrollDownToWorkshop() {
    let workshopMenuBtn = document.querySelector(".menu-to-workshop");
    let workshopSite = document.querySelector(".workshop-title");

    workshopMenuBtn.addEventListener("click", () => {
      document.getElementById("myMenu").style.width = "0";
      this.hideMenu();
      workshopSite.scrollIntoView();
    });
  };

  getImgZoom() {
    let infoButtons = [...document.querySelectorAll(".fa-search-plus")]; //make an array from the buttons
    infoButtonsList = infoButtons;

    infoButtons.forEach(button => {
      let modal = document.getElementById("myModal");
      let closeModal = document.getElementsByClassName("close-modal")[0];
      let buttonId = button.dataset.id;

      button.addEventListener("click", () => {
        //show modal
        modal.style.display = "block";

        //display image info into the modal
        let modalInfo = { ...Storage.getProduct(buttonId) };
        this.displayModal(modalInfo);
      });

      closeModal.addEventListener("click", () => {
        //close the modal
        modal.style.display = "none";

        //clear the modal
        this.clearModal();
      });
    });
  };

  //clear the modal
  clearModal() {
    const modalItem = document.querySelector(".modal-item");
    modalContent.removeChild(modalItem);
  };

  //display the modal
  displayModal(product) {
    const createDiv = document.createElement("div");
    createDiv.classList.add("modal-item");
    createDiv.innerHTML = `
      <p class="product-title">${product.title}</p>
      <img class="modal-img responsive-modal-img" src=${product.image}>`;
    modalContent.appendChild(createDiv);
  };
}

//using local storage to save datas
class Storage {
  static getProduct(id) {
      let products = JSON.parse(localStorage.getItem('products'));
      return products.find(product => product.id === id);
  };
};

//DOM load
document.addEventListener("DOMContentLoaded", () => {
  const products = new Product();
  const ui = new UI();
  const workshop = new Workshop();

  products.getProducts().then(products => {
    ui.displayBeadProducts(products);
    ui.displaySoutacheProducts(products);
  }).then(() => {
    ui.getMenu();
    ui.closeMenu();
    ui.scrollToHomePage();
    ui.scrollDownToProducts();
    ui.scrollProductsFromMenu();
    ui.scrollDownAbout();
    ui.scrollDownContact();
    ui.scrollDownToWorkshop();
    ui.validation();
    ui.getImgZoom();
  });

  workshop.getWorkshopCards().then(cards => {
    ui.displayWorkshopCards(cards);
  });
});