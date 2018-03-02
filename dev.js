import { validate, isValid } from './index';

const rules = {
  firstname: 'required',
};

const data = {
  firstname: '',
};

const res = validate(data, rules);
console.log('Result from validation: ', res);
console.log('Valid? ', isValid(data, rules));
