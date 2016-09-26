// - - - - - -  Customer page  - - - - - - - //

import { Customers } from '../api/customers.js';
import { Contacts } from '../api/contacts.js';
import { Projects } from '../api/projects.js';
import { Entities } from '../api/entities.js';

import './entity.html';

// - - - - - EntityDescription - - - - - //


Template.entityDescription.events({
  'click #saveEntityDescriptionBtn'() {
    // Get value from form element
    const description = $("#entity-description").val();
    const _id = $("#saveEntityDescriptionBtn").attr("data-id");
    // Updates the entity description
    Meteor.call("updateEntityDescription",_id,description);

    $("#saveEntityDescriptionBtn").hide();
 
  },
})

Template.entityDescription.rendered = function(){
    $("#saveEntityDescriptionBtn").hide();
    $( "#entity-description" ).bind('input propertychange', function() {
        $("#saveEntityDescriptionBtn").show();
    });
}


// - - - - - EntityProjects - - - - - //


Template.entityProjects.helpers({
  projects() {
    return Projects.find({customer:this.customer,entity:this._id});
  },
  customer(){
    return Customers.findOne({_id:this.customer});
  }
})


Template.entityProjects.events({
  'click #createProjectBtn'(event) {
    // Get value from form element
    const name = $("#newProjectName").val();
    const customer = this.customer;
    const entity = this._id;

    // Insert an entity into the collection
    Meteor.call("createProject",name,customer,entity);

    // Clear form
    $("#newProjectName").val("");
    $("#newProjectDescription").val("");

    // Close modal
    $("#newProjectModal").modal('hide');
  },
})




// - - - - - EntityContacts - - - - - //


Template.entityContacts.helpers({
  contacts() {
    return Contacts.find({entity:this._id});
  },
  customer(){
    return Customers.findOne({_id:this.customer});
  },
  entityContacts(){
    return Contacts.find({entity:this._id});
  },
})

Template.entityContacts.events({
  'click #createContactBtn'(event) {
    // Get value from form element
    const name = $("#newContactName").val();
    const position = $("#newContactPosition").val();
    const email = $("#newContactEmail").val();
    const phone = $("#newContactPhone").val();
    const is_manager = $("#newContactIsManager").is(':checked');
    const customer = this.customer;
    const entity = this._id;
    const reports_to = $("#contactManager").attr("data-id");

    // Insert an new contact
    Meteor.call("createContact",
      name,
      position,
      email,
      phone,
      is_manager,
      customer,
      entity,
      reports_to
    );

    // Clear form
    $("#newContactName").val("");
    $("#newContactPosition").val("");
    $("#newContactEmail").val("");
    $("#newContactPhone").val("");
    $("#newContactIsManager").attr('checked', false);
    $("#manager").attr('data-id', "");

    // Close modal
    $("#newContactModal").modal('hide');

  },

  'click .delete-contact'() {
    Contacts.remove(this._id);
  },
  'click .set-contact-manager'(){
    $("#contactManager").attr("data-id",this._id);
    $("#contactManager").text(this.name);
    $("#newContactManagerModal").modal('hide');
  }
})
