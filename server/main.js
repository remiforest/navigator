import { Meteor } from 'meteor/meteor';
import { Customers } from '../imports/api/customers.js';
import { Contacts } from '../imports/api/contacts.js';
import { Projects } from '../imports/api/projects.js';
import { Entities } from '../imports/api/entities.js';


Meteor.methods({
    createCustomer(name){
        Customers.insert({
      name,
    });
    },
    updateCustomerDescription(id,description){
        Customers.update({_id:id},{$set:{description:description}}); 
    },
    updateEntityDescription(id,description){
        Entities.update({_id:id},{$set:{description:description}}); 
    },
    deleteEntity(entity){
        Entities.remove({_id:entity});
        Contacts.remove({entity:entity});
        Projects.remove({entity:entity});
    },
    deleteCustomer(customer){
        Customers.remove({_id:customer});
        Entities.remove({customer:customer});
        Projects.remove({customer:customer});  
        Contacts.remove({customer:customer}); 
    },
    createEntity(entity){
        Entities.insert(entity);
    },
    createProject(name,customer,entity){
        Projects.insert({
          name,
          customer,
          entity,
        });
    },
    createContact(name,
      position,
      email,
      phone,
      is_manager,
      customer,
      entity,reports_to){
            return Contacts.insert({name,
              position,
              email,
              phone,
              is_manager,
              customer,
              entity,reports_to});
    },
    updateContact(_id,
      name,
      position,
      email,
      phone,
      ){
            return Contacts.update({_id:_id},{$set:{name,
              position,
              email,
              phone}});
    },
    updateProjectVP(id,vp){
        Projects.update({_id:id},{$set:{vp:vp}});
    },
    updateProjectMP(id,mp){
        Projects.update({_id:id},{$set:{mp:mp}});
    },
    updateProjectW(id,w){
        Projects.update({_id:id},{$set:{w:w}});
    },
    updateProjectUC(id,usecase){
        Projects.update({_id:id},{$set:{usecase}});
    },
    deleteProject(id){
        Projects.remove({_id:id});
    },
    addContactToProject(project,contact,role){
        return Projects.update({_id:project},{$addToSet:{contacts:{contact,role}}});
    },
    checkProject(id){
        console.log(id);
        let project = Projects.findOne({_id:id});
        let w_complete = false;
        let vp_complete = false;
        let mp_complete = false;

        if(project.w){
          if(
            project.w.a &&
            project.w.m &&
            project.w.n
            ){w_complete = true;}
        }
        if(project.vp){
          if(
            project.vp.before &&
            project.vp.after &&
            project.vp.capabilities &&
            project.vp.metrics
            ){vp_complete = true;}
        }
        if(project.mp){
          if(
            project.mp.M &&
            project.mp.E &&
            project.mp.Dc &&
            project.mp.Dp &&
            project.mp.P &&
            project.mp.I &&
            project.mp.Ch &&
            project.mp.Co
          ){mp_complete = true;}
        }
            
            
        if(vp_complete && mp_complete && w_complete){
            Projects.update({_id:id},{$set:{complete:true}});
        }else{
            Projects.update({_id:id},{$set:{complete:false}});
        }
    },
    deleteContact(id){
        Contacts.remove({_id:id});
    },
    moveEntity(entity,father){
        // check if father is an entity
        if(!Entities.findOne({_id:father})){
            father = false;
        }
        if(entity != father){
            Entities.update({_id:entity},{$set:{father_entity:father}});
        }
    }
});