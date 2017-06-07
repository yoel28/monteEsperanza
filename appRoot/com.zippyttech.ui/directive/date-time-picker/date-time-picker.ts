import {EventEmitter, OnInit, Directive, ElementRef} from "@angular/core";

declare var moment:any;
declare var jQuery:any;

@Directive({
    selector: "[date-time-picker]",
    inputs:['rule'],
    outputs:['change','hide']
})
export class DateTimePicker implements OnInit {

    public rule:any = {};

    public change:EventEmitter<string>;
    public hide:EventEmitter<string>;

    constructor(public el: ElementRef) {
        this.change = new EventEmitter();
        this.hide = new EventEmitter();
    }
    ngOnInit(){

        jQuery(this.el.nativeElement).datetimepicker({
            format:(this.rule.formatView || false)
        });

        jQuery(this.el.nativeElement).datetimepicker().on('dp.change',  (ev) => {
            let data =  moment(ev.date).format('YYYY-MM-DD HH:mm:ssX');
            if(this.rule.formatOut){
                if(typeof this.rule.formatOut === 'string'){
                    data =  moment(ev.date).format(this.rule.formatOut)
                }
                if(typeof this.rule.formatOut === 'function'){
                    data =  this.rule.formatOut(ev.date);
                }
            }
            this.change.emit(data);
        });
        jQuery(this.el.nativeElement).datetimepicker().on('dp.hide',  (ev) => {
            let data =  moment(ev.date).format('YYYY-MM-DD HH:mm:ssX');
            if(this.rule.formatOut){
                if(typeof this.rule.formatOut === 'string'){
                    data =  moment(ev.date).format(this.rule.formatOut)
                }
                if(typeof this.rule.formatOut === 'function'){
                    data =  this.rule.formatOut(ev.date);
                }
            }
            this.hide.emit(data);
        });

    }
}

