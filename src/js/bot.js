import Server from './server';
import Geo from './geolocation';

export default class Bot {
  constructor() {
    this.input = document.querySelector('.organizer-input-text');
    this.inputValue = null;
    this.weather = null;
  }

  events() {
    this.inputWeather();
  }

  inputWeather() {
    this.input.addEventListener('input', async (ev) => {
      if (ev.target.value.includes('@bot')) {
        const coords = await Geo.geolocation();
        this.weather = await Server.botWeather(coords[0], coords[1]);
        console.log(this.weather);
      }
    });
  }

  // 'https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&appid=589a0052853cc106e504ea1815b90ca2'
}
