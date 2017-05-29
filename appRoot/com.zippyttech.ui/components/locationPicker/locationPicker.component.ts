import {AfterViewInit, Component, EventEmitter} from '@angular/core';
import {API} from '../../../com.zippyttech.utils/catalog/defaultAPI';
import {globalService} from "../../../common/globalService";

declare var SystemJS:any;
declare var jQuery:any;
declare var google:any;
declare var moment:any;

export interface ILocation {
    regionBias?: string,
    zoom?: {
        value: number;
        visible?: boolean;
    },
    keys?: {
        lat: string,
        lng: string,
    }
    address?: boolean,
    reverse?: boolean,
    center?: {
        lat: number,
        lng: number
    },
    scrollwheel?: boolean,
    debug?: boolean;
    data?: {
        lat: number,
        lng: number
    },
    instance?: LocationPickerComponent,
    disabled?: boolean,
    mapTypeId?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain' | string;
    elements?: Array<'lat' | 'lng' | 'street_number' | 'route' | 'locality' | 'administrative_area_level_2' |
        'administrative_area_level_1' | 'country' | 'postal_code' | 'type'>
}

@Component({
    selector: 'location-picker',
    templateUrl: SystemJS.map.app+'/com.zippyttech.ui/components/locationPicker/index.html',
    styleUrls: [ SystemJS.map.app+'/com.zippyttech.ui/components/locationPicker/style.css'],
    inputs: ['params', 'model'],
    outputs: ['result', 'getInstance'],
})
export class LocationPickerComponent implements AfterViewInit {

    public params: ILocation = {};

    private _configId = moment().valueOf();

    public result: any;
    public getInstance: any;
    public dataLocation: any = {};
    public mapGoogle: any;
    public marker: any;

    private _lat = this.myglobal.getParams('LOCATION_LAT', API.LOCATION_LAT);
    private _lng = this.myglobal.getParams('LOCATION_LNG', API.LOCATION_LNG);
    private _zoom = this.myglobal.getParams('LOCATION_ZOON', API.LOCATION_ZOON);
    private _regionBias = this.myglobal.getParams('LOCATION_REGION_BIAS', API.LOCATION_REGION_BIAS);
    private _mapTypeId = this.myglobal.getParams('LOCATION_MAP_TYPE_ID', API.LOCATION_MAP_TYPE_ID);


    constructor(public myglobal:globalService) {
        this.result = new EventEmitter();
        this.getInstance = new EventEmitter();
    }

    checkParams() {

        if (!this.params.regionBias)
            this.params.regionBias = this._regionBias;

        if (!this.params.zoom)
            this.params.zoom = {value: this._zoom};

        if (typeof this.params.zoom.value != 'number')
            this.params.zoom.value = this._zoom;

        if (!this.params.center)
            this.params.center = {lat: this._lat, lng: this._lng};

        if (typeof this.params.center.lat != 'number' || isNaN(this.params.center.lat))
            this.params.center.lat = this._lat;

        if (typeof this.params.center.lng !== 'number' || isNaN(this.params.center.lng))
            this.params.center.lng = this._lng;


        if (typeof this.params.scrollwheel != 'boolean')
            this.params.scrollwheel = true;

        if (!this.params.mapTypeId)
            this.params.mapTypeId = this._mapTypeId;

        if (!this.params.elements)
            this.params.elements = [];

        if (!this.params.keys)
            this.params.keys = {lat: 'lat', lng: 'lng'}

    }

    initLocation() {

        let that = this;

        let elementsView = {'map': '#' + that._configId + 'map'};
        that.params.elements.forEach(key => {
            elementsView[key] = '#' + that._configId + key;
        });

        let addresspicker = jQuery('#' + this._configId + 'addresspicker').addresspicker({});

        this.mapGoogle = jQuery('#' + this._configId + 'addresspicker_map').addresspicker({
            regionBias: that.params.regionBias,
            updateCallback: (geocodeResult, parsedGeocodeResult) => {
                if (that.params && that.params.debug) {
                    jQuery('#' + that._configId + 'callback_result').text(JSON.stringify(parsedGeocodeResult, null, 4));
                }
                if (this.params.reverse) {
                    that.dataLocation = parsedGeocodeResult
                }
            },
            mapOptions: {
                zoom: that.params.zoom.value,
                center: new google.maps.LatLng(that.params.center.lat, that.params.center.lng),
                scrollwheel: that.params.scrollwheel,
                mapTypeId: that.params.mapTypeId
            },
            elements: elementsView
        });


        if (this.params && this.params.reverse) {
            jQuery('#' + that._configId + 'reverseGeocode').change(function () {
                jQuery('#' + that._configId + 'addresspicker_map').addresspicker('option', 'reverseGeocode', (jQuery(this).val() === 'true'));
            });
        }

        if (this.params && this.params.zoom && this.params.zoom.visible) {
            let map = jQuery('#' + that._configId + 'addresspicker_map').addresspicker('map');
            google.maps.event.addListener(map, 'idle', function () {
                jQuery('#' + that._configId + 'zoom').val(map.getZoom());
            });
        }
        this.setMarker();
        // this._getLocation();
    }

    setMarker() {

        if (!this.marker) {
            this.marker = this.mapGoogle.addresspicker('marker');
            this.marker.setVisible(true);
            google.maps.event.addListener(this.marker, 'dragend', function (evt) {
                this.params.data = {
                    lat: evt.latLng.lat(),
                    lng: evt.latLng.lng()
                };
            }.bind(this));

            google.maps.event.addListener(this.mapGoogle.addresspicker('map'), 'center_changed', () => {
                this.params.data = {
                    lat: this.marker.getPosition().lat(),
                    lng: this.marker.getPosition().lng()
                };
            });

        } else {
            this.checkParams();

            this.mapGoogle.addresspicker('map').setCenter(this.params.center);
            this.mapGoogle.addresspicker('map').setZoom(this.params.zoom.value);
            this.marker.setPosition(this.params.center);
            this.params.data = this.params.center
        }
        this.marker.setDraggable(!this.params.disabled);
        this.mapGoogle.addresspicker('updatePosition');

    }
    private _getLocation(event?:Event) {
        if(event)
            event.preventDefault();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position =>
                {
                    this.params.center = {
                        lat:position.coords.latitude,
                        lng:position.coords.longitude
                    };
                    this.setMarker();
                }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }

    ngAfterViewInit() {
        this.checkParams();
        setTimeout(()=>{
            this.initLocation()
        }, 1000);
        this.params.instance = this;
        this.getInstance.emit(this);
    }

    getData(data) {
        this.result.emit(data);
    }
}

