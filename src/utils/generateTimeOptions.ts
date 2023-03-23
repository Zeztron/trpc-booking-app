/*
This function generates an array of time options based on the specified start hour, end hour, and interval between time options in minutes.

It uses the `Array.from()` method to create an array with a specific length based on the start and end hours.

For each hour in the array, it generates an array of minutes based on the interval between time options, using the `Array.from()` method.

It then uses the `flatMap()` method to generate an array of time options for each hour and minute combination, represented as a string in the format of "HH:MM".

The resulting array is flattened into a single array of time options, and returned by the function.

*/

export function generateTimeOptions(
  startHour: number,
  endHour: number,
  intervalMinutes: number
): string[] {
  const options = Array.from({ length: endHour - startHour }, (_, hour) => {
    const hours = hour + startHour;
    const minutes = Array.from(
      { length: 60 / intervalMinutes },
      (_, index) => index * intervalMinutes
    );
    return minutes.flatMap(
      (minute) =>
        `${hours.toString().padStart(2, '0')}:${minute
          .toString()
          .padStart(2, '0')}`
    );
  }).flat();

  return options;
}
