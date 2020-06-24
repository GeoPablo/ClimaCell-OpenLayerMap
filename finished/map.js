function initMap(idOfElement, cb) {
  const lat = 45.658;
  const lon = 25.6012;
  const zoom = 8;
  let map;
  const toProjection = new OpenLayers.Projection("EPSG:900913");
  const fromProjection = new OpenLayers.Projection("EPSG:4326");
  const cntrposition = new OpenLayers.LonLat(lon, lat).transform(
    fromProjection,
    toProjection
  );

  let marker;
  let markers;

  function init() {
    map = new OpenLayers.Map(idOfElement, {
      controls: [
        new OpenLayers.Control.Navigation(),
        new OpenLayers.Control.PanZoomBar(),
        new OpenLayers.Control.LayerSwitcher(),
        new OpenLayers.Control.Attribution(),
      ],
      maxResolution: 156543.0399,
      numZoomLevels: 19,
      units: "m",
    });

    const mapnik = new OpenLayers.Layer.OSM("MAP");
    markers = new OpenLayers.Layer.Markers("Markers");

    map.addLayers([mapnik, markers]);
    map.addLayer(mapnik);
    map.setCenter(cntrposition, zoom);

    var lonLat = new OpenLayers.LonLat(lon, lat).transform(
      new OpenLayers.Projection("EPSG:4326"),
      new OpenLayers.Projection("EPSG:900913")
    );

    map.setCenter(lonLat, zoom);

    var click = new OpenLayers.Control.Click();
    map.addControl(click);
    click.activate();
  }

  OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
    defaultHandlerOptions: {
      single: true,
      double: false,
      pixelTolerance: 0,
      stopSingle: false,
      stopDouble: false,
    },

    initialize: function (options) {
      this.handlerOptions = OpenLayers.Util.extend(
        {},
        this.defaultHandlerOptions
      );
      OpenLayers.Control.prototype.initialize.apply(this, arguments);
      this.handler = new OpenLayers.Handler.Click(
        this,
        {
          click: this.trigger,
        },
        this.handlerOptions
      );
    },

    trigger: function (e) {
      var lonlat = map.getLonLatFromPixel(e.xy);
      lonlat1 = new OpenLayers.LonLat(lonlat.lon, lonlat.lat).transform(
        toProjection,
        fromProjection
      );

      markers.removeMarker(marker);
      marker = new OpenLayers.Marker(
        new OpenLayers.LonLat(lonlat1.lon, lonlat1.lat).transform(
          fromProjection,
          toProjection
        )
      );
      markers.addMarker(marker);
      cb(lonlat1, e);
    },
  });
  init();
}
