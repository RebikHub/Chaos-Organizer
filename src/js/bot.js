import Server from './server';
import Geo from './geolocation';
import Organizer from './organizer';

export default class Bot {
  constructor() {
    this.input = document.querySelector('.organizer-input-text');
    this.clickEnter = document.querySelector('.organizer-input-enter');
    this.orgRecords = document.querySelector('.organizer-records');
    this.text = null;
    this.inputValue = null;
    this.weather = null;
  }

  events() {
    this.inputWeather();
    this.clickEnterWeather();
    this.btnEnterWeather();
  }

  inputWeather() {
    this.input.addEventListener('input', async (ev) => {
      if (ev.target.value === '@bot') {
        this.text = ev.target.value;
        const coords = await Geo.geolocation();
        const data = await Server.botWeather(coords[0], coords[1]);
        const weather = data.current.weather[0];
        this.weather = {
          temp: Math.round(data.current.temp),
          description: weather.description,
          icon: `http://openweathermap.org/img/wn/${weather.icon}@2x.png`,
          date: Organizer.getDate(),
        };
      }
    });
  }

  renderWeatherToDom(object) {
    const html = `
    <div class="weather">
      <div class="weather-date">${object.date}</div>
      <div class="weather-info">
        <img src="${object.icon}" alt="${object.description}" class="weather-img">
        <div class="weather-current">
            <p class="weather-text">${object.temp} °C</p>
            <p class="weather-text">${object.description}</p>
        </div>
      </div>
    </div>
    `;
    this.orgRecords.insertAdjacentHTML('beforeend', html);
  }

  clickEnterWeather() {
    this.clickEnter.addEventListener('click', () => {
      if (this.weather !== null && this.text === '@bot') {
        this.renderWeatherToDom(this.weather);
        this.input.value = '';
        this.weather = null;
        this.input.focus();
      }
    });
  }

  btnEnterWeather() {
    this.input.addEventListener('keyup', (ev) => {
      if (ev.key === 'Enter' && this.text === '@bot' && this.weather !== null) {
        this.renderWeatherToDom(this.weather);
        this.input.value = '';
        this.weather = null;
        this.input.focus();
      }
    });
  }
}
