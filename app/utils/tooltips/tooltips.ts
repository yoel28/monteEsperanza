import {Component, OnInit} from '@angular/core';
import {globalService} from "../../common/globalService";

@Component({
    selector: 'tooltip',
    templateUrl: 'app/utils/tooltips/index.html',
    styleUrls: ['app/utils/tooltips/style.css'],
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
