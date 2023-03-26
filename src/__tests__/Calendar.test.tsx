import { render, screen } from '@testing-library/react';
import { format } from 'date-fns';
import Calendar from '../components/Calendar';

describe('Calendar', () => {
  it('should render a calendar when no date is selected', () => {
    const mockSetDate = jest.fn();
    const mockDate = {
      justDate: null,
      dateTime: null,
    };
    render(<Calendar setDate={mockSetDate} date={mockDate} />);
    const monthAndYear = format(new Date(), 'MMMM yyyy');
    const calendarElement = screen.getByRole('button', { name: monthAndYear });
    expect(calendarElement).toBeInTheDocument();
  });

  it('should render times after selecting a date', async () => {
    const mockSetDate = jest.fn();
    const mockDate: DateObject = {
      justDate: new Date(),
      dateTime: null,
    };
    mockDate.justDate?.setHours(0, 0, 0, 0);

    render(<Calendar setDate={mockSetDate} date={mockDate} />);

    const hours = screen.getAllByRole('button', { name: /:00/ });

    expect(hours).toHaveLength(3);
  });
});
