/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };

  class Product {
    constructor(id, data){
      const thisProduct = this;
     
      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      console.log('new Product:', thisProduct);

      thisProduct.getElements()
      console.log('new Product:', thisProduct);

      thisProduct.initAccordion();
      console.log('new Product:', thisProduct);

      thisProduct.initOrderForm();
      console.log('new Product:', thisProduct);

      thisProduct.processOrder();
      console.log('new Product:', thisProduct);
    }
    renderInMenu(){
      const thisProduct = this;

      /*generate HTML based on template*/
      const generateHTML = templates.menuProduct(thisProduct. data);

      console.log('generateHTML', generateHTML)
      /*create element using utilis.createElementFromHTML*/
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      
      /*find menu container*/
      const menuContainer = document.querySelector(selector.containerOf.menu);
      
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

      /* find the clickable trigger (the element that should react to clicking) */
      const thisProductClicable = document.getElementById('.product__header');
      
      /* START: click event listener to trigger */
      thisProductClicable.accordionTrigger('click', function(event){
        console.log('clicked');
      
        /* prevent default action for event */
        event.preventDefault();
        
        /* toggle active class on element of thisProduct */
        this.activeProduct.add('active');    
        /* find all active products */
        const activeProduct = document.querySelectorAll('.product .active');
        
        /* START LOOP: for each active product */
        for(let product of activeProduct) {
          
          /* START: if the active product isn't the element of thisProduct */
          if (activeProduct != this);
          
          /* remove class active for the active product */
          product.activeProduct.remove('.active');
          /* END: if the active product isn't the element of thisProduct */
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
        });
    }

    initAmountWidget(){
      const thisProduct = this;

      thisProduct.amuntWidget = new AmountWidget(thisProduct.amountWidgetElem);
      thisProduct.amountWidgetElem.addEventListener('updated', thisProduct.processOrder());
    }

    processOrder(){

      const thisProduct = this;
      console.log('processOrder');
      
      /* read all data from the form (using utils.serializeFormToObject) and save it to const formData */
      const formData = utilis.serializeFormToObject(thisProduct.form);
      console.log('formData', formData);
      
      /* set variable price to equal thisProduct.data.price */

      /* START LOOP: for each paramId in thisProduct.data.params */
      for(let paramId of thisProduct.data.params) {  
        /* save the element in thisProduct.data.params with key paramId as const param */
        const param = document.thisProduct.data.params.getElementsByTagName('paramId');
        /* START LOOP: for each optionId in param.options */
        for(let optionId of param.option){
          /* save the element in param.options with key optionId as const option */
          const option = document.param.options.getElementByTagName('optionId')
          /* START IF: if option is selected and option is not default */
          const optionSelected = formData.hasOwnProperty(paramId) && formData[paramId].indexOf(optionId) > -1;
          
          if(optionSelected && !option.default){
            /* add price of option to variable price */
            
          /* END IF: if option is selected and option is not default */
          }
          /* START ELSE IF: if option is not selected and option is default */
          else if (!optionSelected && option.default){
          /* deduct price of option from price */
          
          /* END ELSE IF: if option is not selected and option is default */
          }

          const classImg = document.optionSelected.images.getElementById(classNames.menuProduct.imageVisible)
        
          if(optionSelected){
            optionSelected.images.add(classNames.menuProduct.imageVisible);
          }
          else (!optionSelected) {
            optionSelected.images.remove(classNames.menuProduct.imageVisible);
          }

        /* END LOOP: for each optionId in param.options */
        }
      /* END LOOP: for each paramId in thisProduct.data.params */
      }
      /*multiply price by amount */
      price *= thisProduct.amount.Widget.value;

      /* set the contents of thisProduct.priceElem to be the value of variable price */
      thisProduct.priceElem = price;
    }
  }

  class AmountWidget{
    constructor(element){
      const thisWidget = this;

      thisWidget.getElements(element);
      thisWidget.value(settings.amountWidget.defaultValue);
      thisWidget.setValue(thisWidget.input,value);

      console.log('AmountWidget:', thisWidget);
      console.log('constructor arguments:', element);
    } 
    getElements(element){
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
      thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
      thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
    }

    setValue(value){
      const thisWidget = this;

      const newValue = parseInt(value);
      
      /* TODO: Add validation */

      if (newValue != value && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax){
        
        thisWidget.value = newValue;
        thisWidget.announce();
      }    

      thisWidget.value = newValue;
      thisWidget.announce();
      thisWidget.input.value = thisWidget.value;

    }

    initActions(){
      thisWidget.input.addEventListener('change', setValue(input));
      thisWidget.linkDecrease.addEventListener('click', preventExtensions(), setValue(thisWidget.value -1));
      thisWidget.linkIncrease.addEventListener('click', preventExtensions(), setValue(thisWidget.value +1));
    }

    announce(){
      const thisWidget = this;

      const event = new Event ('updated');
      thisWidget.element.dispatchEvent(event);
    }

  }
    
  const app = {
    initMenu: function(){

          const thisApp = this;
          console.log('thisApp.data', thisApp.data);

          for(let productData in thisApp.data.products){
            new Product(productData, thisApp. data.products[productData]);
          }
    },
    initData: function(){
          const thisApp = this;

          thisApp.data = dataSource;
    }
    init: function(){
          const thisApp = this;
          console.log('*** App starting ***');
          console.log('thisApp:', thisApp);
          console.log('classNames:', classNames);
          console.log('settings:', settings);
          console.log('templates:', templates);
          thisApp.initData();
          thisApp.initMenu();
    },
  };  

  app.init();
} 
