import { render, screen } from '@testing-library/react';
import { format } from 'date-fns';
import { Day } from '@prisma/client';
import Calendar from '../components/Calendar';

jest.mock('next/navigation')

const days: Day[] = [
  {
    id: '1',
    name: 'sunday',
    dayOfWeek: 0,
    openTime: '09:00',
    closeTime: '17:00',
  },
  {
    id: '2',
    name: 'monday',
    dayOfWeek: 1,
    openTime: '09:00',
    closeTime: '17:00',
  },
  {
    id: '3',
    name: 'tuesday',
    dayOfWeek: 2,
    openTime: '09:00',
    closeTime: '17:00',
  },
  {
    id: '4',
    name: 'wednesday',
    dayOfWeek: 3,
    openTime: '09:00',
    closeTime: '17:00',
  },
  {
    id: '5',
    name: 'thursday',
    dayOfWeek: 4,
    openTime: '09:00',
    closeTime: '17:00',
  },
  {
    id: '6',
    name: 'friday',
    dayOfWeek: 5,
    openTime: '09:00',
    closeTime: '17:00',
  },
  {
    id: '7',
    name: 'saturday',
    dayOfWeek: 6,
    openTime: '09:00',
    closeTime: '17:00',
  },
];

describe('Calendar', () => {
  it('should render a calendar and display opening times', () => {
    render(<Calendar days={days} closedDays={[]} />);
    console.log(screen.debug());
  });

  it('should render times after selecting a date', async () => {});
});
