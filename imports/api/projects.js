import { Mongo } from 'meteor/mongo';
 
export const Projects = new Mongo.Collection('projects');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('projects', function() {
    return Projects.find();
  });
}