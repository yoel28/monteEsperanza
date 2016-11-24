import {Component, OnInit,HostListener} from '@angular/core';
import {globalService} from "../../common/globalService";
import {MHelp} from "../../help/MHelp";

declare var SystemJS:any;
declare var moment:any;
declare var jQuery:any;

@Component({
    selector: 'tooltip',
    templateUrl: SystemJS.map.app+'/utils/tooltips/index.html',
    styleUrls: [SystemJS.map.app+'/utils/tooltips/style.css'],
    inputs: ['code'],
})
export class Tooltip implements OnInit{

    public permissions:any;
    public code="";
    public data:any={};
    public help:any;
    

    public configId=moment().valueOf();

    constructor(public myglobal:globalService) {
        this.help=new MHelp(myglobal);
        this.permissions = Object.assign({},this.help.permissions);
    }
    ngOnInit() {
        this.configId='TOOLTIP_'+this.configId+'_'+this.code;
        if(this.code && this.code.length>0){
            this.data=this.myglobal.getTooltip(this.code);
        }
    }
    ngAfterViewInit()
    {
        let that=this;
        if(this.data && this.data.id){
            jQuery('#'+this.configId).popover({
                trigger: "manual"
            });
        }
    }
    edit(event,data){
        event.preventDefault();
        if(this.permissions.update){
            if(this.myglobal.objectInstance[this.help.prefix]){
                this.myglobal.objectInstance[this.help.prefix].setLoadDataModel(data,true);
            }
        }
    }
    @HostListener('document:click', ['$event.target'])
    public onClick(event) {
        let btn = jQuery(event).parents('#'+this.configId);
        if( (btn && btn.length > 0) || jQuery(event).attr('id') == this.configId ){
            jQuery('#'+this.configId).popover('show');
        }
        else{
            let exit= jQuery(event).parents('.popover');
            if(exit && exit.length == 0)
                jQuery('#'+this.configId).popover('destroy');
        }
    }
    @HostListener('window:keydown', ['$event'])
    keyboardInput(event: any) {
        if(event.code == "Escape")
            jQuery("[data-toggle='popover']").popover('destroy');
    }
}
