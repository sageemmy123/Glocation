import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import * as dojoClass from "dojo/dom-class";
import * as dojoStyle from "dojo/dom-style";
import * as dojoHtml from "dojo/html";
import * as dom from "dojo/dom";
import {} from "google.maps";
import { GoogleMapsLoader } from "./dex";

     class Glocation extends WidgetBase {

         // from modeler
         private longitudeAttribute: string;
         private latitudeAttribute: string;
         private CityName: string;
         private onchangemf: string;

         // internal
         x: boolean;
         private latitude: number;
         geo: any;
         private geocoder: any;
         private longitude: number;
         private locationEntity: string;
         private contextObject: mendix.lib.MxObject;

         postCreate() {
            GoogleMapsLoader.load()
           .then(() => {
                 this.initialize();
            });
            this.geoSuccess = this.geoSuccess.bind(this);
         }

         initialize() {
	     this.geocoder = new google.maps.Geocoder();
 }

         update(object: mendix.lib.MxObject, callback?: () => void) {
             this.contextObject = object;
             this.resetSubscriptions();
             this.updateRendering();
             this.getLocation();
             if (callback) {
                 callback();
             }
         }

         uninitialize(): boolean {
             return true;
         }
//         ngOnInit() {
//         this.x = false;
//         while (this.x === false) {
//         if (typeof google !== "undefined") {
//         console.log("Hell Yeah");
//         this.getLocation();
//         this.x = true;
//     } else{}
// }
//         }

         private updateRendering() {
             if (this.contextObject) {
                 //this.ngOnInit();
                 this.html();
             } else {
                 dojoStyle.set(this.domNode, "display", "block");
             }
         }

         private resetSubscriptions() {
             this.unsubscribeAll();
             if (this.contextObject) {
                 this.subscribe({
                     callback: () => this.updateRendering(),
                     guid: this.contextObject.getGuid()
                 });
             }
         }

         private html() {
             domConstruct.empty(this.domNode);
             domConstruct.create("div", {
                 InnerHTML: "&nbsp<span>hi</span>"
             }, this.domNode);
         }

         getLocation() {
             if (navigator.geolocation) {
                 navigator.geolocation.getCurrentPosition(this.geoSuccess);
             } else {
                 alert("Geolocation is not supported by this browser.");
             }
         }

         geoSuccess(position: any) {
             const latitude = position.coords.latitude;
             const longit = position.coords.longitude;
             this.codeLatLng(latitude, longit);
         }

         codeLatLng(lat: any, lng: any) {
             const geocoder = new google.maps.Geocoder();
             const LatLng = new google.maps.LatLng(lat, lng);
             geocoder.geocode({ location: LatLng }, (results: any, status: any) => {
                 if (status === google.maps.GeocoderStatus.OK) {
                     console.log(results);
                     if (results[1]) {
                         //formatted address
                         const address = results[0].formatted_address;
                         this.createItem(lat, lng, address);
                         //alert("address = " + address);
                     } else {
                         alert("No results found");
                     }
                 } else {
                     alert("Geocoder failed due to: " + status);
                 }
             });
         }

         private executeMf(microflow: string, guid: string, cb?: (obj: mendix.lib.MxObject) => void) {
             if (microflow && guid) {
                 mx.ui.action(microflow, {
                     callback: (objs: mendix.lib.MxObject) => {
                         if (cb && typeof cb === "function") {
                             cb(objs);
                         }
                     },
                     error: (error) => {
                         mx.ui.error("Error executing microflow " + microflow + " : " + error.message);
                     },
                     params: {
                         applyto: "selection",
                         guids: [guid]
                     }
                 }, this);
             }
         }

         createItem(latitude: any, longitude: any, City: string) {
             mx.data.create({
                 callback: object => {
                     object.set(this.CityName, City);
                     object.set(this.latitudeAttribute, latitude);
                     object.set(this.longitudeAttribute, longitude);
                     this.commitItem(object);
                     this.executeMf(this.onchangemf, object.getGuid());
                 },
                 entity: this.locationEntity,
                 error: (e) => {
                     console.log("an error occured: " + e);
                 }
             });
         }
         commitItem(obj: mendix.lib.MxObject) {
             mx.data.commit({
                 callback: () => {
                     console.log("Object committed");
                 },
                 error: (e) => {
                     console.log("Error occurred attempting to commit: " + e);
                 },
                 mxobj: obj
             });
         }
     }

// tslint:disable-next-line:only-arrow-functions
dojoDeclare("widget.Glocation", [ WidgetBase ], function(Source: any) {
    const result: any = {};
    for (const i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
}(Glocation));
