import validate from './validateCoordinates';
import geolocation from './geolocation';
import Record from './record';
import notificationBox from './notification';

export default class Organizer {
  constructor() {
    this.organizerRecords = document.querySelector('.organizer-records');
    this.organizerInputText = document.querySelector('.organizer-input-text');
    this.message = null;
    this.modal = document.querySelector('.modal');
    this.modalInput = document.querySelector('.modal-input-text');
    this.coordinates = null;
    this.ok = document.querySelector('.modal-ok');
    this.cancel = document.querySelector('.modal-cancel');
    this.error = document.querySelector('.input-error');
    this.audioBtn = document.querySelector('.organizer-input-audio');
    this.videoBtn = document.querySelector('.organizer-input-video');
    this.timer = document.querySelector('.timer');
    this.recorder = null;
    this.createElement = null;
    this.timerId = null;
    this.min = 0;
    this.sec = 0;
  }

  events() {
    this.inputText();
    this.inputTextEnter();
    this.inputCoordinates();
    this.clickModalOk();
    this.clickModalCancel();
    this.clickAudioVideo(this.videoBtn);
    this.clickAudioVideo(this.audioBtn);
  }

  addRecord(content) {
    if (this.coordinates === null) {
      this.modal.classList.remove('none');
    } else {
      const record = document.createElement('div');
      const date = document.createElement('div');
      const coordinates = document.createElement('div');
      const numCoordinates = document.createElement('p');
      const imgCoordinates = document.createElement('div');
      coordinates.appendChild(numCoordinates);
      coordinates.appendChild(imgCoordinates);
      record.appendChild(date);

      if (typeof content === 'string') {
        const contents = document.createElement('div');
        record.appendChild(contents);
        contents.textContent = content.trim();
      } else {
        record.appendChild(content);
      }

      record.appendChild(coordinates);
      record.classList.add('record');
      date.classList.add('record-date');
      imgCoordinates.classList.add('img-coordinates');
      coordinates.classList.add('coordinates');
      date.textContent = Timeline.getDate();
      this.organizerRecords.appendChild(record);
      numCoordinates.textContent = this.coordinates;
      this.message = null;
      this.createElement = null;
      this.coordinates = null;
    }
  }

  async geo() {
    this.coordinates = await geolocation();
  }

  timerRec() {
    this.min = 0;
    this.sec = 0;

    this.timerId = setInterval(() => {
      if (this.sec === 60) {
        this.min += 1;
        this.sec = 0;
      }

      if (this.min < 10 && this.sec < 10) {
        this.timer.textContent = `0${this.min}:0${this.sec}`;
      } else if (this.min < 10 && this.sec > 9) {
        this.timer.textContent = `0${this.min}:${this.sec}`;
      } else if (this.min > 9 && this.sec < 10) {
        this.timer.textContent = `${this.min}:0${this.sec}`;
      } else if (this.min > 9 && this.sec > 9) {
        this.timer.textContent = `${this.min}:${this.sec}`;
      }
      this.sec += 1;
    }, 1000);
  }

  async transformButtonsOn() {
    await this.geo();
    this.timer.classList.remove('none');
    this.timerRec();
    this.videoBtn.classList.remove('image-video');
    this.videoBtn.classList.add('image-cancel');
    this.audioBtn.classList.remove('image-audio');
    this.audioBtn.classList.add('image-ok');
  }

  transformButtonsOff() {
    this.timer.classList.add('none');
    this.videoBtn.classList.add('image-video');
    this.videoBtn.classList.remove('image-cancel');
    this.audioBtn.classList.add('image-audio');
    this.audioBtn.classList.remove('image-ok');
  }

  async record(type) {
    this.createElement = document.createElement(type);
    this.createElement.controls = true;
    this.recorder = new Record(this.createElement, type);
    await this.recorder.createRecord();

    if (!window.MediaRecorder || this.recorder.error !== null) {
      await notificationBox();
      this.recorder = null;
      this.createElement = null;
    } else {
      this.transformButtonsOn();
    }
  }

  cancelRecord() {
    clearInterval(this.timerId);
    this.min = 0;
    this.sec = 0;
    this.timer.textContent = '';
    this.recorder.recorder.stop();
    this.transformButtonsOff();
  }

  clickAudioVideo(element) {
    element.addEventListener('click', () => {
      if (this.timer.classList.contains('none') && element.classList.contains('image-audio')) {
        this.record('audio');
      } else if (this.timer.classList.contains('none') && element.classList.contains('image-video')) {
        this.record('video');
      } else if (!this.timer.classList.contains('none') && element.classList.contains('image-ok')) {
        this.cancelRecord();
        this.addRecord(this.createElement);
      } else if (!this.timer.classList.contains('none') && element.classList.contains('image-cancel')) {
        this.cancelRecord();
      }
    });
  }

  inputText() {
    this.organizerInputText.addEventListener('input', (ev) => {
      this.message = ev.target.value;
    });
  }

  async inputTextEnter() {
    this.organizerInputText.addEventListener('keyup', (ev) => {
      if (ev.key === 'Enter' && this.message !== null) {
        this.requestGeo();
      }
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

  inputError() {
    this.error.classList.remove('none');
    setTimeout(() => this.error.classList.add('none'), 3000);
  }

  static getDate() {
    const year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let day = new Date().getDate();
    let hours = new Date().getHours();
    let minute = new Date().getMinutes();

    if (String(month).length === 1) {
      month = `0${month}`;
    }
    if (String(day).length === 1) {
      day = `0${day}`;
    }
    if (String(minute).length === 1) {
      minute = `0${minute}`;
    }
    if (String(hours).length === 1) {
      hours = `0${hours}`;
    }
    return `${day}.${month}.${String(year).slice(2)} ${hours}:${minute}`;
  }
}
