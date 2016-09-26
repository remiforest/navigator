import { Mongo } from 'meteor/mongo';
 
export const Entities = new Mongo.Collection('entities');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('entities', function() {
    return Entities.find();
  });
}