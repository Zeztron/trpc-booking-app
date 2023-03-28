import {
    add,
  addMinutes,
  getHours,
  getMinutes,
  isBefore,
  isEqual,
  parse,
} from 'date-fns';
import { categories, INTERVAL, now } from '~/constants/config';
import { Day } from '@prisma/client'

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const selectOptions = categories.map((category) => ({
  value: category,
  label: capitalize(category),
}));

export const weekdayIndexToName = (index: number) => {
  const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  return days[index];
};

export const classNames = (...classes: string[]) =>
  classes.filter(Boolean).join(' ');

export const roundToNearestMinutes = (date: Date, interval: number) => {
  const minutesLeftUntilNextInterval = interval - (getMinutes(date) % interval);
  return addMinutes(date, minutesLeftUntilNextInterval);
};

export const getOpeningTimes = (startDate: Date, dbDays: Day[]) => {
  const dayOfWeek = startDate.getDay();
  const isToday = isEqual(startDate, new Date().setHours(0, 0, 0, 0));

  const today = dbDays.find((day) => day.dayOfWeek === dayOfWeek);
  if (!today) throw new Error('This day does not exist in the database');

  const opening = parse(today.openTime, 'kk:mm', startDate);
  const closing = parse(today.closeTime, 'kk:mm', startDate);

  let hours: number;
  let minutes: number;

  if (isToday) {
    const rounded = roundToNearestMinutes(now, INTERVAL );
    const tooLate = !isBefore(rounded, closing);
    if (tooLate) throw new Error('Too late to book');

    const isBeforeOpening = isBefore(rounded, opening);
    hours = getHours(isBeforeOpening ? opening : rounded);
    minutes = getMinutes(isBeforeOpening ? opening : rounded);
  } else {
    hours = getHours(opening);
    minutes = getMinutes(opening);
  }

  const beginning = add(startDate, { hours, minutes });
  const end = add(startDate, { hours: getHours(closing)})

  const times = []
  for (let i = beginning; i <= end; i = add(i, { minutes: INTERVAL })) {
    times.push(i);
  }

  return times;
};
