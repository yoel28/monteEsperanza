import {Component, OnInit} from '@angular/core';
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
    public mHelp:any;
    

    public configId=moment().valueOf();

    constructor(public myglobal:globalService) {
        this.mHelp=new MHelp(myglobal);
        this.permissions = Object.assign({},this.mHelp.permissions);
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
                trigger: "hover"
            });
        }
    }
    edit(event,data){
        event.preventDefault();
        if(this.permissions.update){
            if(this.myglobal.objectInstance[this.mHelp.prefix]){
                this.myglobal.objectInstance[this.mHelp.prefix].setLoadDataModel(data);
            }
        }
    }

}
