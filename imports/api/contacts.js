import { Mongo } from 'meteor/mongo';
 
export const Contacts = new Mongo.Collection('contacts');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('contacts', function() {
    return Contacts.find();
  });
}