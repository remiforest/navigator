import { Customers } from '../api/customers.js';
import { Contacts } from '../api/contacts.js';
import { Projects } from '../api/projects.js';
import { Entities } from '../api/entities.js';

import './contact.html';


Template.ContactDetail.helpers({
    contact_entity(){
        return Entities.findOne({_id:this.entity});
    },
    contact_customer(){
        return Customers.findOne({_id:this.customer});
    },
    contact_manager(){
        return Contacts.findOne({_id:this.reports_to});
    },
    contact_projects(){
        return Projects.find({"contacts.contact":this._id});
    },
    editContact(){
        return Session.get("editContact");
    }
})

Template.ContactDetail.events({
  'click #confirmDeleteContactBtn'() {
    window.location.href = "/customer/"+this.customer;
    Meteor.call("deleteContact",this._id);
  },
  'click #edit-contact'() {
    Session.set("editContact",true);
  },
  'click #save-contact'() {
    const _id = this._id;
    const name = $("#contactName").val();
    const position = $("#contactPosition").val();
    const email = $("#contactEmail").val();
    const phone = $("#contactPhone").val();

    // Insert an new contact
    Meteor.call("updateContact",
      _id,
      name,
      position,
      email,
      phone,
    );

    // Clear form
    $("#contactName").val("");
    $("#contactPosition").val("");
    $("#contactEmail").val("");
    $("#contactPhone").val("");

    Session.set("editContact",false);
  },
})