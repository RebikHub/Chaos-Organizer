/* eslint-disable max-len */
import Organizer from './organizer';

export default class DnD {
  constructor(server) {
    this.server = server;
    this.organizer = document.getElementById('organizer');
    this.orgRecords = document.querySelector('.organizer-records');
    this.dropBox = document.querySelector('.drop-box');
    this.dndInput = document.querySelector('.dnd-input');
    this.inputFileBtn = document.querySelector('.organizer-input-file');
    this.inputFile = document.querySelector('.input-file-btn');
    this.img = {
      url: null,
      name: null,
      file: null,
      date: null,
    };
    this.file = {
      name: null,
      file: null,
      date: null,
    };
  }

  events() {
    this.dragEnter();
    this.dragLeave();
    this.dragEnd();
    this.inputFilesClick();
    this.clickLoadFile();
  }

  dragEnter() {
    this.orgRecords.addEventListener('dragenter', () => {
      this.dropBox.classList.remove('none');
    });
  }

  dragLeave() {
    this.dndInput.addEventListener('dragleave', () => {
      this.dropBox.classList.add('none');
    });
  }

  dragEnd() {
    this.dndInput.addEventListener('drop', (ev) => {
      ev.preventDefault();
      this.dropBox.classList.add('none');
      this.renderInputFile(ev.dataTransfer.files);
    });
  }

  inputFilesClick() {
    this.inputFileBtn.addEventListener('click', () => {
      this.inputFile.dispatchEvent(new MouseEvent('click'));
    });

    this.inputFile.addEventListener('change', (evt) => {
      const files = Array.from(evt.currentTarget.files);
      this.renderInputFile(files);
    });
  }

  static createSendFile(data) {
    return {
      file: data,
      date: new Date().getTime(),
    };
  }

  renderInputFile(files) {
    for (const i of files) {
      if (i.type.includes('image')) {
        this.createDataImage(i);
      } else {
        this.readFile(i);
      }
      console.log(i);
      const fileReader = new FileReader();
      fileReader.onload = (ev) => this.server.saveUploads(DnD.createSendFile(ev.target.result));
      fileReader.readAsDataURL(i);
      // this.server.saveUploads(DnD.createSendFile(i));
    }
  }

  createDataFile(data, dataLink) {
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
    link.dataset.name = `${data.name}`;
    link.setAttribute('download', `${data.name}`);
    dataFile.append(link);
    dataFile.append(name);
    dataFile.append(size);
    this.orgRecords.append(Organizer.createRecord(dataFile));
    Organizer.scrollToBottom(this.orgRecords);
  }

  readFile(file) {
    const fileReader = new FileReader();
    fileReader.onload = (ev) => this.createDataFile(file, ev.target.result);
    fileReader.readAsDataURL(file);
  }

  addImage(image, dataLink) {
    const divImg = document.createElement('div');
    const name = document.createElement('p');
    const link = document.createElement('a');
    link.classList.add('link-download');
    link.dataset.name = `${image.alt}`;
    link.setAttribute('download', `${image.alt}`);
    link.href = dataLink;
    name.classList.add('drop-file-name');
    divImg.classList.add('image');
    divImg.append(link);
    divImg.append(image);
    this.orgRecords.appendChild(Organizer.createRecord(divImg));
    Organizer.scrollToBottom(this.orgRecords);
  }

  createDataImage(file) {
    const url = URL.createObjectURL(file);
    const image = document.createElement('img');
    image.className = 'drop-image';
    image.src = url;
    image.alt = file.name;
    image.onload = () => {
      const fileReader = new FileReader();
      fileReader.onload = (ev) => this.addImage(image, ev.target.result);
      fileReader.readAsDataURL(file);
    };
  }

  clickLoadFile() {
    this.organizer.addEventListener('click', (ev) => {
      if (ev.target.classList.contains('link-download')) {
        this.server.downloadFile(ev.target.dataset.name);
      }
    });
  }
}
