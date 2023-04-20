import React from 'https://esm.sh/react';

const one = () => {
  console.log('Module - one');
  console.log('React: ', React);
};

const two = () => {
  console.log('Module - two');
};

const three = () => {
  console.log('Module - three');
};

export { one, three, two };
