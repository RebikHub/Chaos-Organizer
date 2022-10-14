export default function validate(coordinates) {
  const coordsArr = coordinates.split(',');
  const latitude = coordsArr[0].trim();
  const longitude = coordsArr[1].trim();

  if (/^\[?-?\d{1,2}\.\d{1,9}\]?$/.test(latitude)
  && /^\[?-?\d{1,2}\.\d{1,9}\]?$/.test(longitude)) {
    return true;
  }

  return false;
}
