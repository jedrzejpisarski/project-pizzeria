import {select, classNames, templates} from './settings.js';
import utils from './utils.js';
import AmountWidget from './components/AmountWidget.js';

class Product {
  constructor(id, data){
    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    console.log('new Product:', thisProduct);

    thisProduct.getElements();
    console.log('new Product:', thisProduct);

    thisProduct.initAccordion();
    console.log('new Product:', thisProduct);

    thisProduct.initOrderForm();
    console.log('new Product:', thisProduct);

    thisProduct.initAmountWidget();

    thisProduct.processOrder();
    console.log('new Product:', thisProduct);
  }
  renderInMenu(){
    const thisProduct = this;

    /*generate HTML based on template*/
    const generateHTML = templates.menuProduct(thisProduct. data);

    console.log('generateHTML', generateHTML);
    /*create element using utilis.createElementFromHTML*/
    thisProduct.element = utils.createDOMFromHTML(generateHTML);

    /*find menu container*/
    const menuContainer = document.querySelector(select.containerOf.menu);

    /*add element to menu*/
    menuContainer.appendChild(thisProduct.element);

  }

  getElements(){
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.imageWrapper = thisProduct.element.querySelector(select.menuProduct.imageWrapper);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);
  }

  initAccordion(){
    const thisProduct = this;

    /* START: click event listener to trigger */
    thisProduct.accordionTrigger.addEventListener('click', function(event){
      console.log('clicked');

      /* prevent default action for event */
      event.preventDefault();

      /* toggle active class on element of thisProduct */
      thisProduct.element.classList.toggle('active');

      /* find all active products */
      const activeProducts = document.querySelectorAll('.product.active');

      /* START LOOP: for each active product */
      for(let product of activeProducts) {

        /* START: if the active product isn't the element of thisProduct */
        if (product != thisProduct.element) {
          /* remove class active for the active product */
          product.classList.remove('active');
          /* END: if the active product isn't the element of thisProduct */
        }
      }
      /* END LOOP: for each active product */
    });
    /* END: click event listener to trigger */
  }

  initOrderForm (){

    const thisProduct = this;
    console.log('initOrderForm');

    thisProduct.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisProduct.processOrder();
    });

    for(let input of thisProduct.formInputs){
      input.addEventListener('change', function(){
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function(event){
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }

  initAmountWidget(){
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function() {
      thisProduct.processOrder();
    });
  }

  processOrder(){

    const thisProduct = this;
    console.log('processOrder');

    /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
    const formData = utils.serializeFormToObject(thisProduct.form);

    console.log('formData', formData);
    console.log(thisProduct.data.params);

    /* set variable price to equal thisProduct.data.price */
    let price = thisProduct.data.price;

    for(let param in thisProduct.data.params) {
      const paramValue = thisProduct.data.params[param];

      for(let option in paramValue.options) {
        const optionValue = thisProduct.data.params[param].options[option];
        const optionSelected = formData.hasOwnProperty(param) && formData[param].indexOf(option) > -1;

        // 1. musimy znalezc obrazek
        const image = document.querySelector('.' + param + '-'+ option);
        if(image) {
          if(optionSelected) image.classList.add('active');
          else image.classList.remove('active');
        }

        // 2. musimy ustalic, czy powinien byc on widoczny i dac albo zabrac klase active
        if(optionValue) {
          console.log('Zmieniam ', option);
          if(optionSelected && !optionValue.default) {
            console.log('Trzeba zwiekszyc cene', price);
            price = price + optionValue.price;
            console.log(price);
          }
          else if(!optionSelected && optionValue.default) {
            console.log('Trzeba zmniejszyc cene', price);
            price = price - optionValue.price;
            console.log(price);
          }
        }
      }
    }

    thisProduct.priceSingle = price;
    thisProduct.price = thisProduct.priceSingle * thisProduct.amountWidget.value;

    /* set the contents of thisProduct.priceElem to be the value of variable price */
    thisProduct.priceElem.innerHTML = thisProduct.price;
  }

  addToCart(){
    const thisProduct = this;
    const cartProduct = {};
    cartProduct.name = thisProduct.data.name;
    cartProduct.params = JSON.parse(JSON.stringify(thisProduct.data.params));
    cartProduct.price = thisProduct.price;
    cartProduct.priceSingle = thisProduct.data.price;
    for(let param in cartProduct.params) {
      cartProduct.params[param].options = Object.keys(cartProduct.params[param].options).join(', ');
    }
    cartProduct.amount = thisProduct.amountWidget.value;
      
    //app.cart.add(cartProduct);

    const event = new CustomEvent ('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct,
      },
    });

    thisProduct.element.dispatchEvent(event);
  }
}
export default Product;
