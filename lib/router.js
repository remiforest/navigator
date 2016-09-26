import { Customers } from '../imports/api/customers.js';
import { Entities } from '../imports/api/entities.js';
import { Contacts } from '../imports/api/contacts.js';
import { Projects } from '../imports/api/projects.js';

Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  waitOn: function() {
    return [Meteor.subscribe('customers'),Meteor.subscribe('entities'),Meteor.subscribe('contacts'),Meteor.subscribe('projects')];
  }
});

Router.route('/', {name: 'Home'});


Router.route('/customer/:customer', {
  name: 'Customer',
  data: function () {
      if(Session.get("div_rendered") != true){Session.set("div_rendered",false);}
      return Customers.findOne({_id: this.params.customer});
    },
});

Router.route('/project/:_id', function () {
  this.render('ProjectDetail', {
    data: function () {
      return Projects.findOne({_id:this.params._id});
    }
  });
});

Router.route('/contact/:_id', function () {
  this.render('ContactDetail', {
    data: function () {
      return Contacts.findOne({_id:this.params._id});
    }
  });
});



// this.route('profile', { 
//   path: '/profile/:_id',
//   template: 'profile',
//   data: function() { return Users.findOne(this.params._id); }
// });