/* eslint-disable import/no-cycle */
/* eslint-disable no-await-in-loop */
import Geo from './geolocation';

export default class Organizer {
  constructor(server) {
    this.server = server;
    this.organizer = document.getElementById('organizer');
    this.organizerRecords = document.querySelector('.organizer-records');
    this.organizerInputText = document.querySelector('.organizer-input-text');
    this.message = null;
    this.enterBtn = document.querySelector('.organizer-input-enter');
    this.pinnedId = null;
  }

  async events() {
    this.organizerInputText.focus();
    this.inputText();
    this.inputTextEnter();
    this.inputTextClickBtnEnter();
    this.pinnedContent();
    this.closePinned();
    await this.initOrganizer();
    this.onScroll();
    this.deleteRecord();
  }

  deleteRecord() {
    this.organizer.addEventListener('click', (ev) => {
      if (ev.target.classList.contains('record-delete')) {
        const record = ev.target.closest('.record');
        this.server.deleteFile(record.dataset.id);
        if (this.pinnedId === record.dataset.id) {
          this.server.removePinned(this.pinnedId);
          this.organizer.querySelector('.record-pin').remove();
        }
        record.remove();
      }
    });
  }

  async initOrganizer() {
    const arrRecords = document.querySelectorAll('.record');
    try {
      const store = await this.server.loadStore(arrRecords.length);
      if (store) {
        for (const i of store) {
          const url = await this.server.downloadFile(i.idName);
          if (i.type === 'message') {
            this.createDataMessage(i.file, i.idName, i.date, false);
          } else if (i.type === 'geo') {
            const map = Geo.createElementMap(i.file);
            this.createDataMessage(map, i.idName, i.date, false);
            Geo.initMap(i.file);
          } else if (i.type === 'image') {
            Organizer.createDataContent(i, url, i.idName, i.date, false);
          } else if (i.type === 'audio' || i.type === 'video') {
            Organizer.createDataContent(i, url, i.idName, i.date, false);
          } else {
            Organizer.createDataFile(i, url, i.idName, i.date, false);
          }
        }
        Organizer.scrollToBottom(this.organizerRecords);
        this.pinnedId = await this.server.loadPinned();
        this.pinning(this.pinnedId);
      }
    } catch (error) {
      console.log(error);
    }
  }

  static scrollToBottom(element) {
    element.scrollTo({
      top: element.scrollHeight,
      behavior: 'smooth',
    });
  }

  onScroll() {
    this.organizerRecords.onscroll = async () => {
      const arrRecords = document.querySelectorAll('.record');
      const lastEl = arrRecords[0].getBoundingClientRect().y;

      if (lastEl === 25) {
        this.initOrganizer();
      }
    };
  }

  async createDataMessage(content, id, date, newdata = true) {
    const record = Organizer.createRecord(content, id, date, newdata);

    if (newdata) {
      this.organizerRecords.append(record);
      Organizer.scrollToBottom(this.organizerRecords);
    } else {
      const beforeElement = document.querySelectorAll('.record');
      this.organizerRecords.insertBefore(record, beforeElement[0]);
    }

    this.organizerInputText.value = null;
  }

  static createTextInputRecord(div, content) {
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
      const contents = document.createElement('p');
      contents.className = 'record-text';
      div.appendChild(contents);
      contents.textContent = content.trim();
    } else {
      div.appendChild(content);
    }
  }

  static createRecord(content, dataName, dataDate) {
    const record = document.createElement('div');
    const recTitle = document.createElement('div');
    const date = document.createElement('div');
    const attach = document.createElement('div');
    const recDel = document.createElement('div');
    recDel.classList.add('record-delete');
    recTitle.classList.add('record-title');
    attach.classList.add('record-attach');
    record.classList.add('record');
    date.classList.add('record-date');

    if (dataDate !== null) {
      date.textContent = Organizer.getDate(dataDate);
    } else {
      date.textContent = Organizer.getDate();
    }

    record.dataset.id = `${dataName}`;
    recTitle.append(attach);
    recTitle.append(recDel);
    recTitle.append(date);
    record.append(recTitle);

    Organizer.createTextInputRecord(record, content);

    return record;
  }

  pinning(id) {
    for (const i of document.querySelectorAll('.record')) {
      if (i.dataset.id === id) {
        if (this.organizer.querySelector('.record-pin')) {
          this.organizer.querySelector('.record-pin').remove();
        }
        const clone = i.cloneNode(true);
        clone.querySelector('.record-title').classList.add('pin-close');
        clone.querySelector('.pin-close').classList.remove('record-title');
        clone.querySelector('.pin-close').textContent = '';

        if (clone.querySelector('.drop-img')) {
          clone.querySelector('.drop-img').classList.add('pin-image');
          clone.querySelector('.pin-image').classList.remove('drop-img');
        }

        if (clone.querySelector('.drop-video')) {
          clone.querySelector('.drop-video').classList.add('pin-video');
          clone.querySelector('.pin-video').classList.remove('drop-video');
        }

        if (clone.querySelector('.map')) {
          const geo = document.createElement('div');
          geo.className = 'pin-geo';
          const geoCoords = document.createElement('p');
          geoCoords.className = 'pin-text';
          geoCoords.textContent = `Geolocation: ${clone.querySelector('.map').id}`;
          clone.querySelector('.map').remove();
          const geoImg = document.createElement('div');
          geoImg.className = 'pin-img';
          geo.append(geoImg);
          geo.append(geoCoords);
          clone.append(geo);
        }
        clone.className = 'record-pin';
        this.organizer.append(clone);
      }
    }
  }

  pinnedContent() {
    this.organizerRecords.addEventListener('click', (ev) => {
      if (ev.target.classList.contains('record-attach')) {
        const { id } = ev.target.closest('.record').dataset;
        this.server.savePinned(id);
        this.pinnedId = id;
        this.pinning(id);
      }
    });
  }

  closePinned() {
    this.organizer.addEventListener('click', (ev) => {
      if (ev.target.classList.contains('pin-close')) {
        this.server.removePinned(this.pinnedId);
        this.pinnedId = null;
        this.organizer.querySelector('.record-pin').remove();
      }
    });
  }

  static createDataFile(data, dataLink, dataName, dataDate, newdata = true) {
    const orgRec = document.querySelector('.organizer-records');

    const dataFile = document.createElement('div');
    const name = document.createElement('p');
    const size = document.createElement('p');
    const link = document.createElement('a');
    link.classList.add('link-download');
    dataFile.classList.add('drop-file');
    name.classList.add('drop-file-name');
    size.classList.add('drop-file-size');
    name.textContent = data.name;
    if (data.size >= 1048576) {
      size.textContent = `Size: ${Number((data.size / 1048576).toFixed(2))} Mb`;
    } else if (data.size < 1048576) {
      size.textContent = `Size: ${Number((data.size / 1024).toFixed(2))} Kb`;
    }
    link.href = dataLink;
    link.setAttribute('download', `${data.name}`);
    dataFile.append(link);
    dataFile.append(name);
    dataFile.append(size);

    if (newdata) {
      orgRec.append(Organizer.createRecord(dataFile, dataName, dataDate));
      Organizer.scrollToBottom(orgRec);
    } else {
      const insertElement = Organizer.createRecord(dataFile, dataName, dataDate);
      const beforeElement = document.querySelectorAll('.record');
      orgRec.insertBefore(insertElement, beforeElement[0]);
    }
  }

  static addContent(data, dataLink, dataName, dataDate, newdata) {
    const orgRec = document.querySelector('.organizer-records');
    const divImg = document.createElement('div');
    divImg.classList.add('image');

    if (data.dataset.type.includes('image')) {
      const link = document.createElement('a');
      link.classList.add('link-download');
      link.setAttribute('download', `${data.alt}`);
      link.href = dataLink;
      divImg.append(link);
    }
    divImg.append(data);

    if (newdata) {
      orgRec.appendChild(Organizer.createRecord(divImg, dataName, dataDate));
      Organizer.scrollToBottom(orgRec);
    } else {
      const insertElement = Organizer.createRecord(divImg, dataName, dataDate);
      const beforeElement = document.querySelectorAll('.record');
      orgRec.insertBefore(insertElement, beforeElement[0]);
    }
  }

  static createDataContent(data, dataLink, dataName, dataDate, newdata = true) {
    let type = null;
    if (data.type.includes('image')) {
      type = 'img';
    } else if (data.type.includes('audio')) {
      type = 'audio';
    } else if (data.type.includes('video')) {
      type = 'video';
    }

    const content = document.createElement(type);
    if (data.type.includes('audio') || data.type.includes('video')) {
      content.controls = true;
    }
    content.dataset.type = data.type;
    content.className = `drop-${type}`;
    content.src = dataLink;
    content.alt = data.name;
    if (type === 'img') {
      content.onload = () => Organizer.addContent(content, dataLink, dataName, dataDate, newdata);
    } else {
      Organizer.addContent(content, dataLink, dataName, dataDate, newdata);
    }
  }

  inputText() {
    this.organizerInputText.addEventListener('input', (ev) => {
      this.message = ev.target.value.replace(/\n/g, '');
    });
  }

  static async createIdMessage(message, server, types = 'message') {
    let id = null;
    id = await server.saveMessages({
      type: types,
      file: message,
      date: new Date().getTime(),
    });
    return id;
  }

  inputTextEnter() {
    this.organizerInputText.addEventListener('keyup', async (ev) => {
      if (ev.key === 'Enter' && this.message !== null && this.message !== '' && this.message !== '@bot') {
        const id = await Organizer.createIdMessage(this.message, this.server);
        this.createDataMessage(this.message, id);
      }
    });
    this.organizerInputText.addEventListener('blur', () => {
      this.organizerInputText.value = '';
    });
  }

  inputTextClickBtnEnter() {
    this.enterBtn.addEventListener('click', async () => {
      if (this.message !== null && this.message !== '' && this.message !== '@bot') {
        const id = await Organizer.createIdMessage(this.message, this.server);
        this.createDataMessage(this.message, id);
      }
    });
  }

  static getDate(date) {
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let day = new Date().getDate();
    let hours = new Date().getHours();
    let minute = new Date().getMinutes();

    if (date) {
      year = new Date(date).getFullYear();
      month = new Date(date).getMonth() + 1;
      day = new Date(date).getDate();
      hours = new Date(date).getHours();
      minute = new Date(date).getMinutes();
    }

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
