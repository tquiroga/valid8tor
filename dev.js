import { validate, isValid } from './index';

const rules = {
  firstname: 'required',
};

const data = {
  firstname: 'Yo',
};

const res = validate(data, rules);

res.then(() => {
  console.log('Valid thing');
}).catch((errors) => {
  console.log('Not valid', errors);
});

// console.log('Result from validation: ', res);
// console.log('Valid? ', isValid(data, rules));

