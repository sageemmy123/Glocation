const url = "https://maps.googleapis.com/maps/api/js?key=AIzaSyD7lIMhMh2QPy9EUs97VlbmWx924wp4G_8";
declare const window: any;
export class GoogleMapsLoader {
    private static promise: any;
    public static load() {

    if (!GoogleMapsLoader.promise) {

        GoogleMapsLoader.promise = new Promise((resolve) => {

            window.__onGoogleMapsLoaded = () => {
            console.log("google maps api loaded");
            resolve(window.google.maps);
            };
            console.log("loading..");
            const node = document.createElement("script");
            node.src = url;
            node.type = "text/javascript";
            document.getElementsByTagName("head")[0].appendChild(node);
        });
    }

    return GoogleMapsLoader.promise;
  }
}
