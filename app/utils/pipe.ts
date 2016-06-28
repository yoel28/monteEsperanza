import {Pipe} from "@angular/core";

@Pipe({
    name : "fecha"
})

export class Fecha{
    transform(value){
        let val;
        try{
            val= new Date(value);
        }catch (e){
            val= new Date(value.replace(/[TZ]/g, " "));
        }
        return val;
    }
}
