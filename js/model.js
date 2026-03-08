/**
 *  Model holds data with access and modify methods.
 *  register() adds items to subject.  When model state
 *  changes calls subject.notifyObservers() to redraw list.
 */
import Subject from './subject.js';
import Person from './person.js';
import Group from './group.js';
import Message from './message.js'

let whatsAppModel;

//private methods
let loadFromJSON = Symbol();
let addMessageToContact = Symbol();

class WhatsAppModel extends Subject {
    constructor() {
        super();
        this.contactList = new Map();
        this.personalId = undefined;
        this.currentChatPartner = undefined;
        this[loadFromJSON]();
    }

    getList () {
        return this.contactList;
    }

    addContact(contact){
        this.contactList.set(contact.id,contact);
        super.notifyObservers("addContact",contact);
    }

    getContactById(contactId){
        return this.contactList.get(contactId);
    }

    getUserId(){
        return this.personalId;
    }

    changeContact(newContactId){
        let selectedContact = this.getContactById(Number(newContactId));
        this.currentChatPartner = selectedContact;
        return selectedContact;
        //super.notifyObservers("contactChanged",{contact:selectedContact,elem:domElement,userId:this.#personalId});
    }

    insertMessage(text,senderId,receiverId){
        let currentDate = new Date();
        let options = {
            hour: "2-digit",
            minute: "2-digit"
        };
        let time = currentDate.toLocaleTimeString("de-de",options);
        let idOfSender = !senderId ? this.personalId : senderId;
        let receiverContact = !receiverId ? this.getContactById(this.currentChatPartner.id): this.getContactById(receiverId);
        let obj = {
            text: text,
            time: time,
            senderId: idOfSender
        }
        let msg = new Message(obj,receiverContact instanceof Group);
        receiverContact.addMessage(msg);
        super.notifyObservers("newMessage",{currentChatPartner: this.currentChatPartner, receiver: receiverContact.id,msg:msg,userId:this.personalId})
    }

    [loadFromJSON](){
        $.getJSON("json/contacts.json").then((data) => {
            this.personalId = data.personalId;
            for (let person of data.persons) {
                let contact = new Person(person);
                this[addMessageToContact](contact,person,false);
                this.addContact(contact);
            }
            for(let group of data.groups){
                let g = new Group(group);
                this[addMessageToContact](g,group,true);
                //add members to group
                for(let contactId of group.members){
                    if(contactId !== this.personalId){
                        let c = this.getContactById(contactId);
                        if(c){
                            g.addContact(c);
                            c.addGroup(g);
                        }
                    }
                }
                this.addContact(g);
            }
        });
    }

    [addMessageToContact](contact,jsonContact,isGroupMsg){
        for(let msg of jsonContact.messages){
            let message = new Message(msg,isGroupMsg);
            contact.addMessage(message);
        }
    }
}

export function getInstance() {
    if(!whatsAppModel) {
        whatsAppModel = new WhatsAppModel();
    }
    return whatsAppModel;
}
