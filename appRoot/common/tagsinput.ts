import {ElementRef, Directive, EventEmitter, OnInit} from "@angular/core";
import {Control} from "@angular/common";
import {globalService} from "./globalService";

declare var jQuery:any;
declare var Bloodhound:any;
@Directive({
    selector: "[tags-input]",
    inputs:['control','type','data'],
    outputs:['instance']
})
export class TagsInput implements OnInit{
    public type = 'object';
    public data=[];
    public instance:any;
    public control:Control;

    constructor(public el: ElementRef,public gs: globalService) {
        this.instance = new EventEmitter();
        this.control = new Control([]);
    }
    ngOnInit(){
        let that=this;
        if(this.type == 'object'){
            jQuery(this.el.nativeElement).tagsinput(
                {
                    'tagClass': function(item) {
                        switch (item.id) {
                            case -2: return 'label label-red cursor-pointer'; //ya asignado a otro
                            case -1: return 'label label-black cursor-pointer'; //ya asignado a mi
                            case 0:  return 'label label-green cursor-pointer'; //entrada manual

                            case 1:  return 'label label-violet         cursor-pointer';
                            case 2:  return 'label label-yellow         cursor-pointer';
                            case 3:  return 'label label-orange         cursor-pointer';
                            case 4:  return 'label label-default        cursor-pointer';
                            case 5:  return 'label label-blue           cursor-pointer';
                            default: return 'label label-light-pink     cursor-pointer';
                        }
                    },
                    'itemTitle':function(item) {
                        return item.title;
                    },
                    'itemValue':function(item) {
                        return item.value;
                    }
                }
            );
        }

        if(this.type=='inlist'){

            let place = new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.obj.whitespace('text'),
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                local: this.data
            });
            place.initialize();

            jQuery(this.el.nativeElement).tagsinput({
                itemValue: 'value',
                itemText: 'text',
                typeaheadjs: {
                    name: 'place',
                    displayKey: 'text',
                    source: place.ttAdapter()
                }
            });
        }

        that.control.updateValue(jQuery(that.el.nativeElement).tagsinput('items'));
        this.instance.emit(this);
    }
    public addValue(data){
        jQuery(this.el.nativeElement).tagsinput('add', data);
    }
    public removeAll(){
        jQuery(this.el.nativeElement).tagsinput('removeAll');
    }
}