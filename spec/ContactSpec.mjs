import Person from '../js/person.js';

describe("Print Contact",function(){
    let contact;
    beforeEach(function(){
        console.log("called beforeEach");
        contact = new Person({id:1,name:"Hannes",img:null,online:"yesterday"});
    });

    it("should return first name",function(){
        //let contact = new Person(1,"Hannes",null,"yesterday");
        expect(contact.getUsername()).toEqual("Hannes");
    });

    it("should set user name",function(){
        let mySpy = spyOn(contact,'setUsername').and.callThrough();
        contact.setUsername("jschoenb");
        expect(mySpy).toHaveBeenCalledWith("jschoenb");
        expect(contact.getUsername()).toEqual("jschoenb");
    });
});