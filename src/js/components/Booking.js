import { templates, select, settings, classNames } from './../settings.js';
import { utils } from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  constructor (elem) {
    const thisBooking = this;
    thisBooking.render(elem);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.initTables();
  }

  initTables() {
    const thisBooking = this;
    for(let table of thisBooking.dom.tables) {
      table.addEventListener('click', function(e) {
        e.preventDefault();
        const tableId = parseInt(table.getAttribute('data-table'));

        if(table.classList.contains(classNames.booking.tableBooked)) {
          alert('Zajęte!');
        } else {
          thisBooking.tableId = tableId;
          const activeTable = thisBooking.wrapper.querySelector('.table-selected');
          if(activeTable) activeTable.classList.remove('table-selected');
          table.classList.add('table-selected');
        }
      });
    }
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
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
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
        thisBooking.parseData(bookings, eventsCarrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCarrent, eventsRepeat){
    const thisBooking = this;

    thisBooking.booked = {};

    for(let item of eventsCarrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for(let item of bookings){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for(let item of eventsRepeat){
      if(item.repeat == 'daily'){
        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.date, item.hour, item.duration, item.table);
        }
      }
    }

    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table){
    const thisBooking = this;

    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour); //12
    for(let hourBlock = startHour; hourBlock < 14; hourBlock += 0.5) {
      // console.log('loop', hourBlock);

      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  updateDOM(){
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    thisBooking.tableId = null;
    const activeTable = thisBooking.wrapper.querySelector('.table-selected');
    if(activeTable) activeTable.classList.remove('table-selected');

    for(let table of thisBooking.dom.tables) {
      if(!thisBooking.booked[thisBooking.date] || !thisBooking.booked[thisBooking.date][thisBooking.hour]) {
        table.classList.remove(classNames.booking.tableBooked);
      }
      else {
        const tableId = parseInt(table.getAttribute('data-table'));
        if(thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)) {
          table.classList.add(classNames.booking.tableBooked);
        }
        else {
          table.classList.remove(classNames.booking.tableBooked);
        }
      }
    }

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
    thisBooking.dom.hourPicker = thisBooking.wrapper.querySelector(select.widgets.hourPicker.wrapper);

    thisBooking.dom.tables = thisBooking.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.dom.form = thisBooking.wrapper.querySelector(select.booking.form);
    thisBooking.dom.starters = thisBooking.wrapper.querySelectorAll(select.booking.starters);

    thisBooking.dom.address = thisBooking.wrapper.querySelector(select.booking.address);
    thisBooking.dom.phone = thisBooking.wrapper.querySelector(select.booking.phone);
  }

  initWidgets() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });

    thisBooking.dom.form.addEventListener('submit', function(event) {
      event.preventDefault();
      thisBooking.sendBooked();
      //return false;
    });
  }

  sendBooked() {
    const thisBooking = this;

    const url = settings.db.url + '/' + settings.db.booking;

    const payload = {
      address: thisBooking.dom.address.value,
      phone: thisBooking.dom.phone.value,
      ppl: thisBooking.peopleAmount.value,
      hours: thisBooking.hoursAmount.value,
      date: thisBooking.datePicker.value,
      hour: thisBooking.hourPicker.value,
      table: parseInt(thisBooking.tableId),
      starters: [],
    };

    for(const starter of thisBooking.dom.starters) {
      if(starter.checked) {
        payload.starters.push(starter.value);
      }
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function(response){
        return response.json();
      }).then(function(){
        thisBooking.makeBooked(payload.date, payload.hour, payload.hours, payload.table);
      });
  }

}

export default Booking;
