/* eslint-disable import/no-cycle */
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import Point from 'ol/geom/Point';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import {
  Circle as CircleStyle, Fill, Stroke, Style,
} from 'ol/style';
import { fromLonLat } from 'ol/proj';
import Organizer from './organizer';
import validate from './validateCoordinates';

export default class Geo {
  constructor(server) {
    this.server = server;
    this.geoBtn = document.querySelector('.organizer-input-geo');
    this.organizerRecords = document.querySelector('.organizer-records');

    this.coordinates = null;
    this.modal = document.querySelector('.modal');
    this.modalInput = document.querySelector('.modal-input-text');
    this.ok = document.querySelector('.modal-ok');
    this.cancel = document.querySelector('.modal-cancel');
    this.error = document.querySelector('.input-error');
    this.id = null;
  }

  events() {
    this.clickBtnGeo();

    this.inputCoordinates();
    this.clickModalOk();
    this.clickModalCancel();
  }

  clickBtnGeo() {
    this.geoBtn.addEventListener('click', async () => {
      const coords = await Geo.geolocation();
      if (coords === null) {
        this.modal.classList.remove('none');
      } else {
        this.coordinates = coords.reverse();
        this.id = await Organizer.createIdMessage(this.coordinates, this.server, 'geo');
        this.renderMapInDom();
      }
    });
  }

  static createElementMap(coords) {
    const map = document.createElement('div');
    map.id = `${coords}`;
    map.className = 'map';
    return map;
  }

  static initMap(object) {
    const view = new View({
      center: [0, 0],
      zoom: 10,
    });
    const myPoint = fromLonLat(object);
    view.setCenter(myPoint);

    const map = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      target: `${object}`,
      view,
    });

    const accuracyFeature = new Feature();
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

    positionFeature.setGeometry(new Point(myPoint));

    return new VectorLayer({
      map,
      source: new VectorSource({
        features: [accuracyFeature, positionFeature],
      }),
    });
  }

  static geolocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
      }

      navigator.geolocation.getCurrentPosition((position) => {
        resolve([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      }, () => {
        resolve(null);
      });
    });
  }

  async inputCoordinates() {
    this.modalInput.addEventListener('input', async (ev) => {
      const coordinates = ev.target.value;
      const coorArr = coordinates.split(',');
      const latitude = coorArr[0].trim();
      const longitude = coorArr[1].trim();
      if (validate(coordinates)) {
        const coords = [latitude, longitude];
        this.coordinates = coords.reverse();
        this.id = await Organizer.createIdMessage(this.coordinates, this.server, 'geo');
      }
    });
  }

  inputError() {
    this.error.classList.remove('none');
    setTimeout(() => this.error.classList.add('none'), 3000);
  }

  clickModalOk() {
    this.ok.addEventListener('click', () => {
      if (this.coordinates === null) {
        this.inputError();
      } else {
        this.renderMapInDom();
        this.coordinates = null;
        this.modalInput.value = null;
        this.modal.classList.toggle('none');
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

  renderMapInDom() {
    const map = Geo.createElementMap(this.coordinates);
    const record = Organizer.createRecord(map, this.id);
    this.organizerRecords.append(record);
    Geo.initMap(this.coordinates);
    Organizer.scrollToBottom(this.organizerRecords);
  }
}
