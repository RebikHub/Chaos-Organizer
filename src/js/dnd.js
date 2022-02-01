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
    // let typeFile = null;
    // if (data.includes('image')) {
    //   typeFile = 'image';
    // }
    // if (data.includes('text')) {
    //   typeFile = 'text';
    // }
    // return {
    //   type: typeFile,
    //   file: data,
    //   date: new Date().getTime(),
    // };
    const formData = new FormData();
    formData.append('file', data);
    return formData;
  }

  async renderInputFile(files) {
    for (const i of files) {
      if (i.type.includes('image')) {
        Organizer.createDataImage(i);
      } else {
        Organizer.readFile(i);
      }
      console.log(i);
      this.server.saveUploads(DnD.createSendFile(i));
      // const fileReader = new FileReader();
      // fileReader.onload = (ev) => this.server.saveUploads(DnD.createSendFile(ev.target.result));
      // fileReader.readAsDataURL(i);
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
