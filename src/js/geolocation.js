import validate from './validateCoordinates';

export default class Geolocation {
  constructor(geo) {
    this.geo = geo;
  }

  static async geolocation() {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
      }

      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        resolve(`[${latitude}, ${longitude}]`);
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
