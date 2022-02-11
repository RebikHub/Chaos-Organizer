export default class Server {
  constructor() {
    this.url = 'https://ahj-organizer.herokuapp.com';
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
    const response = await fetch(`${this.url}/delete/?${id}`);
    return response.text();
  }

  async savePinned(id) {
    await fetch(`${this.url}/pin`, {
      method: 'POST',
      body: id,
    });
  }

  async loadPinned() {
    const response = await fetch(`${this.url}/pin`);
    return response.text();
  }

  async removePinned(id) {
    await fetch(`${this.url}/removePin/?${id}`);
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

  static async botWeather(lat, lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&lang=ru&units=metric&exclude=hourly,dail&appid=589a0052853cc106e504ea1815b90ca2`);
    return response.json();
  }
}
