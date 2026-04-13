import React from 'react';
const students = [
  {
    email: 'hello@email.com',
  },
  {
    email: 'hello1@email.com',
  },
  {
    email: 'hello2@email.com',
  },
  {
    email: 'hello3@email.com',
  },
];

const output = students.map(student => student.email);

console.log(output);
