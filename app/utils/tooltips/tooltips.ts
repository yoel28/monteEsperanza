import {Component, OnInit} from '@angular/core';
import {globalService} from "../../common/globalService";
declare var SystemJS:any;
@Component({
    selector: 'tooltip',
    templateUrl: SystemJS.map.app+'/utils/tooltips/index.html',
    styleUrls: [SystemJS.map.app+'/utils/tooltips/style.css'],
    inputs: ['code', 'params'],
})
export class Tooltips implements OnInit {
    public params:any={};
    public code:any={};

    constructor(public myglobal:globalService) {

    }
    ngOnInit() {

    }
    f(event){
        event.preventDefault();
    }
}
