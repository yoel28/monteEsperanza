import {EventEmitter, OnInit, Directive, ElementRef} from "@angular/core";

declare var moment:any;
declare var jQuery:any;

@Directive({
    selector: "[date-time-picker]",
    inputs:['format'],
    outputs:['fecha']
})
export class DateTimePicker implements OnInit {

    public format:any = {};
    public fecha:any;
    public element:any;
    constructor(public el: ElementRef) {
        this.fecha = new EventEmitter();
    }
    ngOnInit(){
        let that = this;
        that.element = jQuery(this.el.nativeElement).datetimepicker();
        jQuery(this.el.nativeElement).datetimepicker().on('dp.change',  (ev) => {
            that.fecha.emit(moment(ev.date).format('YYYY-MM-DD HH:mm:ssX'));
            console.log(moment(ev.date).format('YYYY-MM-DD HH:mmZ'))
        });
    }
}

