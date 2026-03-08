export default class Contact{

    constructor({id,name,img}){
        this.id = id;
        this.name = name;
        this.img = img;
        this.messages = [];
    }

    addMessage(msg) {
        this.messages.push(msg);
    }

    getUsername(){
        return this.name;
    }

    setUsername(name){
        this.name = name;
    }
}

