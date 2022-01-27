export default class DnD {
  constructor() {
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
      console.log(ev.dataTransfer.files);
      this.dropBox.classList.add('none');
    });
  }

  sendImage() {
    const formData = new FormData();

    if (this.img.file) {
      formData.append('file', this.img.file);
      formData.append('name', this.img.name);
      formData.append('url', this.img.url);
      this.memory.save(formData);
    } else {
      formData.append('name', this.img.name);
      formData.append('url', this.img.url);
      this.memory.save(formData);
    }
    this.update = false;
    this.img.url = null;
    this.img.name = null;
    this.img.file = null;
  }

  addBlockWithImg(url, name, file) {
    if (url) {
      const image = document.createElement('img');
      image.src = url;
      image.alt = name;
      this.img.url = url;
      this.img.name = name;
      this.img.file = file;

      image.onerror = () => this.verifyUrl();
      image.onload = () => this.addImage(image);
    }
    this.inputName.value = null;
    this.inputSrc.value = null;
    this.textName = null;
    this.textSrc = null;
  }

  addImage(image) {
    const divImg = document.createElement('div');
    const span = document.createElement('span');
    divImg.classList.add('image');
    span.classList.add('close-image');
    divImg.appendChild(image);
    divImg.appendChild(span);
    this.imgsList.appendChild(divImg);
    if (this.update) {
      this.sendImage();
    }
    this.removeImage();
  }

  verifyUrl() {
    this.errorDiv.style = 'display: block';
    this.errorDiv.style.left = `${this.inputSrc.offsetLeft}px`;
    this.errorDiv.style.top = `${this.inputSrc.offsetTop + this.inputSrc.offsetHeight}px`;
  }

  closeErrorBlock() {
    if (this.errorDiv.style.display === 'block') {
      this.errorDiv.style.display = 'none';
    }
  }

  closeDownload() {
    if (this.widget.classList.contains('none')) {
      this.widget.classList.remove('none');
      this.dnd.classList.add('none');
    }
  }

  dndClick(ev) {
    const files = Array.from(ev.currentTarget.files);
    const url = URL.createObjectURL(files[0]);
    this.update = true;
    this.addBlockWithImg(url, files[0].name, files[0]);
  }

  drop() {
    this.dndInput.addEventListener('dragover', (ev) => {
      ev.preventDefault();
    });
    this.dndInput.addEventListener('drop', (ev) => {
      ev.preventDefault();
      const files = Array.from(ev.dataTransfer.files);
      const url = URL.createObjectURL(files[0]);
      this.update = true;
      this.addBlockWithImg(url, files[0].name, files[0]);
    });
  }

  removeImage() {
    for (const item of document.querySelectorAll('.close-image')) {
      item.addEventListener('click', () => {
        item.closest('.image').remove();
        const id = item.closest('.image').children[0].alt;
        this.update = false;
        this.memory.delete(id);
      });
    }
  }
}