import { templates, select } from './../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';

class Booking {
  constructor (elem) {
    const thisBooking = this;
    thisBooking.render(elem);
    thisBooking.initWidgets();
    thisBooking.getData();
  }

  /*getData(){
    const thisBooking = this;

    const params = {

    };

    console.log('getData params', params);

    const urls = {
      booking:       settings.db.url + '/' + settings.db.booking + '?',
      eventsCarrent: settings.db.url + '/' + settings.db.event + '?',
      eventsRepeat:  settings.db.url + '/' + settings.db.event + '?',

    };
  } */


  render(element) {
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();
    thisBooking.dom = {};
    thisBooking.wrapper = element;
    thisBooking.wrapper.innerHTML = generatedHTML;

    thisBooking.dom.peopleAmount = thisBooking.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.wrapper.querySelector(select.booking.hoursAmount);

    thisBooking.dom.datePicker = thisBooking.wrapper.querySelector(select.widgets.datePicker.wrapper);
  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
  }
}

export default Booking;
