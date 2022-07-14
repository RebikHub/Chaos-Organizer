# Chaos Organizer

[![Build status](https://ci.appveyor.com/api/projects/status/dci12u8fk9v95b72/branch/main?svg=true)](https://ci.appveyor.com/project/RebikHub/ahj-organizer-front/branch/main)

[Link to Chaos Organizer](https://rebikhub.github.io/Chaos-Organizer/)

[Серверная часть](https://github.com/RebikHub/ahj-organizer-back)

- Сохранение в истории ссылок и текстовых сообщений
- Ссылки (то, что начинается с http:// или https://) должны быть кликабельны и отображаться как ссылки

![](./src/image_readme/link-http.png)

- Сохранение в истории изображений, видео и аудио (как файлов) - через Drag & Drop и через иконку загрузки (скрепка в большинстве мессенджеров)

![](./src/image_readme/dnd.png)
![](./src/image_readme/upload.png)

- Скачивание файлов (на компьютер пользователя)

![](./src/image_readme/download.png)

- Ленивая подгрузка: сначала подгружаются последние 10 сообщений, при прокрутке вверх подгружаются следующие 10 и т.д.

![](./src/image_readme/loadmess.png)
![](./src/image_readme/loadmess13.png)

- Запись видео и аудио (используя API браузера)
- Воспроизведение видео/аудио (используя API браузера)

![](./src/image_readme/media.png)

- Отправка геолокации с расположением на карте

![](./src/image_readme/geo.png)

- Закрепление (pin) сообщений, закреплять можно только одно сообщение (прикрепляется к верхней части страницы)

![](./src/image_readme/pinned.png)

- Работа в оффлайн-режиме (при этом загруженные сообщения должны кэшироваться и быть доступными после обновления страницы)

![](./src/image_readme/sw.png)

- Показывается погода по текущему месту нахождения по команде @bot

![](./src/image_readme/weather.png)
