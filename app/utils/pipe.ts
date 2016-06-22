import {Pipe} from "@angular/core";

@Pipe({
    name : "fecha"
})

export class Fecha{
    transform(value){
        let val= new Date(value.replace(/[TZ]/g, " "));
        return val;
    }
}
