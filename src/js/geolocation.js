export default async function geolocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      resolve(`[${latitude}, ${longitude}]`);
    }, () => {
      resolve(null);
    });
  });
}
