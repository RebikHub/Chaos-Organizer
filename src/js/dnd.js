/* eslint-disable no-await-in-loop */
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
    // this.clickLoadFile();
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
    const formData = new FormData();
    formData.append('file', data);
    return formData;
  }

  async renderInputFile(files) {
    for (const i of files) {
      const name = await this.server.saveUploads(DnD.createSendFile(i));

      if (i.type.includes('image')) {
        const url = await this.server.downloadFile(name);
        Organizer.createDataImage(i, url, name);
      } else {
        const url = await this.server.downloadFile(name);
        Organizer.createDataFile(i, url, name);
      }
    }
  }

  clickLoadFile() {
    this.organizer.addEventListener('click', (ev) => {
      ev.preventDefault();
      if (ev.target.classList.contains('link-download')) {
        console.log(ev.target.dataset.name);
        this.server.downloadFile(ev.target.dataset.name);
      }
    });
  }
}
