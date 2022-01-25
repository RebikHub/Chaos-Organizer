/* eslint-disable no-unused-vars */
export default async function notificationBox() {
  if (!window.Notification) {
    return;
  }

  const notification = new Notification(`Sample notification ${new Date()}`, {
    body: 'Необходимо выдать право на запись или использовать другой браузер!',
    requireInteraction: true,
  });

  console.log(Notification.permission);

  if (Notification.permission === 'granted') {
    return;
  }

  if (Notification.permission !== 'denied' || Notification.permission === 'default') {
    Notification.requestPermission();
  }
}
