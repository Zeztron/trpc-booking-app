import Link from 'next/link';
import React from 'react';

const dashboard = () => {
  return (
    <div className='flex h-screen w-full items-center justify-center gap-8 font-medium'>
      <Link href='/dashboard/opening' className='rounded-md bg-gray-100 p-2'>
        Opening hours
      </Link>
      <Link href='/dashboard/menu' className='rounded-md bg-gray-100 p-2'>
        Menu
      </Link>
    </div>
  );
};

export default dashboard;
