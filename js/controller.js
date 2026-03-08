/**
 *  Controllers handle input.  Gets DOM refs from View.
 *  then sets event handlers for input text box to add new
 *  item.  Performs register() of both View and itself
 *  to set up list checkbox and remove click event handlers
 *  after DOM rebuilt.
 */
import {getInstance as Model} from "./model.js";
import {getInstance as View} from "./view.js";

let controller;

let init = Symbol()

class Controller {
    constructor(){
        this[init]();

        let model = Model();
        let view = View();
        model.subscribe("addContact",view,view.addContact);
       // model.subscribe("contactChanged",view,view.contactChanged);
        model.subscribe("newMessage",view,view.messageReceived);
    }

    /**
     * Just for testing form console
     * @param text
     * @param senderId
     * @param receiverId
     */
    insertExternalMessage(text,senderId,receiverId){
        Model().insertMessage(text,senderId,receiverId);
    }

    [init](){
        let DOM = View().getDOM();
        // input handler
        DOM.input.keyup((ev) => {
            if (ev.which == 13) {
                Model().insertMessage(DOM.input.val());
				DOM.input.val("");
            }
        });

        DOM.list.on('click','.whatsapp-element',(ev)=> {
            //fetch the contact
            let id = ev.currentTarget.id;
            let index = id.lastIndexOf("_");
            id = id.substring(index + 1);
            let contact = Model().changeContact(id);
            View().contactChanged(contact, Model().getUserId(),ev.currentTarget )
        });
    }
}

export function getInstance() {
    if(!controller) {
        controller = new Controller();
    }
    return controller;
}
