import moment from 'moment';
import { validate, isValid } from '../index';
var assert = require('assert');

// 1. Basic validation
describe('Basic validation', function () {
  let data, rules;
  describe('# required', function () {
    beforeEach('Make the data and rules', function () {
      data = {
        cat: 'Nacho',
      };
      rules = {
        cat: 'required',
      };
    });

    // Required string
    it('validates a normal string', function () {
      assert.equal(isValid(data, rules), true);
    });

    it('does not validate an empty string', function () {
      assert.equal(isValid({ cat: '' }, rules), false);
    });

    // Required number
    it('validates a number that is not null', function () {
      assert.equal(isValid({ cat: 2 }, rules), true);
    });

    it('does not valid a null Number', function () {
      assert.equal(isValid({ cat: 0 }, rules), false);
    });

    // Required defined
    it('validates any defined value', function () {
      assert.equal(isValid({ cat: 'any' }, rules), true);
    });

    it('does not work if value is undefined', function () {
      assert.equal(isValid({ cat: undefined }, rules), false);
    });

    // Required object
    it('validates an object that is not empty', function () {
      assert.equal(isValid({ cat: { name: 'Nacho' } }, rules), true);
    });

    it('does not work with an empty object (no keys)', function () {
      assert.equal(isValid({ cat: {} }, rules), false);
    });

    // Required array
    it('validates an array containing at least 1 entry', function () {
      assert.equal(isValid({ cat: ['Nacho'] }, rules), true);
    });

    it('does not work for an empty array ', function () {
      assert.equal(isValid({ cat: [] }, rules), false);
    });
  });

  describe('# min', function () {
    beforeEach('Make the data and rules', function () {
      data = {
        cat: 'Nacho',
      };
      rules = {
        cat: 'min:3',
      };
    });

    it('validates a string of 5 chars. when min is 3', function () {
      assert.equal(isValid(data, rules), true);
    });

    it('does not validate a string of 2 chars if min is 3', function () {
      assert.equal(isValid({ cat: 'Yu' }, rules), false);
    });

    it('validates the number 4 if min is 3', function () {
      assert.equal(isValid({ cat: 4 }, rules), true);
    });

    it('does not validate number 2 if min is 3', function () {
      assert.equal(isValid({ cat: 2 }, rules), false);
    });

    it('validates an Array with 3 elements if min is 3', function () {
      assert.equal(isValid({ cat: [1, 2, 3] }, rules), true);
    });

    it('does not validate an Array with 2 elements if min is 3', function () {
      assert.equal(isValid({ cat: [1,2] }, rules), false);
    });
  });

  describe('# max', function () {
    beforeEach('Make the data and rules', function () {
      data = {
        cat: 'Mya',
      };
      rules = {
        cat: 'max:3',
      };
    });

    it('validates a string of 3 chars. if max is 3', function () {
      assert.equal(isValid(data, rules), true);
    });

    it('does not validate a string of 5 chars. if max is 3', function () {
      assert.equal(isValid({ cat: 'Nacho' }, rules), false);
    });

    it('validates the number 3 if max is 3', function () {
      assert.equal(isValid({ cat: 3 }, rules), true);
    });

    it('does not validate the number 4, if max is 3', function () {
      assert.equal(isValid({ cat: 4 }, rules), false);
    });

    it('validates an Array with 3 elements if max: 3', function () {
      assert.equal(isValid({ cat: [1, 2, 3] }, rules), true);
    });

    it('does not validate an Array with 4 elements if max is 3', function () {
      assert.equal(isValid({ cat: [1, 2, 3, 4] }, rules), false);
    });
  });

});

// 2. Format validation
describe('Format validation', function () {
  let data, rules;
  describe('# email', function () {
    beforeEach('Make the data and rules', function () {
      data = { email: 'thomas@nyan.com' };
      rules = { email: 'email' };
    });

    it('works with a valid email address', function () {
      assert.equal(isValid(data, rules), true);
    });

    it('does not valid an empty string', function () {
      assert.equal(isValid({ email: '' }, rules), false);
    });

    it('does not work with badly formatted email address', function () {
      assert.equal(isValid({ email: 'thomas#nyan.com' }, rules), false);
    });

    it('works with an email address without TLD e.g: user@localhost', function () {
      assert.equal(isValid({ email: 'thomas@localhost' }, rules), true);
    });
  });

  describe('# url', function () {
    beforeEach('Make the data and rules', function () {
      data = { link: 'http://www.nyan.cat/' };
      rules = { link: 'url' };
    });

    it('works with a normal URL using http', function () {
      assert.equal(isValid(data, rules), true);
    });

    it('works with a URL using https', function () {
      assert.equal(isValid({ link: 'https://nyan.com/lolcats' }, rules), true);
    });

    it('works with a URL using different port', function () {
      assert.equal(isValid({ link: 'http://localhost:3000' }, rules), true);
    });

    it('does not valid an empty URL', function () {
      assert.equal(isValid({ link: '' }, rules), false);
    });

    it('does not work with domain only e.g nyan.cat', function () {
      assert.equal(isValid({ link: 'nyan.cat' }, rules), false);
    });

    it('does not work with just a hostname: localhost', function () {
      assert.equal(isValid({ link: 'localhost' }, rules), false);
    });
  });

  describe('# ip', function () {
    beforeEach(function () {
      data = { address: '192.168.0.1' };
      rules = { address: 'ip' };
    });

    it('works with a normal IP v4 address', function () {
      assert.equal(isValid(data, rules), true);
    });

    it('works with a network mask', function () {
      assert.equal(isValid({ address: '255.255.255.0' }, rules), true);
    });

    it('does not work with IP v6', function () {
      assert.equal(isValid({ address: '2a02:c7f:282b:b500:a4a2:411d:68d1:b46a' }, rules), false);
    });

    it('does not valid an empty string', function () {
      assert.equal(isValid({ address: '' }, rules), false);
    });

    it('does not validate an address with placeholder x.x', function () {
      assert.equal(isValid({ address: '192.168.1.x' }, rules), false);
    });
  });

  describe('# ipv6', function () {
    beforeEach(function () {
      data = { address: '2a02:c7f:282b:b500:a4a2:411d:68d1:b46a' };
      rules = { address: 'ipv6' };
    });

    it('works with a normal IP v6 address', function () {
      assert.equal(isValid(data, rules), true);
    });

    it('does not work with IP v4', function () {
      assert.equal(isValid({ address: '192.168.1.2' }, rules), false);
    });

    it('does not valid an empty string', function () {
      assert.equal(isValid({ address: '' }, rules), false);
    });
  });

  describe('# accepted', function () {
    beforeEach(function () {
      data = { terms: 'yes' };
      rules = { terms: 'accepted' };
    });

    it('works with a "yes"', function () {
      assert.equal(isValid(data, rules), true);
    });

    it('works with a "on"', function () {
      assert.equal(isValid(data, rules), true);
    });

    it('works with boolean true', function () {
      assert.equal(isValid({ terms: true }, rules), true);
    });

    it('works with number 1', function () {
      assert.equal(isValid({ terms: 1 }, rules), true);
    });

    it('does not work with anything else e.g: √', function () {
      assert.equal(isValid({ terms: '√' }, rules), false);
    });
  });

  describe('# size', function () {
    beforeEach(function () {
      data = { cat: ['Nacho', 'Rolo'] };
      rules = { cat: 'size:2' };
    });

    it('validates with an array of 2 element for size=2', function () {
      assert.equal(isValid(data, rules), true);
    });

    it('validates with a string of more than 2 characters for size=2', function () {
      assert.equal(isValid({ cat: 'Yo' }, rules), true);
    });

    it('does not validate with empty array', function () {
      assert.equal(isValid({ cat: [] }, rules), false);
    });

    it('does not validates with empty string', function () {
      assert.equal(isValid({ cat: '' }, rules), false);
    });
  });
});

// 3. Type validation
describe('Type validation', function () {
  let data, rules;
  describe('# alpha', function () {
    beforeEach(function () {
      data = { cat: 'nyan' };
      rules = { cat: 'alpha' };
    });

    it('validates a normal lower case string', function () {
      assert.equal(isValid(data, rules), true);
    });

    it('validates a string with upper cases', function () {
      assert.equal(isValid({ cat: 'Nyan' }, rules), true);
    });

    it('does not validate a string with number', function () {
      assert.equal(isValid({ cat: 'nyan33' }, rules), false);
    });

    it('does not validate a string containing a symbol #1 @', function () {
      assert.equal(isValid({ cat: 'Ny@n' }, rules), false);
    });

    it('does not validate a string containing a symbol #2 _', function () {
      assert.equal(isValid({ cat: 'Ny_n' }, rules), false);
    });

    it('does not validate a string containing a symbol #3 $', function () {
      assert.equal(isValid({ cat: 'Ny$n' }, rules), false);
    });
  });

  describe('# alpha_dash', function () {
    beforeEach(function () {
      data = { twitter: 'Nyan_Cat' };
      rules = { twitter: 'alpha_dash' };
    });

    it('validates a lower case string and underscore', function () {
      assert.equal(isValid({ twitter: 'nyan_cat' }, rules), true);
    });

    it('validates a lower case string and dash', function () {
      assert.equal(isValid({ twitter: 'nyan-cat' }, rules), true);
    });

    it('validates a string with upper cases and underscore', function () {
      assert.equal(isValid(data, rules), true);
    });

    it('validates a uppler/lower and underscore and dash', function () {
      assert.equal(isValid({ twitter: 'ny_An-Cat' }, rules), true);
    });

    it('does not validate if string start with dash or underscore', function () {
      assert.equal(isValid({ twitter: '-nyan33' }, rules), false);
    });

    it('does not validate if string ends with dash or underscore', function () {
      assert.equal(isValid({ twitter: 'nyan33_' }, rules), false);
    });

    it('does not validate a string with number', function () {
      assert.equal(isValid({ twitter: 'nyan33' }, rules), false);
    });

    it('does not validate a string containing a symbol #@+!£$%^&* please dont be vulgar!', function () {
      assert.equal(isValid({ twitter: 'Ny@n' }, rules), false);
    });
  });

  describe('# alphanum_dash', function () {
    beforeEach(function () {
      data = { twitter: 'Ny4n_Cat777' };
      rules = { twitter: 'alphanum_dash' };
    });

    it('validates a string with upper/lower cases, underscore and numbers', function () {
      assert.equal(isValid(data, rules), true);
    });

    it('validates a string without numbers too', function () {
      assert.equal(isValid({ twitter: 'Ny4nC4t'}, rules), true);
    });

    it('will not validate a string containing a symbol other than _ and -', function () {
      assert.equal(isValid({ twitter: 'Ny4n$C4t' }, rules), false);
    });
  });

  describe('# alpha_num', function () {
    beforeEach(function () {
      data = { twitter: 'hello1234' };
      rules = { twitter: 'alpha_num' };
    });

    it('validates a normal lower case string and numbers', function () {
      assert.equal(isValid(data, rules), true);
    });

    it('validates a string with upper cases and numbers', function () {
      assert.equal(isValid({ twitter: '12Hello12' }, rules), true);
    });

    it('does not validate a string with any symbol', function () {
      assert.equal(isValid({ twitter: 'ny@%n' }, rules), false);
    });

    it('does not validate a string containing any dashes _ -', function () {
      assert.equal(isValid({ twitter: 'Ny_an' }, rules), false);
    });
  });

  describe('# integer', function () {
    beforeEach(function () {
      data = { amount: '123' };
      rules = { amount: 'integer' };
    });

    it('validates an integer', function () {
      assert.equal(isValid(data, rules), true);
    });

    it('validates a big integer', function () {
      assert.equal(isValid({ amount: 12345678901223443 }, rules), true);
    });

    it('validates negative integer', function () {
      assert.equal(isValid({ amount: -2823 }, rules), true);
    });

    it('validates null number 0 or 0x0', function () {
      assert.equal(isValid({ amount: 0 }, rules), true);
    });

    it('validates a number with zero X notation e.g: 0x400', function () {
      assert.equal(isValid({ amount: 0x342314 }, rules), true);
    });

    it('does not validate a decimal', function () {
      assert.equal(isValid({ amount: 12.34 }, rules), false);
    });
  });

  describe('# numeric', function () {
    beforeEach(function () {
      data = { amount: '123' };
      rules = { amount: 'numeric' };
    });

    it('validates an positive number not decimal', function () {
      assert.equal(isValid(data, rules), true);
    });

    it('validates a big number', function () {
      assert.equal(isValid({ amount: 12345678901223443 }, rules), true);
    });

    it('validates null number 0 or 0x0', function () {
      assert.equal(isValid({ amount: 0 }, rules), true);
    });

    it('validates a number with zero X notation e.g: 0x400', function () {
      assert.equal(isValid({ amount: 0x342314 }, rules), true);
    });

    it('does not validate negative number', function () {
      assert.equal(isValid({ amount: -2823 }, rules), false);
    });

    it('does not validate a decimal', function () {
      assert.equal(isValid({ amount: 12.34 }, rules), false);
    });
  });

  describe('# decimal', function () {
    beforeEach(function () {
      data = { amount: '123.45' };
      rules = { amount: 'decimal' };
    });

    it('validates a decimal', function () {
      assert.equal(isValid(data, rules), true);
    });

    it('validates a decimal with high precision', function () {
      assert.equal(isValid({ amount: 3.15345678923401223443 }, rules), true);
    });

    it('validates negative decimal', function () {
      assert.equal(isValid({ amount: -2823.2424 }, rules), true);
    });

    it('does not validate an integer', function () {
      assert.equal(isValid({ amount: 342 }, rules), false);
    });

    it('does not validate a 0x number', function () {
      assert.equal(isValid({ amount: 0x263e29037238923 }, rules), false);
    });
  });

  describe('# base64', function () {
    beforeEach(function () {
      data = { data: 'TnlhbiBueWFuISE=' };
      rules = { data: 'base64' };
    });

    it('validates base64 data', function () {
      assert.equal(isValid(data, rules), true);
    });
  });

  describe('# array', function () {
    beforeEach(function () {
      data = { items: [] };
      rules = { items: 'array' };
    });

    it('validates an array', function () {
      assert.equal(isValid({ items: ['hello'] }, rules), true);
    });

    it('validates an empty array (use it with required if needed)', function () {
      assert.equal(isValid(data, rules), true);
    });

    it('does not validate if null.', function () {
      assert.equal(isValid({ items: null }, rules), false);
    });

    it('does not validate if it is an object.', function () {
      assert.equal(isValid({ items: {} }, rules), false);
    });
  });

  describe('# boolean', function () {
    beforeEach(function () {
      data = { corrected: true };
      rules = { corrected: 'boolean' };
    });

    it('validates with a boolean true', function () {
      assert.equal(isValid(data, rules), true);
    });

    it('validates with a boolean false', function () {
      assert.equal(isValid({ corrected: false }, rules), true);
    });

    it('does not validate with number 1 or 0', function () {
      assert.equal(isValid({ corrected: 0 }, rules), false);
    });

    it('does not validate with char "y"', function () {
      assert.equal(isValid({ corrected: 'y' }, rules), false);
    });

    it('does not validate with null or undefined', function () {
      assert.equal(isValid({ corrected: null }, rules), false);
    });
  });

  describe('# date', function () {
    beforeEach(function () {
      data = { departure: new Date() };
      rules = { departure: 'date' };
    });

    it('validates with a Date object', function () {
      assert.equal(isValid(data, rules), true);
    });

    it('validates with a moment() instance', function () {
      assert.equal(isValid({ departure: moment() }, rules), true);
    });

    it('does not validate with a string as date', function () {
      assert.equal(isValid({ departure: '2018-01-02' }, rules), false);
    });

    it('does not validate with null or undefined', function () {
      assert.equal(isValid({ departure: null }, rules), false);
    });
  });
  
  describe('# nullable', function () {
    beforeEach(function () {
      data = { tvOnboard: null };
      rules = { tvOnboard: 'nullable' };
    });

    it('validates with null', function () {
      assert.equal(isValid(data, rules), true);
    });

    it('validates with undefined', function () {
      assert.equal(isValid({ tvOnboard: undefined }, rules), true);
    });

    it('validates with 0', function () {
      assert.equal(isValid({ tvOnboard: 0 }, rules), true);
    });

    it('validates with empty string', function () {
      assert.equal(isValid({ tvOnboard: '' }, rules), true);
    });

    it('does not validate with a empty array', function () {
      assert.equal(isValid({ tvOnboard: [] }, rules), false);
    });

    it('does not validate with a empty object', function () {
      assert.equal(isValid({ tvOnboard: {} }, rules), false);
    });
  });
  
  describe('# between', function () {
    beforeEach(function () {
      data = { amount: 2 };
      rules = { amount: 'between:1,5' };
    });

    it('validates with a number within range', function () {
      assert.equal(isValid(data, rules), true);
    });

    it('validates with a number within range (test inclusion min)', function () {
      assert.equal(isValid({ amount: 1 }, rules), true);
    });

    it('validates with a number within range (test inclusion max)', function () {
      assert.equal(isValid({ amount: 5 }, rules), true);
    });

    it('does not validates with a number outside the range', function () {
      assert.equal(isValid({ amount: 12 }, rules), false);
    });

    it('validates with an array of 3 elements with interval 1-5', function () {
      assert.equal(isValid({ amount: [2, 3, 3]}, rules), true);
    });

    it('does not validate an empty array if range 1-5', function () {
      assert.equal(isValid({ amount: [] }, rules), false);
    });

    it('does validate an empty array if range 0-5', function () {
      assert.equal(isValid({ amount: [] }, rules), false);
    });

    it('validates with a string of 4 characters with interval 1-5', function () {
      assert.equal(isValid({ amount: 'Test' }, rules), true);
    });

    it('does not validate a string of 10 characters with interval 1-5', function () {
      assert.equal(isValid({ amount: 'Testing that' }, rules), false);
    });
  });

});