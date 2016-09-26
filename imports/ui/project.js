import { Template } from 'meteor/templating';
import { Customers } from '../api/customers.js';
import { Contacts } from '../api/contacts.js';
import { Projects } from '../api/projects.js';
import { Entities } from '../api/entities.js';

import './project.html';






// - - - - - -  Project detail  - - - - - - - //



// - - - - - -  Project header  - - - - - - - //

Template.ProjectHeader.helpers({
  customer() {
    return Customers.findOne({_id:this.customer});
  },
  entity() {
    return Entities.findOne({_id:this.entity});
  },
});


Template.ProjectHeader.events({
  'click #confirmDeleteProjectBtn'() {
    window.location.href = "/customer/"+this.customer;
    Meteor.call("deleteProject",this._id);
  },
  'click #saveUCBtn'() {
    // Get value from form element
    const id = this._id;
    const usecase = $("#project-usecase").val();

    // Update project
    Meteor.call("updateProjectUC",id,usecase);
    Meteor.call("checkProject",id);
    $("#saveWBtn").hide()
  },
})

Template.ProjectHeader.rendered = function(){
  $("#saveUCBtn").hide();
  $( ".ucdata" ).bind('input propertychange', function() {
      $("#saveUCBtn").show();
  });
}

// - - - - - -  Project whys  - - - - - - - //


Template.ProjectWhys.helpers({
  
});


Template.ProjectWhys.events({
  'click #saveWBtn'() {
    // Get value from form element
    const id = this._id;
    const a = $("#project-wa").val();
    const m = $("#project-wm").val();
    const n = $("#project-wn").val();

    // Update project
    Meteor.call("updateProjectW",id,{a,m,n});
    Meteor.call("checkProject",id);
    $("#saveWBtn").hide()
  },
})

Template.ProjectWhys.rendered = function(){
  $("#saveWBtn").hide();
  $( ".wdata" ).bind('input propertychange', function() {
      $("#saveWBtn").show();
  });
}

// - - - - - -  Project contacts  - - - - - - - //
Template.ProjectContacts.helpers({
  projectContacts(){
    console.log("projectContacts()");

    let contacts = this.contacts;
    let project_contacts = []
    if(contacts){
      const arrayLength = contacts.length;
      for (var i = 0; i < arrayLength; i++) {
          let contact = Contacts.findOne({_id:contacts[i].contact});
          contact.role = contacts[i].role;
          project_contacts.push(contact)
      }
    }
    return project_contacts;
  },
  entityContacts(){
        console.log("entityContacts()");

    return Contacts.find({entity:this.entity});
  },
});


Template.ProjectContacts.events({
  'click #createProjectContactBtn'() {
    // Get value from form element
    const name = $("#newContactName").val();
    const position = $("#newContactPosition").val();
    const email = $("#newContactEmail").val();
    const phone = $("#newContactPhone").val();
    const is_manager = $("#newContactIsManager").is(':checked');
    const is_eb = $("#newContactIsEB").is(':checked');
    const customer = this.customer;
    const entity = this.entity;
    const project = this._id;

    // Insert an new contact
    let contact_id;
    let role = null;
    if(is_eb){role="eb"};
    Meteor.call("createContact",
      name,
      position,
      email,
      phone,
      is_manager,
      customer,
      entity,
      function(error, result){  
          Meteor.call("addContactToProject",project,result,role);
        }
    );

    // Clear form
    $("#newContactName").val("");
    $("#newContactPosition").val("");
    $("#newContactEmail").val("");
    $("#newContactPhone").val("");
    $("#newContactIsManager").attr('checked', false);
    $("#newContactIsEB").attr('checked', false);

    // Close modal
    $("#newContactModal").modal('hide');
    $("#newProjectContactModal").modal('hide');

  },
  'click .add-contact-to-project'(){
    let project = $("#project").attr("data-id");
    Meteor.call("addContactToProject",project,this._id);
    $("#newProjectContactModal").modal('hide');
  }
})

Template.ProjectContacts.rendered = function(){
  
}




// - - - - - -  Project vp  - - - - - - - //
Template.ProjectVP.helpers({
});


Template.ProjectVP.events({
  'click #saveVPBtn'() {
    // Get value from form element
    console.log(this);
    const id = this._id;
    const before = $("#project-before").val();
    const after = $("#project-after").val();
    const capabilities = $("#project-capabilities").val();
    const metrics = $("#project-metrics").val();

    // Update project
    Meteor.call("updateProjectVP",id,{before,after,capabilities,metrics});
    Meteor.call("checkProject",id);

    $("#saveVPBtn").hide()
  },
})

Template.ProjectVP.rendered = function(){
  $("#saveVPBtn").hide();
  $( ".vpdata" ).bind('input propertychange', function() {
      $("#saveVPBtn").show();
  });
}


// - - - - - -  Project mp  - - - - - - - //
Template.ProjectMP.helpers({
  
});


Template.ProjectMP.events({
  'click #saveMPBtn'() {

    // Get value from form element
    const id = this._id;    
    const M = $("#project-M").val();
    const E = $("#project-E").val();
    const Dc = $("#project-Dc").val();
    const Dp = $("#project-Dp").val();
    const P = $("#project-P").val();
    const I = $("#project-I").val();
    const Ch = $("#project-Ch").val();
    const Co = $("#project-Co").val();

    // Update project
    Meteor.call("updateProjectMP",id,{M,E,Dc,Dp,P,I,Ch,Co});
    Meteor.call("checkProject",id);
    $("#saveMPBtn").hide()
  },
})

Template.ProjectDetail.rendered = function(){
  $("#saveMPBtn").hide();
  $( ".mpdata" ).bind('input propertychange', function() {
      $("#saveMPBtn").show();
  });
}



// dataTableData = function (entity) {
//     return Contacts.find({entity:entity}).fetch(); // or .map()
// };

// var optionsObject = {
//     columns: [{
//         title: 'Name',
//         data: 'name', // note: access nested data like this
//         className: 'nameColumn'
//     },{
//         title: 'Position',
//         data: 'position', // note: access nested data like this
//         className: 'positionColumn'
//     },{
//         title: 'Is Manager',
//         data: 'is_manager', // note: access nested data like this
//         className: 'is_managerColumn'
//     },],
//     // ... see jquery.dataTables docs for more
// }



ReactiveTabs.createInterface({
  template: 'basicTabs',
  onChange: function (slug, template) {
    // This callback runs every time a tab changes.
    // The `template` instance is unique per {{#basicTabs}} block.
    console.log('[tabs] Tab has changed! Current tab:', slug);
    console.log('[tabs] Template instance calling onChange:', template);
  }
});



ReactiveDatatable = function(options) {
  var self = this;

  this.options = options = _.defaults(options, {
    // Any of these can be overriden by passing an options 
    // object into your ReactiveDatatable template (see readme)
    stateSave: true,
    stateDuration: -1, // Store data for session only
    pageLength: 5,
    lengthMenu: [3, 5, 10, 50, 100],
    columnDefs: [{ // Global default blank value to avoid popup on missing data
      targets: '_all',
      defaultContent: '–––'
    }],
    stateLoadParams: function(settings, data) {
      // Make it easy to change to the stored page on .update()
      self.page = data.start / data.length;
    }
  });
};

ReactiveDatatable.prototype.update = function(data) {
  if (!data) return;
  var self = this;

  self.datatable
    .clear()
    .rows.add(data)
    .draw(false)
    .page(self.page || 0) // XXX: Can we avoid drawing twice?
    .draw(false);     // I couldn't get the page drawing to work otherwise
};





Template.ReactiveDatatable.rendered = function() {
    var data = this.data;
    console.log("in custom 0");

    if (typeof data.tableData !== "function") {
        throw new Meteor.Error('Your tableData must be a function that returns an array via Cursor.fetch(), .map() or another (hopefully reactive) means')
    }
    
    console.log("in custom 1");
    var reactiveDataTable = new ReactiveDatatable(data.options);
    console.log("in custom 2");

    // Help Blaze cleanly remove entire datatable when changing template / route by
    // wrapping table in existing element (#datatable_wrap) defined in the template.
    var table = document.createElement('table');
    var tableClasses = data.options.tableClasses || "";
    table.className = 'table dataTable ' + tableClasses;
    
    // Render the table element and turn it into a DataTable
    this.$('.datatable_wrapper').append(table);
    var dt = $(table).DataTable(data.options);
    reactiveDataTable.datatable = dt;

    dt.on('page.dt', function(e, settings) {
        var info = dt.page.info();
        reactiveDataTable.page = info.page;
    });

    this.autorun(function() {
        console.log("in custom");
        console.log(data.entity);
        reactiveDataTable.update(data.tableData(data.entity));
    });
};
