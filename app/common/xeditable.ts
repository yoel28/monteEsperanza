import {ElementRef, Directive, EventEmitter, Component, OnInit} from "@angular/core";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {HttpUtils} from "../common/http-utils";
import moment from 'moment/moment';
import {globalService} from "./globalService";


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
            type: that.rules[that.field].type || 'text',
            value: that.data[that.field] || (that.field=='password'?"":"N/A"),
            disabled: that.disabled,
            display: that.rules[that.field].display || null,
            showbuttons: that.rules[that.field].showbuttons || false,
            mode: that.rules[that.field].mode || 'inline',
            source:that.rules[that.field].source || null,
            step:that.rules[that.field].step||"any",
            validate: function (newValue) {
                if(that.function)
                {
                    that.function(that.field, that.data, newValue, that.endpoint).then(
                        function (value) {
                            return;
                        }, function (reason) {
                            jQuery(that.el.nativeElement).editable('setValue', that.data[that.field], true);
                        }
                    );
                }
            }
        });
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
            beforeShowYear: function (date){
                if (date.getFullYear() < 2016) {
                    return false;
                }
            }
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



