import {Http} from '@angular/http';
import {contentHeaders} from '../common/headers';

export class HttpUtils {

    constructor(public http:Http) {
    }

    createEndpoint(endpoint:string,isAbosulte=false){
        return (isAbosulte?'':localStorage.getItem('urlAPI')) + endpoint;
    }

    doGet(endpoint:string, successCallback, errorCallback ,isEndpointAbsolute = false) {
        endpoint=this.createEndpoint(endpoint,isEndpointAbsolute);
        return new Promise<any>((resolve, reject) => {
            this.http.get(endpoint, {headers: contentHeaders})
                .subscribe(
                    response => {
                        if (successCallback != null)
                            successCallback(response)
                        resolve(response.json());
                    },
                    error => {
                        if (errorCallback != null)
                            errorCallback(error)
                        reject(error);
                    }
                )
        });
    }

    doDelete(endpoint:string, successCallback, errorCallback,isEndpointAbsolute = false) {
        endpoint=this.createEndpoint(endpoint,isEndpointAbsolute);
        return new Promise<any>((resolve, reject) => {
            this.http.delete(endpoint, {headers: contentHeaders})
                .subscribe(
                    response => {
                        if (successCallback != null)
                            successCallback(response)
                        resolve(response.json());
                    },
                    error => {
                        if (errorCallback != null)
                            errorCallback(error)
                        reject(error);
                    }
                )
        });
    }

    doPost(endpoint:string,body, successCallback, errorCallback,isEndpointAbsolute = false) {
        endpoint=this.createEndpoint(endpoint,isEndpointAbsolute);
        return new Promise<any>((resolve, reject) => {
            this.http.post(endpoint,body, {headers: contentHeaders})
                .subscribe(
                    response => {
                        if (successCallback != null)
                            successCallback(response)
                        resolve(response.json());
                    },
                    error => {
                        if (errorCallback != null)
                            errorCallback(error)
                        reject(error);
                    }
                )
        });
    }
    doPut(endpoint:string,body, successCallback, errorCallback,isEndpointAbsolute = false) {
        endpoint=this.createEndpoint(endpoint,isEndpointAbsolute);
        return new Promise<any>((resolve, reject) => {
            this.http.put(endpoint,body, {headers: contentHeaders})
                .subscribe(
                    response => {
                        if (successCallback != null)
                            successCallback(response)
                        resolve(response.json());
                    },
                    error => {
                        if (errorCallback != null)
                            errorCallback(error)
                        reject(error);
                    }
                )
        });
    }

    onSave(endpoint:string, body,list, errorCallback = null,isEndpointAbsolute = false) {
        let successCallback= response => {
            if(list != null)
                list.push( response.json())
        }
        this.doPost(endpoint,body,successCallback,errorCallback,isEndpointAbsolute)
    }

    onLoadList(endpoint:string, list, errorCallback = null,isEndpointAbsolute = false) {
        let successCallback= response => {
            Object.assign(list, response.json());
        }
        this.doGet(endpoint,successCallback,errorCallback,isEndpointAbsolute)
    }

    onDelete(endpoint:string,id, list ,errorCallback = null,isEndpointAbsolute = false) {
        let successCallback= response => {
            if(list != null){
                let index = list.findIndex(obj => obj.id == id);
                if(index!=-1)
                    list.splice(index,1);
            }
        }
        this.doDelete(endpoint,successCallback,errorCallback,isEndpointAbsolute);
    }
    onUpdate(endpoint:string,body,data, errorCallback = null,isEndpointAbsolute = false) {
        let successCallback= response => {
            Object.assign(data, response.json());
        }
        this.doPut(endpoint,body,successCallback,errorCallback,isEndpointAbsolute)
    }
}