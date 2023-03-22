import React, { useState } from 'react';
import ReactCalendar from 'react-calendar';
import { add, format } from 'date-fns';

interface CalendarProps {}

interface DateObject {
  justDate: Date | null;
  dateTime: Date | null;
}

const Calendar: React.FC<CalendarProps> = () => {
  const [date, setDate] = useState<DateObject>({
    justDate: null,
    dateTime: null,
  });

  const getTimes = (date: DateObject, interval: number = 30): Date[] => {
    if (!date || !date.justDate) return [];

    const { justDate } = date;
    const beginning = add(justDate, { hours: 9 });
    const end = add(justDate, { hours: 17 });

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
          {times.length > 0 && times.map((time, i) => (
            <div key={`time-${i}`} className='rounded-sm bg-gray-100 p-2'>
              <button
                type='button'
                onClick={() => setDate((prev) => ({ ...prev, dateTime: time }))}
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
