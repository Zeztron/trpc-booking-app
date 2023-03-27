import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { MultiValue } from 'react-select/dist/declarations/src';
import { MAX_FILE_SIZE } from '~/constants/config';
import { selectOptions } from '~/utils/helpers';

const DynamicSelect = dynamic(() => import('react-select'), { ssr: false });

interface Input {
  name: string;
  price: number;
  categories: MultiValue<{ value: string; label: string }>;
  file: undefined | File;
}

const initialInput = {
  name: '',
  price: 0,
  categories: [],
  file: undefined,
};

const menu = () => {
  const [input, setInput] = useState<Input>(initialInput);
  const [preview, setPreview] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!input.file) return;
    const objectUrl = URL.createObjectURL(input.file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [input.file]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return setError('No file selected');
    if (e.target.files[0].size > MAX_FILE_SIZE)
      return setError('File size is too large');
    setInput((prev) => ({ ...prev, file: e.target.files![0] }));
  };

  return (
    <>
      <div className=''>
        <div className='mx-auto flex max-w-xl flex-col gap-2'>
          <input
            name='name'
            className='h-12 rounded-sm border-none bg-gray-200'
            type='text'
            placeholder='Name'
            onChange={handleTextChange}
            value={input.name}
          />
          <input
            name='price'
            className='h-12 rounded-sm-border-none bg-gray-200'
            type='number'
            placeholder='Price'
            onChange={(e) =>
              setInput((prev) => ({ ...prev, price: Number(e.target.value) }))
            }
            value={input.price}
          />

          <DynamicSelect
            value={input.categories}
            // @ts-expect-error
            onChange={(e) => setInput((prev) => ({ ...prev, categories: e }))}
            isMulti
            className='h-12'
            options={selectOptions}
          />

          <label
            htmlFor='file'
            className='relative h-12 cursor-pointer rounded-sm bg-gray-200 font-medium text-indigo-600 focus-within:outline-none'
          >
            <span className='sr-only'>File Input</span>
            <div className='flex h-full items-center justify-center'>
              {preview ? (
                <div className='relative h-3/4 w-full'>
                  <Image
                    alt='preview'
                    style={{ objectFit: 'contain' }}
                    fill
                    src={preview}
                  />
                </div>
              ) : (
                <span>Select image</span>
              )}
            </div>
            <input
              name='file'
              id='file'
              onChange={handleFileSelect}
              accept='image/jpeg image/png image/jgp'
              type='file'
              className='sr-only'
            />
          </label>
          <button
            className='h-12 rounded-sm bg-gray-200 disabled:cursor-not-allowed'
            disabled={!input.file || !input.name}
            onClick={() => {}}
          >
            Add menu item
          </button>
        </div>
        {error && <p className='text-red-600 text-sx'>{error}</p>}
      </div>
      <div className='mx-auto mt-12 max-w-7xl'>
        <p className='text-lg font-medium'>Your menu items:</p>
        <div className='mt-6 mb-12 grid grid-cols-4 gap-8'>
          {[].map((menuItem) => (
            <div key={menuItem}>
              <p></p>
              <div className='relative h-40 w-40'>
                <Image priority fill alt='Item' src={menuItem} />
              </div>
              <button
                className='text-xs text-red-500'
                onClick={() => {}}
              ></button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default menu;
