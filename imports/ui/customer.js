// - - - - - -  Customer page  - - - - - - - //

import { Customers } from '../api/customers.js';
import { Contacts } from '../api/contacts.js';
import { Projects } from '../api/projects.js';
import { Entities } from '../api/entities.js';

import './customer.html';



Template.Customer.helpers({
  jsReady(){ // Checks if google charts library is properly loaded
    // console.log("checking jsready");
    // console.log(Session.get("gchartsLoaded"));
    // console.log(Session.get("div_rendered"));
    if(Session.get("gchartsLoaded") && Session.get("div_rendered")){
      return true;
    }
    return false;
  },
  customerChart(){ // Draws customer org chart

    // console.log("customerChart");

    // Create the chart object
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Name');
    data.addColumn('string', 'Manager');

    // Add customer row
    data.addRow([{v:this._id,f:this.name},'']);


    // Recursively add child elements
    const root_entities = Entities.find({customer:this._id,father_entity:false})
    if(root_entities.count()>0){
      const cust_id = this._id;
      root_entities.forEach(function(doc){
        data.addRow([{v:doc._id,f:doc.name},cust_id]);
        data = get_childs(doc,data);
      });
    }

    // Instanciate the chart.
    const cdiv = $("#chart_div")[0];
    let chart = new google.visualization.OrgChart(cdiv);    
    google.visualization.events.addListener(chart, 'select', selectHandler);

    function selectHandler(e) {
      // When a box is clicked, updates all the related elements
      const selectedItem = chart.getSelection()[0];
      // console.log(selectedItem);
      Session.set("selected-box",selectedItem);
      var clicked_id = data.getValue(selectedItem.row, 0);
      const cust = Customers.findOne({_id:clicked_id});
      const ent = Entities.findOne({_id:clicked_id});
      if(cust){
        Session.set("clicked-item",cust);
      }else{
        Session.set("clicked-item",ent);
      }
    }



    // Draws the chart
    var options = {'size':'large'};
    chart.draw(data, options);
    const selectedItem = Session.get("selected-box");
    if(selectedItem){
        chart.setSelection([selectedItem]);
    }else{
        chart.setSelection([{row:0,column:null}]);
        selectHandler();
    }


    function get_childs(father,data){ // Recursively get childs for a given node
      const childs = Entities.find({father_entity:father._id});
      if(childs.count()>0){
        childs.forEach(function(doc){
          data.addRow([{v:doc._id,f:doc.name},father._id]);
          data = get_childs(doc,data);
        });
        return data;
      }
      return data;
    }
  },
  moveChart(){ // Draws customer org chart in move modal

    // Create the chart object
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Name');
    data.addColumn('string', 'Manager');

    // Add customer row
    data.addRow([{v:this._id,f:this.name},'']);


    // Recursively add child elements
    const root_entities = Entities.find({customer:this._id,father_entity:false})
    if(root_entities.count()>0){
      const cust_id = this._id;
      root_entities.forEach(function(doc){
        data.addRow([{v:doc._id,f:doc.name},cust_id]);
        data = get_childs(doc,data);
      });
    }

    // Instanciate the chart.
    const cdiv = $("#move_chart_div")[0];
    let chart = new google.visualization.OrgChart(cdiv);    
    google.visualization.events.addListener(chart, 'select', selectHandler2);

    function selectHandler2(e) {
      var entity = $("#deleteEntityBtn").attr("data-entity");
      const selectedItem = chart.getSelection()[0];
      var new_father = data.getValue(selectedItem.row, 0);
      console.log(entity);
      console.log(new_father);
      Meteor.call("moveEntity",entity,new_father);
      $("#moveEntityModal").modal('hide');
    }

    // Draws the chart
    var options = {'size':'large'};
    chart.draw(data, options);

    function get_childs(father,data){ // Recursively get childs for a given node
      const childs = Entities.find({father_entity:father._id});
      if(childs.count()>0){
        childs.forEach(function(doc){
          data.addRow([{v:doc._id,f:doc.name},father._id]);
          data = get_childs(doc,data);
        });
        return data;
      }
      return data;
    }
  },
  clickedEntity(){ // Returns cliecked entity doc
    // console.log("checking entity");
    const clicked_item = Session.get("clicked-item");
    // console.log(clicked_item);
    if(clicked_item){
        const ent = Entities.findOne({_id:clicked_item._id});
        return ent;
    }
    return false;
  },
  clickedCustomer(){ // Returns clicked customer doc
    // console.log("checking customer");
    const clicked_item = Session.get("clicked-item");
    // console.log(clicked_item);
    if(clicked_item){
        const cust = Customers.findOne({_id:clicked_item._id});
        return cust;
    }
    return false;
  },
})

Template.Customer.events({
    'click #createEntityBtn'(event) { // Create new entity
        // Prevent default browser form submit
        event.preventDefault();

        // Get value from form element
        const name = $("#newEntityInput").val();
        const customer = $("#newEntityModal").attr('data-customer');
        const entity = $("#newEntityModal").attr('data-entity');
        let father_entity = false;
        if(entity){
            father_entity = entity;
        }

        // Insert an entity into the collection
        Meteor.call('createEntity',{
            name,
            customer,
            father_entity
        });

        // Clear form
        $("#newEntityInput").val("");

        // Close modal
        $("#newEntityModal").modal('hide');
    },

    'click #confirmDeleteEntityBtn'() { // Delete a customer
        const customer = $("#deleteEntityModal").attr('data-customer');
        const entity = $("#deleteEntityModal").attr('data-entity');
        if(entity){
            Meteor.call("deleteEntity",entity);
        }else{
            Meteor.call("deleteCustomer",customer); 
            window.location.href="/";     
        }
        // Close modal
        $("#deleteEntityModal").modal('hide');
        Session.set("selected-box",{row:0,column:null});
    },
})

Template.Customer.rendered = function(){
  Session.set("div_rendered",true);
}


Template.customerDescription.events({
    'click #saveCustomerDescriptionBtn'() {
        // Get value from form element
        const description = $("#customer-description").val();

        // Updates the entity description
        Meteor.call("updateCustomerDescription",this._id,description);

        $("#saveCustomerDescriptionBtn").hide();
    },
})

Template.customerDescription.rendered = function(){
    $("#saveCustomerDescriptionBtn").hide();
    $( "#customer-description" ).bind('input propertychange', function() {
        $("#saveCustomerDescriptionBtn").show();
    });
}

Template.customerProjects.helpers({
  projects(){
    const clicked_item = Session.get("clicked-item");
    if(clicked_item){
        return Projects.find({customer:clicked_item._id});
    }
    return false;
  },
})

Template.customerContacts.helpers({
  contacts(){
      return Contacts.find({customer:this._id});
  },
})




