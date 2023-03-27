import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { HiArrowLeft } from 'react-icons/hi';
import { format, parseISO } from 'date-fns';
import Select from 'react-select';

interface MenuProps {
  selectedTime: string;
  addToCart: (id: string, quantity: number) => void;
}

const Menu: React.FC<MenuProps> = ({ selectedTime, addToCart }) => {
  const router = useRouter();
  const [filter, setFilter] = useState<string | undefined>(undefined);

  const menuItems = [];

  return (
    <div className='bg-white'>
      <div className='mx-auto max-w-2xl py-16 px-4 sm:py-24 lg:max-w-full'>
        <div className='flex w-full justify-between'>
          <h2 className='flex items-center gap-4 text-2xl font-bold tracking-tight text-gray-900'>
            <HiArrowLeft
              className='cursor-pointer'
              onClick={() => router.push('/')}
            />
            On our menu for {format(parseISO(selectedTime), 'MMM do yyyy')}
          </h2>
          <Select
            className='border-none outline-none'
            placeholder='Filter by...'
          />
        </div>
      </div>
    </div>
  );
};

export default Menu;
