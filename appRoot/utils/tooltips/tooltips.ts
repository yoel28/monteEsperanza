import {Component, OnInit} from '@angular/core';
import {globalService} from "../../common/globalService";

declare var SystemJS:any;
declare var moment:any;
declare var jQuery:any;

@Component({
    selector: 'tooltip',
    templateUrl: SystemJS.map.app+'/utils/tooltips/index.html',
    styleUrls: [SystemJS.map.app+'/utils/tooltips/style.css'],
    inputs: ['code', 'params'],
})
export class Tooltip implements OnInit{

    public params:any={};
    public code="";
    public data:any={};
    public configId=moment().valueOf();

    constructor(public prefix,public myglobal:globalService) {
        //this.help.initModel();
    }
    ngOnInit() {
        this.configId='TOOLTIP_'+this.configId+'_'+this.code;
        if(this.code && this.code.length>0){
            this.data=this.myglobal.getTooltip(this.code);
        }
    }
    ngAfterViewInit(){
        jQuery('#'+this.configId).popover();
    }
    f(event){
        event.preventDefault();
    }
}
