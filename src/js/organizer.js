import Record from './record';
import notificationBox from './notification';

export default class Organizer {
  constructor(server) {
    this.server = server;
    this.organizerRecords = document.querySelector('.organizer-records');
    this.organizerInputText = document.querySelector('.organizer-input-text');
    this.message = null;
    this.modal = document.querySelector('.modal');
    this.modalInput = document.querySelector('.modal-input-text');
    this.ok = document.querySelector('.modal-ok');
    this.cancel = document.querySelector('.modal-cancel');
    this.error = document.querySelector('.input-error');
    this.audioBtn = document.querySelector('.organizer-input-audio');
    this.videoBtn = document.querySelector('.organizer-input-video');
    this.enterBtn = document.querySelector('.organizer-input-enter');
    this.imageBtn = document.querySelector('.organizer-input-image');
    this.geoBtn = document.querySelector('.organizer-input-geo');
    this.timer = document.querySelector('.timer');
    this.recorder = null;
    this.createElement = null;
    this.timerId = null;
    this.min = 0;
    this.sec = 0;
  }

  events() {
    this.organizerInputText.focus();
    this.inputText();
    this.inputTextEnter();
    this.inputTextClickBtnEnter();
    this.clickAudioVideo(this.videoBtn);
    this.clickAudioVideo(this.audioBtn);
  }

  static createTextInputRecord(div, content) {
    console.log(content);
    if (typeof content === 'string' && (/^https:\/\//.test(content) || /^http:\/\//.test(content))) {
      const contents = document.createElement('div');
      const link = document.createElement('a');
      content.trim();
      link.href = content;
      link.target = '_blank';
      link.style.color = 'aliceblue';
      link.textContent = content;
      contents.append(link);
      div.appendChild(contents);
    } else if (typeof content === 'string') {
      const contents = document.createElement('div');
      div.appendChild(contents);
      contents.textContent = content.trim();
    } else {
      div.appendChild(content);
    }
  }

  static createRecord(content) {
    const record = document.createElement('div');
    const date = document.createElement('div');
    record.classList.add('record');
    date.classList.add('record-date');
    date.textContent = Organizer.getDate();
    record.appendChild(date);

    Organizer.createTextInputRecord(record, content);

    return record;
  }

  addDataToOrgRecords(record) {
    this.organizerRecords.appendChild(record);
    if (this.message !== null) {
      this.server.saveMessages({
        message: this.message,
        date: new Date().getTime(),
      });
      this.message = null;
      this.createElement = null;
    }
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
    // тут был запрос на геопозицию
    this.timer.classList.remove('none');
    this.timerRec();
    this.videoBtn.classList.remove('organizer-input-video');
    this.videoBtn.classList.add('image-cancel');
    this.audioBtn.classList.remove('organizer-input-audio');
    this.audioBtn.classList.add('image-ok');
  }

  transformButtonsOff() {
    this.timer.classList.add('none');
    this.videoBtn.classList.add('organizer-input-video');
    this.videoBtn.classList.remove('image-cancel');
    this.audioBtn.classList.add('organizer-input-audio');
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
      if (this.timer.classList.contains('none') && element.classList.contains('organizer-input-audio')) {
        this.record('audio');
      } else if (this.timer.classList.contains('none') && element.classList.contains('organizer-input-video')) {
        this.record('video');
      } else if (!this.timer.classList.contains('none') && element.classList.contains('image-ok')) {
        this.cancelRecord();
        const record = Organizer.createRecord(this.createElement);
        this.addDataToOrgRecords(record);
      } else if (!this.timer.classList.contains('none') && element.classList.contains('image-cancel')) {
        this.cancelRecord();
      }
    });
  }

  inputText() {
    this.organizerInputText.addEventListener('input', (ev) => {
      this.message = ev.target.value.replace(/\n/g, '');
    });
  }

  inputTextEnter() {
    this.organizerInputText.addEventListener('keyup', (ev) => {
      if (ev.key === 'Enter' && this.message !== null) {
        const record = Organizer.createRecord(this.message);
        this.addDataToOrgRecords(record);
        this.organizerInputText.value = null;
      }
    });
  }

  inputTextClickBtnEnter() {
    this.enterBtn.addEventListener('click', () => {
      if (this.message !== null && this.organizerInputText.value !== null) {
        this.addRecord(this.message);
        this.organizerInputText.value = null;
      }
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
