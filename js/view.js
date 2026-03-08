/**
*  View handle output to template.  On init gets DOM refs,
*  and expose to controller.  When model calls notify(),
*  View queries model for data and data performs pres. logic.
*/
import {getInstance as Model} from "./model.js";
import Person from "./person.js";

let view;

let printMessage = Symbol();
let printContact = Symbol();
let printHeader = Symbol();

class View {
    constructor(){
        this.DOM = {
            input: $("#input"),
            list: $("ul.list-group")
        }
        this.DOM.input.prop("disabled",true);
        $("#header").empty();
    }

    getDOM() {
        return this.DOM;
    }

    addContact(contact){
        this[printContact](contact);
    }

    contactChanged(contact, userId, elem){
        this.DOM.input.prop("disabled",false);
        $(".whatsapp-element").removeClass("active");
        $(elem).addClass("active");
        //clear chat window
        $(".message").remove();
        for(let msg of contact.messages){
            this[printMessage](msg,userId,$(".chatroom"));
        }
        //reset header
        this[printHeader](contact);
        $(elem).removeClass("new-message");
    }


    messageReceived(param){
        if(param.currentChatPartner && param.currentChatPartner.id == param.receiver){
            this[printMessage](param.msg, param.userId,$(".chatroom"));
        } else {
            $("#contact_" + param.receiver).addClass("new-message");
        }
    }
    //==========private methods ===================

    [printMessage](msg, userId, parent) {
        console.log("should print message");
        let username ="";
        if(msg.isGroupMsg && userId !== msg.senderId){
            username = "<b>"+Model().getContactById(msg.senderId).name + "</b></br>";
        }
        let div = $(`
        <div class="message ${(userId===msg.senderId?'out':'in')}">
            <div>
                <div>
                    ${username+msg.text}
                </div>
                <div class="time">
                    ${msg.time}
                </div>
            </div>
        </div>`);
        parent.append(div);
    }

    [printHeader](contact){
        $("#header").empty();
        let text;
        if (contact instanceof Person){
            text = `<span>zuletzt online ${contact.online}</span>`
        } else {
            let names = "";
            for(let i=0; i<contact.contacts.length;i++){
                names += contact.contacts[i].name;
                if (i < contact.contacts.length - 1) {
                    names  += ", ";
                }
            }
            text = `<span>${names}</span>`;
        }

        let div = $(`
            <div>
                <img class="chat_img" src="${contact.img}" alt="">
            </div>
            <div class="ml-2">
                <p class="font-weight-bold mb-0">${contact.name}</p>
                <small>${text}</small>
            </div>`);
        $("#header").append(div);
    }

    [printContact](contact){
        $("#contact_" + contact.id).remove();
        let lastMsg = contact.messages[contact.messages.length - 1];
        let text = lastMsg==undefined?"":lastMsg.text;
        let time = lastMsg==undefined?"":lastMsg.time;
        let contactLi = $(`
            <li id="contact_${contact.id}" class="list-group-item whatsapp-element">
                <div class="img-title-element">
                    <div>
                        <img class="chat_img" src="${contact.img}" alt="">
                    </div>
                    <div class="ml-2">
                        <p class="font-weight-bold mb-0">${contact.name}</p>
                        <small>${text}</small>
                    </div>
                </div>
                <p class="mb-0">${time}</p>
            </li>`);
        $(".list-group").prepend(contactLi);
        this.contactDiv = contactLi;
    }
}

export function getInstance() {
    if(!view) {
        view = new View();
    }
    return view;
}

