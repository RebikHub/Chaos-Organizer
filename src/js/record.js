/* eslint-disable no-param-reassign */
import Organizer from './organizer';
import notificationBox from './notification';

export default class Record {
  constructor(server) {
    this.server = server;
    this.chunks = [];
    this.recorder = null;

    this.type = null;
    this.error = null;
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
    this.clickAudioVideo(this.videoBtn);
    this.clickAudioVideo(this.audioBtn);
  }

  async createRecord(element, types) {
    try {
      let stream;
      if (types === 'audio') {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      } else if (types === 'video') {
        stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
      }

      this.recorder = new MediaRecorder(stream);

      this.recorder.addEventListener('start', () => {
        console.log('recording started');
      });

      this.recorder.addEventListener('dataavailable', (ev) => {
        console.log('data available');
        this.chunks = [];
        this.chunks.push(ev.data);
      });

      this.recorder.addEventListener('stop', async () => {
        console.log('recording stopped');
        const data = await this.chunks[0];
        this.recordFile(data);
      });

      this.recorder.start();
    } catch (error) {
      this.error = error;
      console.log(error);
    }
  }

  async recordFile(blob) {
    const formData = new FormData();
    formData.append('file', blob);
    const id = await this.server.saveUploads(formData);
    const url = await this.server.downloadFile(id);
    Organizer.createDataContent(blob, url, id);
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
    await this.createRecord(this.createElement, type);
    if (!window.MediaRecorder || this.error !== null) {
      await notificationBox();
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
    this.recorder.stop();
    this.recorder = null;
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
      } else if (!this.timer.classList.contains('none') && element.classList.contains('image-cancel')) {
        this.cancelRecord();
      }
    });
  }
}
