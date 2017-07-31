define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",

    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",

    "ReverseText/lib/jquery-1.11.2",
    "dojo/text!ReverseText/widget/template/ReverseText.html"
], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent, _jQuery, widgetTemplate) {
    "use strict";
    return declare("ReverseText.widget.ReverseText", [ _WidgetBase, _TemplatedMixin ], {
        templateString: widgetTemplate,
        inputNodes: null,
        StringNode:null,
        micro:"",
        infoTextNode: null,
        reverseEntity:"",
        dataAttribute:"",
        // Parameters configured in the Modeler.
        messageString: "",
        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handles: null,
        _contextObj: null,
        _alertDiv: null,
        _readOnly: false,        

        postCreate: function() {
            logger.debug(this.id + ".postCreate");
            this._updateRendering();
        },
        update: function(obj, callback) {
            logger.debug(this.id + ".update");
            this._contextObj = obj;
            this._updateRendering(callback); 
        },
        _setupEvents: function() {
            if (this.micro !== "") {
                this._execMf(this.micro, this._contextObj.getGuid());
                }
        },
       _execMf: function(mf, guid, cb) {
            logger.debug(this.id + "._execMf");
            if (mf && guid) {
                mx.ui.action(mf, {
                    params: {
                        applyto: "selection",
                        guids: [guid]
                    },
                    callback: lang.hitch(this, function (objs) {
                        if (cb && typeof cb === "function") {
                            cb(objs);
                        }
                    }),
                    error: function (error) {
                        mx.ui.error("Error executing microflow " + mf + " : " + error.message);
                        console.error(this.id + "._execMf", error);
                    }
                }, this);
            }
        },
        _updateRendering: function(callback) {
            logger.debug(this.id + "._updateRendering");
            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");
                var myData = this._contextObj.get(this.dataAttribute);
                this.infoTextNode.innerHTML= myData.split('').reverse().join('');
            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }
            this._executeCallback(callback, "_updateRendering");
        },

        createItem: function() {
            mx.data.create({
            entity: this.reverseEntity,
            callback: lang.hitch(this,function(obj) {
            obj.set(this.dataAttribute,this.StringNode.value);
            this.commitItem(obj);
            console.log("Object created on server");
              }),
        error: function(e) {
        console.log("an error occured: " + e);
              }
    });
        },
        commitItem: function(Aobj){
          mx.data.commit({
          mxobj: Aobj,
          callback: function(Aobj) {
        console.log("Object committed");
    },
        error: function(e) {
        console.log("Error occurred attempting to commit: " + e);
    }
    });
    }, 
        _executeCallback: function (cb, from) {
            logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});
require(["ReverseText/widget/ReverseText"]);
