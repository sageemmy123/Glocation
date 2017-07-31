import * as dojoDeclare from "dojo/_base/declare";
import * as domConstruct from "dojo/dom-construct";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import * as dojoClass from "dojo/dom-class";
import * as dojoStyle from "dojo/dom-style";
import * as dojoHtml from "dojo/html";
import * as dom from "dojo/dom";

class Glocation extends WidgetBase {

    // from modeler
    private longitudeAttribute: string;
    private latitudeAttribute: string;
    private onchangemf: string;

    // internal
    private latitude: number;
    private longitude: number;
    private locationEntity: string;

    private contextObject: mendix.lib.MxObject;

    postCreate() {
       this.geoSuccess = this.geoSuccess.bind(this);
    }

    update(object: mendix.lib.MxObject, callback?: () => void) {
        this.contextObject = object;
        this.getLocation();
        this.resetSubscriptions();
        this.updateRendering();

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
        const latitude = position.coords.latitude ;
        const longit = position.coords.longitude ;
        this.createItem(latitude, longit);
    }
    private executeMf(microflow: string, guid: string, cb?: (obj: mendix.lib.MxObject) => void) {
        if (microflow && guid) {
            mx.ui.action(microflow, {
                params: {
                    applyto: "selection",
                    guids: [ guid ]
                },
                callback: (objs: mendix.lib.MxObject) => {
                    if (cb && typeof cb === "function") {
                        cb(objs);
                    }
                },
                error: (error) => {
                    mx.ui.error("Error executing microflow " + microflow + " : " + error.message);
                }
            }, this);
        }
    }

 createItem(latitude: any, longitude: any) {
        mx.data.create({
            entity: this.locationEntity,
            callback: object => {
                object.set(this.latitudeAttribute, latitude);
                object.set(this.longitudeAttribute, longitude);
                this.commitItem(object);
                this.executeMf(this.onchangemf, object.getGuid());
            },

            error: (e) => {
                console.log("an error occured: " + e);
            }
        });
    }
    commitItem(obj: mendix.lib.MxObject) {
        mx.data.commit({
            callback:  () => {
                console.log("Object committed");
            },
            error: (e) => {
                console.log("Error occurred attempting to commit: " + e);
            },
             mxobj: obj
        });
    }
}

dojoDeclare("widget.Glocation", [ WidgetBase ], function(Source: any) {
    const result: any = {};
    for (const i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
}(Glocation));
