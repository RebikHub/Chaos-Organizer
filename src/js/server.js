export default class Server {
  constructor() {
    this.url = 'http://localhost:3333';
    this.store = new Set();
  }

  async saveMessages(data) {
    await fetch(`${this.url}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async saveUploads(data) {
    await fetch(`${this.url}/uploads`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async loadStore() {
    const store = await fetch(`${this.url}/store`);
    return store.json();
  }

  async loadMessages() {
    const messages = await fetch(`${this.url}/messages`);
    return messages.json();
  }

  async loadImages() {
    const images = await fetch(`${this.url}/images`);
    return images.json();
  }

  async downloadFile(name) {
    const response = await fetch(`${this.url}/download`, {
      method: 'POST',
      body: name,
    });
    const res = await response.json();

    const fileReader = new FileReader();
    fileReader.onload = (ev) => console.log(ev.target.result);
    fileReader.readAsDataURL(res);
    console.log(res);
  }
}
