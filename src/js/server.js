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
    // return response.json();
  }

  async saveUploads(data) {
    await fetch(`${this.url}/uploads`, {
      method: 'POST',
      body: data,
    });
    // const fd = await response.json();
  }

  async loadMessages() {
    const messages = await fetch(`${this.url}/messages`);
    return messages.json();
  }

  async loadImages() {
    const images = await fetch(`${this.url}/images`);
    return images.json();
  }

  async loadVideo() {
    const video = await fetch(`${this.url}/video`);
    return video.json();
  }

  async loadAudio() {
    const audio = await fetch(`${this.url}/audio`);
    return audio.json();
  }

  async loadLinks() {
    const links = await fetch(`${this.url}/links`);
    return links.json();
  }
}
