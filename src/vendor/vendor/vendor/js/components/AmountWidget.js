import { settings, select } from './../settings.js';

class AmountWidget {
  constructor(element){
    const thisWidget = this;

    thisWidget.getElements(element);
    thisWidget.setValue(settings.amountWidget.defaultValue);
    thisWidget.initActions();

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

  setValue(value) {
    const thisWidget = this;

    const newValue = parseInt(value);

    /* TODO: Add validation */

    if (newValue != thisWidget.value && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax){
      thisWidget.value = newValue;
      thisWidget.announce();
      thisWidget.input.value = thisWidget.value;
    } else {
      thisWidget.input.value = thisWidget.value;
      thisWidget.announce();
    }

  }

  initActions(){
    const thisWidget = this;

    thisWidget.linkDecrease.addEventListener('click', function(e) {
      e.preventDefault();
      thisWidget.setValue(thisWidget.value - 1);
    });

    thisWidget.linkIncrease.addEventListener('click', function(e) {
      e.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }

  announce(){
    const thisWidget = this;

    const event = new CustomEvent ('updated', {
      bubbles: true
    });

    thisWidget.element.dispatchEvent(event);
  }
}

export default AmountWidget;
