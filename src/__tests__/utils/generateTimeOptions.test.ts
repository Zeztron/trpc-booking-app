import { generateTimeOptions } from '~/utils/generateTimeOptions';

describe.only('generateTimeOptions', () => {
  it('should generate an array of time options based on the start hour, end hour, and interval', () => {
    const startHour = 9;
    const endHour = 12;
    const interval = 30;

    const expected = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];

    const result = generateTimeOptions(startHour, endHour, interval);
    expect(result).toEqual(expected);
  });
});
