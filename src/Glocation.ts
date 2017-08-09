import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import * as dojoClass from "dojo/dom-class";
import * as dojoStyle from "dojo/dom-style";
import * as dojoHtml from "dojo/html";
import * as dom from "dojo/dom";
import { GoogleMapsLoader } from "./GoogleMapsLoader";

class Glocation extends WidgetBase {

    // from modeler
    private longitudeAttribute: string;
    private latitudeAttribute: string;
    private cityName: string;
    private onchangemf: string;
    

    // internal
  
    private latitude: number;   
    private geocoder: any;
    private longitude: number;
    private locationEntity: string;
    private contextObject: mendix.lib.MxObject;

    postCreate() {
        GoogleMapsLoader.load()
            .then(() => { });
        this.geoSuccess = this.geoSuccess.bind(this);
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

    private updateRendering() {
        if (this.contextObject) {
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
                    const address = results[0].formatted_address;
                    this.createItem(lat, lng, address);
                    
                } else {
                    window.alert("No results found");
                }
            } else {
                window.alert("Geocoder failed due to: " + status);
            }
        });
    }

    private executeMf(microflow: string, guid: string, callback?: (obj: mendix.lib.MxObject) => void) {
        if (microflow && guid) {
            mx.ui.action(microflow, {
                callback: (objects: mendix.lib.MxObject) => {
                    if (callback && typeof callback === "function") {
                        callback(objects);
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
                object.set(this.cityName, City);
                object.set(this.latitudeAttribute, latitude);
                object.set(this.longitudeAttribute, longitude);
                this.commitItem(object);
                this.executeMf(this.onchangemf, object.getGuid());
                // this.executeMf(this.onchangemf2, object.getGuid());
            },
            entity: this.locationEntity,
            error: (exception) => {
                window.alert("an error occured: " + exception);
            }
        });
    }
    commitItem(obj: mendix.lib.MxObject) {
        mx.data.commit({
            callback: () => {
                window.alert("Object committed");
            },
            error: (exception) => {
                window.alert("Error occurred attempting to commit: " + exception);
            },
            mxobj: obj
        });
    }
}

// tslint:disable-next-line:only-arrow-functions
dojoDeclare("widget.Glocation", [WidgetBase], function (Source: any) {
    const result: any = {};
    for (const i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
}(Glocation));
