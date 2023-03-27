import { categories } from '../constants/config';

interface DateObject {
  justDate: Date | null;
  dateTime: Date | null;
}

type Categories = (typeof categories)[number];
