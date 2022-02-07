export default class Server {
  constructor() {
    this.url = 'http://localhost:3333';
    this.store = new Set();
  }

  async saveMessages(data) {
    const response = await fetch(`${this.url}/messages`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.text();
  }

  async saveUploads(data) {
    const response = await fetch(`${this.url}/uploads`, {
      method: 'POST',
      body: data,
    });
    return response.text();
  }

  async loadStore(length) {
    const store = await fetch(`${this.url}/store/?${length}`);
    if (store.status === 204) {
      return console.log('no data');
    }
    return store.json();
  }

  async deleteFile(id) {
    console.log(id);
    await fetch(`${this.url}/delete/?${id}`);
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
    const response = await fetch(`${this.url}/download/?${name}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/force-download',
      },
    });
    const res = await response.blob();
    const url = URL.createObjectURL(res);
    return url;
  }
}
