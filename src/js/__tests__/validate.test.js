import validate from '../validateCoordinates';

test.each([
  ['validate input', '51.50851, -0.12572', true],
  ['validate input', '51.50851,-0.12572', true],
  ['validate input', '[51.50851, -0.12572]', true],
  ['validate input', '[51, -0.12572]', false],
])(('validate input'), (_, input, expected) => {
  expect(validate(input)).toEqual(expected);
});
