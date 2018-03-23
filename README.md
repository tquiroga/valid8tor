[![Build Status](https://travis-ci.org/tquiroga/valid8tor.svg?branch=master)](https://travis-ci.org/tquiroga/valid8tor)
# valid8tor

A dead simple JS validation library inspired by Laravel rules.

## Installation

`npm i valid8tor --save`

## Usage

Valid8tor takes an object (the data) and validate using set of rules define in object containing the same keys and validation rules. Example: 
```
import { validate, validateSync } from 'valid8tor';

// You can combine several rules
const rules = {
  firstname: 'required|alpha_dash|min:3',
  lastname: 'alpha_dash|nullable',
  email: 'required|email',
  jobs: 'array|min:1|max:5',
  website: 'required|url',
};

const data = {
  firstname: 'John',
  lastname: 'Doe',
  email: 'john@doe.io',
  jobs: ['Web Developer', 'Traveler', 'Lifehacker'],
  website: 'https://askthomas.co.uk',
};

validate(data, rules).then(() => {
  // data is valid
}).catch((errors) => {
  // not valid
  console.log(errors);
});

// Or if you want synchronous validation
validateSync(data, rules) // => Will return either [] or example: [{ field: 'firstname', error: 'The firstname field is required' }]

```

valid8tor provides 3 functions:
- `validate(dataObj, rulesObj)` Validate an object for a given set of rules and return a promise.
- `validateSync(dataObj, rulesObj)` Validate and object and return an array of error or empty array if the data is valid.
- `isValid(dataObj, rulesObj)` Validate the object and return `true` or `false` if valid or not.

### Validation rules
| Rule | Description |
|--|--|
| `required` | Make sure a value is defined. |
| `nullable` | Accept a value as null or undefined.
| `min:3` | **String** Check that string has minimum length (3 characters in this example). **Number**: Check that a number is at least equal to 3. **Array**: Check that an array has at leat 3 elements.|
| `max:10` | **String**: Check that string has a maximum length (10 characters in this example). **Number**: Check that a number is at 10 at max. **Array**: Check that an array has at max 10 elements. |
| `size:5` | **String**: Check that the length of the string is equal to 5 (in the example). **Array** Check that the size of an array is equal to 5.|
| `between:1,5` | **Number** Check that a number is in the interval (inclusive). **Array**: Check that an array has a number at least one and at max 5 elements (in this example). **String**: Check that the length of the string is in that interval |
| `email` | Check that a value is a correct email address.|
| `url` | Check that a value is a valid a URL (http or https only for now)|
| `ip` | Check that a value is a valid IP v4 address |
| `ipv6` | Check that a value is a valid IP v6 address |
| `alpha` | Check that the value only contains alphabetic characters (a to z and A to Z)|
| `alpha_dash` | Check that the value only contains alphabetic characters, hyphens and underscores (a-z, A-Z, `-` and `_` ) |
|  `alpha_num` | Check that the value only contains alphabetic characters, hyphens and underscores (a-z, A-Z and 0-9 )|
|  `alphanum_dash` | Check that the value only contains alphabetic characters, numbers, hyphens and underscores (a-z, A-Z, 0-9, `-` and `_` )|
| `integer` | Check that the value is an integer (positive, negative,  null and 0x0)|
| `decimal` | Check that the value is a decimal (positive, negative or null) |
| `numeric` | Check that the value is numeric (not null, not decimal)|
| `base64` | Check that the value is base64 format |
| `array` | Check that the value is an array (empty or not)|
| `accepted` | Check acceptance, example when you have terms and conditions, etc. This rule accept: `1`, `true`, `yes` and `on`.|
| `string` | Check that the value is a string |
| `boolean` | Check that value is a boolean |
| `date` | Check that the value is a `Date` or a `moment` instance.
| `after` | Coming soon |
| `after_or_equal` |  Coming soon |
| `before` | Coming soon |
| `before_or_equal` | Coming soon |


## Testing

Testing with [Mocha](https://mochajs.org/):
```npm run test```

## Contributions

You can use dev.js as a playground using [Parcel](https://parceljs.org/)
```parcel index.html```

**To do**

- Allow override of error messages
- Allow to pass a object containing custom validation functions
- Add Date/time related rules (after, before, etc)
- Add more tests
