/* eslint-disable no-await-in-loop */

export default class Organizer {
  constructor(server) {
    this.server = server;
    this.organizer = document.getElementById('organizer');
    this.organizerRecords = document.querySelector('.organizer-records');
    this.organizerInputText = document.querySelector('.organizer-input-text');
    this.message = null;
    this.enterBtn = document.querySelector('.organizer-input-enter');

    this.modal = document.querySelector('.modal');
    this.modalInput = document.querySelector('.modal-input-text');
    this.ok = document.querySelector('.modal-ok');
    this.cancel = document.querySelector('.modal-cancel');
    this.error = document.querySelector('.input-error');
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
        this.server.deleteFile(ev.target.parentElement.dataset.id);
        ev.target.parentElement.parentElement.remove();
      }
    });
  }

  async initOrganizer() {
    const arrRecords = document.querySelectorAll('.record');
    try {
      const store = await this.server.loadStore(arrRecords.length);
      console.log(store);
      if (store) {
        for (const i of store) {
          const url = await this.server.downloadFile(i.idName);
          console.log(i.type);
          if (i.type === 'message') {
            this.createDataMessage(i.file, i.idName, i.date, false);
          } else if (i.type === 'image') {
            Organizer.createDataContent(i, url, i.idName, i.date, false);
          } else if (i.type === 'audio' || i.type === 'video') {
            Organizer.createDataContent(i, url, i.idName, i.date, false);
          } else {
            Organizer.createDataFile(i, url, i.idName, i.date, false);
          }
        }
        Organizer.scrollToBottom(this.organizerRecords);
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
        await this.initOrganizer();
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

    recTitle.dataset.id = `${dataName}`;
    recTitle.append(attach);
    recTitle.append(recDel);
    recTitle.append(date);
    record.append(recTitle);

    Organizer.createTextInputRecord(record, content);

    return record;
  }

  pinnedContent() {
    this.organizerRecords.addEventListener('click', (ev) => {
      if (ev.target.classList.contains('record-attach')) {
        const box = ev.target.closest('.record');
        for (const i of document.querySelectorAll('.record')) {
          if (i === box) {
            if (this.organizer.querySelector('.record-pin')) {
              this.organizer.querySelector('.record-pin').remove();
            }
            const clone = i.cloneNode(true);
            clone.querySelector('.record-title').classList.add('pin-close');
            clone.querySelector('.pin-close').classList.remove('record-title');
            clone.querySelector('.pin-close').textContent = '';
            if (clone.querySelector('.drop-image')) {
              clone.querySelector('.drop-image').classList.add('pin-image');
              clone.querySelector('.pin-image').classList.remove('drop-image');
            }
            clone.className = 'record-pin';
            this.organizer.append(clone);
          }
        }
      }
    });
  }

  closePinned() {
    this.organizer.addEventListener('click', (ev) => {
      if (ev.target.classList.contains('pin-close')) {
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
    console.log(data.dataset.type);
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
    console.log(data.type.includes('audio'));
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

  async createIdMessage(message) {
    let id = null;
    id = await this.server.saveMessages({
      type: 'message',
      file: message,
      date: new Date().getTime(),
    });
    return id;
  }

  inputTextEnter() {
    this.organizerInputText.addEventListener('keyup', async (ev) => {
      if (ev.key === 'Enter' && this.message !== null && this.message !== '') {
        const id = await this.createIdMessage(this.message);
        this.createDataMessage(this.message, id);
      }
    });
    this.organizerInputText.addEventListener('blur', () => {
      this.organizerInputText.value = '';
    });
  }

  inputTextClickBtnEnter() {
    this.enterBtn.addEventListener('click', async () => {
      if (this.message !== null && this.organizerInputText.value !== null && this.message !== '') {
        const id = await this.createIdMessage(this.message);
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
