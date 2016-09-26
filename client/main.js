import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';


import '../imports/ui/home.js';
import '../imports/ui/customer.js';
import '../imports/ui/entity.js';
import '../imports/ui/project.js';
import '../imports/ui/contact.js';


Session.set('gchartsLoaded', false);

Meteor.startup(function(){
    $.getScript('https://www.gstatic.com/charts/loader.js', function(){
     // script has loaded
     google.charts.load('current', {packages:["orgchart"]});
     google.charts.setOnLoadCallback(setChartsLoaded);
     function setChartsLoaded(){
        Session.set('gchartsLoaded', true);
     }
    });
    Session.set("editContact",false);
});

