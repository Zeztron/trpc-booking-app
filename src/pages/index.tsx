'use client';

import { type NextPage } from 'next';
import { useState } from 'react';
import Head from 'next/head';
import { Calendar } from '~/components';
import { DateObject } from '~/utils/types';

const Home: NextPage = () => {
  const [date, setDate] = useState<DateObject>({
    justDate: null,
    dateTime: null,
  });

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name='description' content='Generated by create-t3-app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main>
        <Calendar setDate={setDate} date={date} />
      </main>
    </>
  );
};

export default Home;
