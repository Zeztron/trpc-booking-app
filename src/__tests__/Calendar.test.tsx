import { render, screen } from '@testing-library/react';
import { format } from 'date-fns';
import userEvent from '@testing-library/user-event';
import Calendar from '../components/Calendar';

describe('Calendar', () => {
  it('should render a calendar when no date is selected', () => {
    render(<Calendar />);
    const monthAndYear = format(new Date(), 'MMMM yyyy');
    const calendarElement = screen.getByRole('button', { name: monthAndYear });
    expect(calendarElement).toBeInTheDocument();
  });

  it('should render times after selecting a date', async () => {
    const user = userEvent.setup();
    render(<Calendar />);
    const currentDay = screen.getByRole('button', {
      name: format(new Date(), 'MMMM d, yyyy'),
    });
    await user.click(currentDay);

    const hours = screen.getAllByRole('button', { name: /:00/ });

    expect(hours).toHaveLength(3);
  });
});
