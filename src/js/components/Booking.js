import { templates, select } from './../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';


class Booking {
  constructor (elem) {
    const thisBooking = this;
    thisBooking.render(elem);
    thisBooking.initWidgets();
    thisBooking.getData();
  }

  getData(){
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);
     
    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],
      eventsCarrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };

    // console.log('getData params', params);

    const urls = {
      booking:       settings.db.url + '/' + settings.db.booking 
                                     + '?' + params.booking.join('&'),
      eventsCarrent: settings.db.url + '/' + settings.db.event 
                                     + '?' + params.eventsCarrent.join('&'),
      eventsRepeat:  settings.db.url + '/' + settings.db.event
                                     + '?' + params.eventsRepeat.join('&'),

    };

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCarrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponses){
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[0];
        const eventsRepeatResponse = allResponses[0];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCarrent, eventsRepeat]){
        console.log(bookings);
        console.log(eventsCarrent);
        console.log(eventsRepeat);
      });
  } 


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
