import Feature from 'ol/Feature.js';
import Geolocation from 'ol/Geolocation.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';
import Point from 'ol/geom/Point.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import { OSM, Vector as VectorSource } from 'ol/source.js';
import {
  Circle as CircleStyle, Fill, Stroke, Style,
} from 'ol/style.js';
import {fromLonLat} from 'ol/proj.js';
import validate from './validateCoordinates';

export default class Geo {
  constructor(geo) {
    this.geo = geo;
    this.geoBtn = document.querySelector('.organizer-input-geo');
    this.organizerRecords = document.querySelector('.organizer-records');
  }

  events() {
    this.clickBtnGeo();
  }

  clickBtnGeo() {
    this.geoBtn.addEventListener('click', async () => {
      const html = `
      <div id="map" class="map"></div>
      <input id="track" type="checkbox">
      `;
      this.organizerRecords.innerHTML = html;
      const coords = await Geo.geolocation();
      // const map = Geo.initMap(coords);
      Geo.check();
      // const map = new Map({
      //   layers: [
      //     new TileLayer({
      //       source: new OSM(),
      //     }),
      //   ],
      //   target: 'map',
      //   view: new View({
      //     center: [14200000, 41300],
      //     zoom: 4,
      //   }),
      // });
      console.log(coords);
    });
  }

  static check() {
    const view = new View({
      center: [0, 0],
      zoom: 4,
    });
    var london = fromLonLat([-0.12755, 51.507222]);
    var moscow = fromLonLat([37.6178, 55.7517]);
    var istanbul = fromLonLat([28.9744, 41.0128]);
    var rome = fromLonLat([12.5, 41.9]);
    var bern = fromLonLat([7.4458, 46.95]);
    view.setCenter([9598686.399343008, 7302619.895249724]);

    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: 'map',
      view,
    });

    const geolocation = new Geolocation({
      // enableHighAccuracy must be set to true to have the heading value.
      trackingOptions: {
        enableHighAccuracy: true,
      },
      projection: view.getProjection(),
    });

    function el(id) {
      return document.getElementById(id);
    }

    el('track').addEventListener('change', function () {
      geolocation.setTracking(this.checked);
      console.log(geolocation.getPosition());
    });

    geolocation.on('error', (error) => {
      const info = document.getElementById('info');
      info.innerHTML = error.message;
      info.style.display = '';
    });

    const accuracyFeature = new Feature();
    geolocation.on('change:accuracyGeometry', () => {
      accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
    });

    const positionFeature = new Feature();
    positionFeature.setStyle(new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({
          color: '#3399CC',
        }),
        stroke: new Stroke({
          color: '#fff',
          width: 2,
        }),
      }),
    }));

    geolocation.on('change:position', () => {
      const coordinates = geolocation.getPosition();
      positionFeature.setGeometry(coordinates
        ? new Point(coordinates) : null);
        console.log(coordinates);
    });

    // return new VectorLayer({
    //   map,
    //   source: new VectorSource({
    //     features: [accuracyFeature, positionFeature],
    //   }),
    // });
  }

  // static initMap(object) {
  //   // const view = new View();
  //   // view.centerOn(object);
  //   // new Map({
  //   //   layers: [
  //   //     new TileLayer({ source: new OSM() }),
  //   //   ],
  //   //   view: new View({
  //   //     center: [546935695, 86226467],
  //   //     zoom: 4,
  //   //   }),
  //   //   target: 'map',
  //   // });

  //   const view = new View({
  //     center: [0, 0],
  //     zoom: 3,
  //   });

  //   const map = new Map({
  //     layers: [
  //       new TileLayer({
  //         source: new OSM(),
  //       }),
  //     ],
  //     target: 'map',
  //     view: view,
  //   });

  //   const geolocation = new Geolocation({
  //     trackingOptions: {
  //       enableHighAccuracy: true,
  //     },
  //     projection: view.getProjection(),
  //   });

  //   geolocation.setTracking(true);

  //   const accuracyFeature = new Feature();
  //   accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());

  //   const positionFeature = new Feature();
  //   positionFeature.setStyle(new Style({
  //     image: new CircleStyle({
  //       radius: 6,
  //       fill: new Fill({
  //         color: '#3399CC',
  //       }),
  //       stroke: new Stroke({
  //         color: '#fff',
  //         width: 2,
  //       }),
  //     }),
  //   }));

  //   const coordinates = geolocation.getPosition();
  //   positionFeature.setGeometry(coordinates
  //     ? new Point(coordinates) : null);
  //   console.log(coordinates);

  //   new VectorLayer({
  //     map: map,
  //     source: new VectorSource({
  //       features: [accuracyFeature, positionFeature]
  //     })
  //   });
  // }

  static async geolocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
      }

      navigator.geolocation.getCurrentPosition((position) => {
        // const { latitude, longitude } = position.coords;
        // resolve(`[${latitude}, ${longitude}]`);
        resolve([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      }, () => {
        resolve(null);
      });
    });
  }

  async requestGeo() {
    await this.geo();

    if (this.coordinates !== null) {
      this.addRecord(this.message);
      this.organizerInputText.value = null;
    } else if (this.coordinates === null) {
      this.modal.classList.remove('none');
      this.organizerInputText.value = null;
    }
  }

  inputCoordinates() {
    this.modalInput.addEventListener('input', (ev) => {
      const coordinates = ev.target.value;
      const coorArr = coordinates.split(',');
      const latitude = coorArr[0].trim();
      const longitude = coorArr[1].trim();
      if (validate(coordinates)) {
        this.coordinates = `[${latitude}, ${longitude}]`;
      }
    });
  }

  clickModalOk() {
    this.ok.addEventListener('click', () => {
      if (this.coordinates === null) {
        this.inputError();
      } else if (this.message !== null) {
        this.modal.classList.add('none');
        this.addRecord(this.message);
        this.modalInput.value = null;
      } else if (this.createElement !== null) {
        this.modal.classList.add('none');
        this.addRecord(this.createElement);
        this.modalInput.value = null;
      }
    });
  }

  clickModalCancel() {
    this.cancel.addEventListener('click', () => {
      this.coordinates = null;
      this.modalInput.value = null;
      this.modal.classList.toggle('none');
    });
  }
}
