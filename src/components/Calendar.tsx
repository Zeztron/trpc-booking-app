import React, { Dispatch, SetStateAction } from 'react';
import ReactCalendar from 'react-calendar';
import { add, format } from 'date-fns';
import {
  INTERVAL,
  STORE_CLOSING_TIME,
  STORE_OPENING_TIME,
} from '~/constants/config';
import { DateObject } from '~/utils/types';

interface CalendarProps {
  date: DateObject;
  setDate: Dispatch<SetStateAction<DateObject>>;
}

const Calendar: React.FC<CalendarProps> = ({ date, setDate }) => {
  const getTimes = (date: DateObject, interval: number = INTERVAL): Date[] => {
    if (!date || !date.justDate) return [];

    const { justDate } = date;

    const beginning = add(justDate, { hours: STORE_OPENING_TIME });
    const end = add(justDate, { hours: STORE_CLOSING_TIME });

    const times = [];
    for (let i = beginning; i < end; i = add(i, { minutes: interval })) {
      times.push(i);
    }

    return times;
  };

  const times = getTimes(date);

  return (
    <div className='h-screen flex flex-col justify-center items-center'>
      {date.justDate ? (
        <div className='flex gap-4'>
          {times.length > 0 &&
            times.map((time, i) => (
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
          onClickDay={(date) =>
            setDate((prev) => ({ ...prev, justDate: date }))
          }
        />
      )}
    </div>
  );
};

export default Calendar;
