import { Mongo } from 'meteor/mongo';
 
export const Customers = new Mongo.Collection('customers');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('customers', function() {
    return Customers.find();
  });
}