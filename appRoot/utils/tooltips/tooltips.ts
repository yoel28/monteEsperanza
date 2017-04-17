import {Component, OnInit, HostListener, ViewChild, ElementRef} from '@angular/core';
import {globalService} from "../../common/globalService";
import {MHelp} from "../../help/MHelp";

declare var SystemJS:any;
declare var jQuery:any;

@Component({
    selector: 'tooltip',
    templateUrl: SystemJS.map.app+'/utils/tooltips/index.html',
    styleUrls: [SystemJS.map.app+'/utils/tooltips/style.css'],
    inputs: ['code'],
})
export class Tooltip implements OnInit{
    @ViewChild('btn') btn:ElementRef;

    public permissions:any;
    public code="";
    public data:any={};
    public help:any;
    public $btn;
    private view:boolean = false;

    constructor(public myglobal:globalService, public elem:ElementRef) {
        this.help=new MHelp(myglobal);
        this.permissions = Object.assign({},this.help.permissions);
    }
    ngOnInit() {
        if(this.code && this.code.length>0){
            this.data = this.myglobal.getTooltip(this.code);
        }
    }
    ngAfterViewInit()
    {
        if(this.data.id && this.btn) {
            this.$btn = jQuery(this.btn.nativeElement);
            this.$btn.popover({trigger: "manual"});
        }
    }
    edit(event,data){
        if(event)
            event.preventDefault();
        if(this.permissions.update){
            if(this.myglobal.objectInstance[this.help.prefix]){
                this.myglobal.objectInstance[this.help.prefix].setLoadDataModel(data,true);
            }
        }
    }

    @HostListener('click',['$event']) onClick(event) {
        if(this.data.id && this.view){
            event.preventDefault();
            event.stopImmediatePropagation();
        }
    }

    clickBtn(event){
        event.preventDefault();
        event.stopImmediatePropagation();
        if(this.data.id){
            if(this.view)
                this.$btn.popover('destroy');
            else{
                this.$btn.popover('show');
                jQuery(window).one('click',(event)=>{
                    if(this.view)
                        this.clickBtn(event);
                });
            }
            this.view = !this.view;
        }

    }
}
