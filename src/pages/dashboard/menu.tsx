import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { MultiValue } from 'react-select/dist/declarations/src';
import { MAX_FILE_SIZE } from '~/constants/config';
import { api } from '~/utils/api';
import { selectOptions } from '~/utils/helpers';
import { Categories } from '~/utils/types';

const DynamicSelect = dynamic(() => import('react-select'), { ssr: false });

interface Input {
  name: string;
  description: string;
  price: number;
  categories: MultiValue<{ value: string; label: string }>;
  file: undefined | File;
}

const initialInput = {
  name: '',
  description: '',
  price: 0,
  categories: [],
  file: undefined,
};

const menu = () => {
  const [input, setInput] = useState<Input>(initialInput);
  const [preview, setPreview] = useState<string>('');
  const [error, setError] = useState<string>('');

  const { mutateAsync: createPresignedUrl } =
    api.admin.createPresignedUrl.useMutation();
  const { mutateAsync: addItem } = api.admin.addMenuItem.useMutation();
  const { data: menuItems, refetch } = api.menu.getMenuItems.useQuery();
  const { mutateAsync: deleteMenuItem } =
    api.admin.deleteMenuItem.useMutation();

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

  const handleImageUpload = async () => {
    const { file } = input;
    if (!file) return;

    const { url, fields, key } = await createPresignedUrl({
      fileType: file.type,
    });

    const data = {
      ...fields,
      'Content-Type': file.type,
      file,
    };

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as any);
    });

    await fetch(url, { method: 'POST', body: formData });

    return key;
  };

  const addMenuItem = async () => {
    const key = await handleImageUpload();
    if (!key) throw new Error('No Key');

    await addItem({
      name: input.name,
      description: input.description,
      categories: input.categories.map(
        (category) => category.value as Exclude<Categories, 'all'>
      ),
      price: input.price,
      imageKey: key,
    });

    refetch();

    setInput(initialInput);
    setPreview('');
  };

  const handleDelete = async (imageKey: string, id: string) => {
    await deleteMenuItem({ id, imageKey });
    refetch();
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
            name='description'
            className='h-12 rounded-sm border-none bg-gray-200'
            type='text'
            placeholder='Description'
            onChange={handleTextChange}
            value={input.description}
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
            onClick={addMenuItem}
          >
            Add menu item
          </button>
        </div>
        {error && <p className='text-red-600 text-sx'>{error}</p>}
      </div>
      <div className='mx-auto mt-12 max-w-7xl'>
        <p className='text-lg font-medium'>Your menu items:</p>
        <div className='mt-6 mb-12 grid grid-cols-4 gap-8'>
          {menuItems?.map((menuItem) => (
            <div key={menuItem.id}>
              <p>{menuItem.name}</p>
              <div className='relative h-40 w-40'>
                <Image priority fill alt='Item' src={menuItem.url} />
              </div>
              <button
                className='text-xs text-red-500'
                onClick={() => handleDelete(menuItem.imageKey, menuItem.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default menu;
