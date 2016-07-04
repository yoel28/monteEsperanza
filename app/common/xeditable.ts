import {ElementRef, Directive, EventEmitter} from "@angular/core";
import {Http} from "@angular/http";
import {ToastsManager} from "ng2-toastr/ng2-toastr";
import {HttpUtils} from "../common/http-utils";

declare var jQuery:any;
@Directive({
    selector: "[x-editable]",
    inputs: ['data', 'rules', 'field', 'function', 'endpoint'],
    outputs: ['success']
})
export class Xeditable {
    public success:any;
    public data:any = {};
    public rules:any = {};
    public field:string;
    public endpoint:string;
    public function:any;
    public httputils:HttpUtils;

    constructor(public el:ElementRef, public http:Http, public toastr?:ToastsManager) {
        this.success = new EventEmitter();
        this.httputils = new HttpUtils(http, toastr);
    }

    ngOnInit() {
        let that = this;
        jQuery(this.el.nativeElement).editable({
            type: that.rules[that.field].type || 'text',
            value: that.data[that.field] || "N/A",
            disabled: that.rules[that.field].disabled ? that.rules[that.field].disabled : ( that.data.enabled ? !that.data.enabled : false),
            display: that.rules[that.field].display || null,
            showbuttons: false,
            validate: function (newValue) {
                that.function(that.field, that.data, newValue, that.endpoint).then(
                    function (value) {
                        return;
                    }, function (reason) {
                        jQuery(that.el.nativeElement).editable('setValue', that.data[that.field], true);
                    }
                );
            }
        });
    }
}


@Directive({
    selector: "[x-file]"
})
export class Xfile {
    constructor(public el:ElementRef) {
    }
    ngOnInit() {
        jQuery(this.el.nativeElement).fileinput({
            language: "es",
            browseLabel: 'Imagen',
            previewFileType: "image",
            browseClass: "btn btn-success",
            browseIcon: "<i class=\"glyphicon glyphicon-picture\"></i> ",
            maxFilePreviewSize: 10240,
            showCaption: false,
            showRemove: false,
            showUpload: false,
        });
    }
}

@Directive({
    selector: "[pull-bottom]"
})
export class PullBottom {
    constructor(public el:ElementRef) {
    }
    ngOnInit() {
        let that = jQuery(this.el.nativeElement);
        let val = that.parent().parent().height() - that.parent().height();
        that.css('margin-top',val > 0 ? val : 20);

    }
}



