import React from 'https://esm.sh/react';
import { eight } from '../modules-b/modules-b-1/eight.js';

const one = () => {
  console.log('Module - one');
  console.log('React: ', React);
};

const two = () => {
  console.log('Module - two');
  eight();
};

const three = () => {
  console.log('Module - three');
};

export { one, three, two };
