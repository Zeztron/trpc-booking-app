'use client'

import React, { useEffect, useState } from 'react';
import ReactCalendar from 'react-calendar';
import { format, formatISO, isBefore, parse } from 'date-fns';
import type { Day } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { getOpeningTimes, roundToNearestMinutes } from '~/utils/helpers';
import { INTERVAL, now } from '~/constants/config';
import { DateObject } from '~/utils/types';

interface CalendarProps {
  days: Day[];
  closedDays: string[];
}

const Calendar: React.FC<CalendarProps> = ({ days, closedDays }) => {
  const router = useRouter();

  const today = days.find((day) => day.dayOfWeek === now.getDay());
  const rounded = roundToNearestMinutes(now, INTERVAL);
  const closing = parse(today!.closeTime, 'kk:mm', now);
  const tooLate = !isBefore(rounded, closing);

  if (tooLate) closedDays.push(formatISO(new Date().setHours(0, 0, 0, 0)));

  const [date, setDate] = useState<DateObject>({
    justDate: null,
    dateTime: null,
  });

  useEffect(() => {
    if (date.dateTime) {
      localStorage.setItem('selectedTime', date.dateTime.toISOString());
      router.push('/menu');
    }
  }, [date.dateTime]);

  const times = date.justDate && getOpeningTimes(date.justDate, days);

  return (
    <div className='h-screen flex flex-col justify-center items-center'>
      {date.justDate ? (
        <div className='flex gap-4'>
          {times &&
            times.length > 0 &&
            times?.map((time, i) => (
              <div key={`time-${i}`} className='rounded-sm bg-gray-100 p-2'>
                <button
                  type='button'
                  onClick={() =>
                    setDate((prev) => ({ ...prev, dateTime: time }))
                  }
                >
                  {format(time, 'kk:mm')}
                </button>
              </div>
            ))}
        </div>
      ) : (
        <ReactCalendar
          minDate={new Date()}
          className='REACT-CALENDAR p-2'
          view='month'
          tileDisabled={({ date }) => closedDays.includes(formatISO(date))}
          onClickDay={(date) =>
            setDate((prev) => ({ ...prev, justDate: date }))
          }
        />
      )}
    </div>
  );
};

export default Calendar;
