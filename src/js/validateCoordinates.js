export default function validate(coordinates) {
  const coorArr = coordinates.split(',');
  const latitude = coorArr[0].trim();
  const longitude = coorArr[1].trim();

  if (/^\[?-?\d{1,2}\.\d{1,9}\]?$/.test(latitude)
  && /^\[?-?\d{1,2}\.\d{1,9}\]?$/.test(longitude)) {
    return true;
  }

  return false;
}
