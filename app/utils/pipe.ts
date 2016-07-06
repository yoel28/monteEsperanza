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
@Pipe({
    name : "divide",
    
})
export class Divide{
    transform(data,splice){
        let value:any=[];
        let count:number=0;
        let index=0;
        try{
            data.forEach((obj)=>{
                if(splice <= count)
                {
                    count=0;
                    index++;
                }
                if(!value[index])
                    value[index]=[];
                value[index].push(obj);
                count++;

            })

        }catch (e){

        }
        return value;
    }
}
