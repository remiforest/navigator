import { Template } from 'meteor/templating';
import { Customers } from '../api/customers.js';
import { Contacts } from '../api/contacts.js';
import { Projects } from '../api/projects.js';
import { Entities } from '../api/entities.js';

import './home.html';


// - - - - - -  Home  - - - - - - - //

Template.Home.helpers({
  customers() {
    // Returns all customers
    return Customers.find({});
  },
});


Template.Home.events({
    'click #createCustomerBtn'(event) {    // Create new customer

    // Prevent default browser form submit
    event.preventDefault();
 
    // Get value from form element
    const name = $("#newCustomerInput").val();

    // Insert a customer into the collection
    Meteor.call("createCustomer",name);
 
    // Clear form
    $("#newCustomerInput").val("");

    // Close modal
    $("#newCustomerModal").modal('hide');
  },

  'click .delete'() { // Delete a customer 
    Customers.remove(this._id);
  },
  'click .customer-item'(){
    Session.set("div_rendered",false);
    Session.set("clicked-item",this);
  }
})
