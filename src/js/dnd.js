import Organizer from './organizer';

export default class DnD {
  constructor(server) {
    this.server = server;
    this.orgRecords = document.querySelector('.organizer-records');
    this.dropBox = document.querySelector('.drop-box');
    this.dndInput = document.querySelector('.dnd-input');
    this.textName = null;
    this.textSrc = null;
    this.update = false;
    this.img = {
      url: null,
      name: null,
      file: null,
    };
  }

  events() {
    this.dragEnter();
    this.dragLeave();
    this.dragEnd();
  }

  dragEnter() {
    this.orgRecords.addEventListener('dragenter', (ev) => {
      console.log(ev.target);
      this.dropBox.classList.remove('none');
    });
  }

  dragLeave() {
    this.dndInput.addEventListener('dragleave', (ev) => {
      console.log(ev.target);
      this.dropBox.classList.add('none');
    });
  }

  dragEnd() {
    this.dndInput.addEventListener('drop', (ev) => {
      ev.preventDefault();
      this.dropBox.classList.add('none');
      console.log(ev.dataTransfer.files);

      for (const i of ev.dataTransfer.files) {
        if (i.type.includes('image')) {
          this.createDataImage(i);
        } else {
          this.inputAndConvert(i);
        }
        console.log(i);
        // const formData = new FormData();
        // this.server.saveUploads(formData.set('dropFile', i));
      }
    });
  }

  createDataFile(data, dataLink) {
    const dataFile = document.createElement('div');
    const name = document.createElement('p');
    const size = document.createElement('p');
    const link = document.createElement('a');
    link.classList.add('link-download');
    dataFile.classList.add('drop-file');
    name.textContent = data.name;
    size.textContent = `Size: ${Number((data.size / 1048576).toFixed(2))} Mb`;
    link.href = dataLink;
    link.setAttribute('download', `${data.name}`);
    dataFile.append(link);
    dataFile.append(name);
    dataFile.append(size);
    this.orgRecords.append(Organizer.createRecord(dataFile));
  }

  inputAndConvert(file) {
    const fileReader = new FileReader();
    fileReader.onload = (ev) => this.createDataFile(file, ev.target.result);

    fileReader.readAsDataURL(file);
  }

  createDataImage(file) {
    const url = URL.createObjectURL(file);
    if (url) {
      const image = document.createElement('img');
      image.src = url;
      image.alt = file.name;
      this.img.url = url;
      this.img.name = file.name;
      this.img.file = file;
      image.onload = () => this.addImage(image);
    }
  }

  addImage(image) {
    const divImg = document.createElement('div');
    divImg.classList.add('image');
    divImg.appendChild(image);
    this.orgRecords.appendChild(Organizer.createRecord(divImg));
  }
}
