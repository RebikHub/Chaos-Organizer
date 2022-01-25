export default class Server {
  constructor() {
    this.url = 'http://localhost:3333/';
    this.store = new Set();
  }

  async saveStore(data) {
    const response = await fetch(this.url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data),
    });
    return response.json();
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
