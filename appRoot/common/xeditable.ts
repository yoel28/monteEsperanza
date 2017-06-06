import {ElementRef, Directive, EventEmitter, Component, OnInit} from "@angular/core";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {HttpUtils} from "../common/http-utils";
import moment from 'moment/moment';
import {globalService} from "./globalService";
import {Control} from "@angular/common";

declare var jQuery:any;
@Directive({
    selector: "[x-editable]",
    inputs: ['data', 'rules', 'field', 'function', 'endpoint','disabled'],
    outputs: ['success']
})
export class Xeditable implements OnInit {
    public success:any;
    public data:any = {};
    public rules:any = {};
    public field:string;
    public endpoint:string;
    public function:any;
    public httputils:HttpUtils;
    public disabled:boolean;

    constructor(public el:ElementRef, public http:Http,public myglobal:globalService, public toastr?:ToastsManager) {
        this.success = new EventEmitter();
        this.httputils = new HttpUtils(http, toastr);
    }

    ngOnInit() {
        let that = this;
        if(that.disabled==null)
            that.disabled = that.rules[that.field].disabled!=null ? that.rules[that.field].disabled : ( that.data.enabled ? !that.data.enabled : false)

        jQuery(this.el.nativeElement).editable({
            type: that._type,
            value: that._value,
            disabled: that.data.enabled?that.disabled:(that.data.enabled==null?that.disabled:true),
            display: that.rules[that.field].display || null,
            showbuttons: that.rules[that.field].showbuttons || false,
            mode: that.rules[that.field].mode || 'inline',
            source:that._source,
            step:that.rules[that.field].step||"0.001",
            select2: {
                width:350,
                multiple:true,
                placeholder: that.rules[that.field].placeholder,
            },
            validate: function (newValue) {
                if(that.function)
                {
                    if(that._type == 'select2'){
                        let data=[];
                        newValue = newValue.split(',');
                        newValue.forEach(val=>{
                            if(!isNaN(parseFloat(val))){
                                data.push(parseFloat(val));
                            }
                        });
                        newValue = data;
                    }
                    if(that._type == 'checklist' && that.rules[that.field].onlyId){
                        newValue = newValue.map(Number);
                    }


                    that.function(that.field, that.data, newValue, that.endpoint).then(
                        function (value) {
                            jQuery(that.el.nativeElement).editable('setValue', that._parseNewValue(value[that.field]), true);
                        }, function (reason) {
                            jQuery(that.el.nativeElement).editable('setValue', that.data[that.field], true);
                        }
                    );
                }
            }
        });
    }

    private _parseNewValue(data:any){
       if(this._type == 'checklist'){
           return data.map(({value})=>(<number>value));
       }
       return data;
    }

    private get _source(){
        if(this.rules[this.field].type == 'list'){
            if(this.rules[this.field].subtype == 'inlist' &&  this.rules[this.field].list){
                return this.data[this.rules[this.field].list] || []
            }
            return this.rules[this.field].source || this.data[this.field];
        }

        return this.rules[this.field].source || null;
    }
    private get _type(){
        if(this.rules[this.field].type == 'list')
            return 'checklist';

        return this.rules[this.field].type || 'text'
    }
    private get _value(){
        if(this._type == 'select2'){
            return this.data[this.field];
        }
        if(this._type == 'checklist'){
            let data = this.data[this.field].map(({value})=>(<number>value));
            return data;
        }
        return this.data[this.field]!=null?(this.data[this.field]):(this.field=='password'?"":"N/A")
    }
}


@Directive({
    selector: "[x-file]"
})
export class Xfile implements OnInit{
    constructor(public el:ElementRef) {
    }
    ngOnInit() {
        jQuery(this.el.nativeElement).fileinput({
            browseLabel: 'Imagen',
            previewFileType: "image",
            browseClass: "btn btn-blue",
            browseIcon: "<i class=\"fa fa-image\"></i> ",
            showCaption: false,
            showRemove: false,
            showUpload: false,
            showPreview: false,
        });
    }
}

@Directive({
    selector: "[x-cropit]",
    inputs: ['imageSrc'],
    outputs:   ['saveImagen'],
})
export class Xcropit implements OnInit{
    public saveImagen:any;
    public imageSrc:string;
    constructor(public el:ElementRef) {
        this.saveImagen = new EventEmitter();
    }
    ngOnInit() {
        let that = jQuery(this.el.nativeElement);
        let _this = this;
        that.find('.cropit-preview').css({
            'background-color': '#f8f8f8',
            'background-size': 'cover',
            'border': '1px solid #ccc',
            'border-radius': '3px',
            'margin-top': '7px',
            'width': '150px',
            'height': '150px',
        })
        that.find('.cropit-preview-image-container').css({'cursor': 'move'})
        that.find('.image-size-label').css({'margin-top': '10px'})
        that.find('input, .export').css({'display':'block'})
        that.find('button').css({'margin-top':'10px'})

        that.cropit({
            onImageLoaded:function () {
                let imageData = that.cropit('export');
                if(imageData)
                    _this.saveImagen.emit(imageData);
            },
            onOffsetChange:function () {
                let imageData = that.cropit('export');
                if(imageData)
                    _this.saveImagen.emit(imageData);
            },
            imageState: { src: _this.imageSrc || "" }
        });
        that.find('.rotate-cw').click(function(event) {
            event.preventDefault();
            that.cropit('rotateCW');
            let imageData = that.cropit('export');
            if(imageData)
                _this.saveImagen.emit(imageData);
        });
        that.find('.rotate-ccw').click(function(event) {
            event.preventDefault();
            that.cropit('rotateCCW');
            let imageData = that.cropit('export');
            if(imageData)
                _this.saveImagen.emit(imageData);
        });
    }
}

@Directive({
    selector: "[sm-dropdown]"
})
export class SMDropdown {
    constructor(el: ElementRef) {
        jQuery(el.nativeElement).dropdown();
    }
}

@Directive({
    selector: "[datepicker]",
    inputs:['format'],
    outputs:['fecha']
})
export class Datepicker implements OnInit {
    // public format={
    //     format: "mm/yyyy",
    //     startView: 2,
    //     minViewMode: 1,
    //     maxViewMode: 2,
    //     todayBtn: "linked",
    //     language: "es",
    //     forceParse: true,
    //     autoclose: true,
    //     todayHighlight: true,
    //     return: 'YYYY/MM',
    // }
    public format:any = {};
    public fecha:any;
    public element:any;
    constructor(public el: ElementRef) {
        this.fecha = new EventEmitter();
    }
    ngOnInit(){
        let that = this;
        that.element = jQuery(this.el.nativeElement).datepicker({
            format: that.format.format,
            startView: that.format.startView,
            minViewMode: that.format.minViewMode,
            maxViewMode: that.format.maxViewMode,
            todayBtn: that.format.todayBtn,
            language: that.format.language,
            forceParse: that.format.forceParse,
            autoclose: that.format.autoclose,
            todayHighlight: that.format.todayHighlight,
            startDate:that.format.startDate,
            endDate:new Date(),
        });
        jQuery(this.el.nativeElement).datepicker().on('changeDate', function (ev) {
            if(that.format.return)
                that.fecha.emit({'date':moment.utc(ev.date).format(that.format.return),'key':ev.target.accessKey});
            else
                that.fecha.emit({'date':ev.date,'key':ev.target.accessKey});
        })
        jQuery('#formato').click(function (ev) {
            jQuery(that.el.nativeElement).datepicker({
                format: "yyyy",
            })

        })
    }
}

@Directive({
    selector: "[knob]",
    outputs:['elem']
})
export class Knob {
    public elem:any;

    constructor(el: ElementRef) {
        let data = jQuery(el.nativeElement).knob();
        this.elem = new EventEmitter();
        this.elem.emit({data});
    }
}
@Directive({
    selector: "[daterangepicker]",
    inputs:['params'],
    outputs:['fecha']
})
export class DateRangepPicker implements OnInit {
    /*
     format={
     }
     */

    public params:any={};
    public fecha:any;
    public element:any;
    constructor(public el: ElementRef) {
        this.fecha = new EventEmitter();
    }
    ngOnInit(){
        let that = this;
        that.element = jQuery(this.el.nativeElement).daterangepicker({
                showDropdowns: true,
                minDate:that.params.minDate
            },
            function(start, end) {
                that.fecha.emit({'start':start.format(that.params.format),'end':end.add(1,'day').format(that.params.format)})
            });
        jQuery(that.element).on('cancel.daterangepicker', function(ev, picker) {
            //do something, like clearing an input
            that.fecha.emit(null);
        });
    }
}

@Directive({
    selector: "[drap-resize]"
})
export class DrapResize {
    constructor(el: ElementRef) {
        //jQuery(el.nativeElement).draggable().resizable();
    }
}

@Directive({
    selector: "[color-picker]",
    inputs:['hex'],
    outputs:['color']
})
export class ColorPicker {
    public hide:any;
    public hex:Control;
    public color:any;

    constructor(public element:ElementRef) {
        this.hex = new Control('');
        this.color = new EventEmitter();
    }
    ngOnInit(){
        let that = this;

        jQuery(this.element.nativeElement).ColorPicker({
            color: that.hex.value,
            onShow: function (colpkr) {
                jQuery(colpkr).fadeIn(500);
                return false;
            },
            onHide: function (colpkr) {
                that.color.emit(that.hex.value);
                jQuery(colpkr).fadeOut(500);
                return false;
            },
            onChange: function (hsb, hex, rgb) {
                that.hex.updateValue(hex);
                jQuery(that.element.nativeElement).css('backgroundColor', '#' + that.hex.value);
                jQuery(that.element.nativeElement).val('#'+that.hex.value);
            }
        })
        jQuery(that.element.nativeElement).css('backgroundColor', '#' + that.hex.value);
        jQuery(that.element.nativeElement).val('#'+that.hex.value);
    }
}
