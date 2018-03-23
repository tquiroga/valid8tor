import _ from 'lodash';
import moment from 'moment';
import { sprintf } from 'sprintf-js';

const messages = {
  required: 'The %s field is required.',
  matches: 'The %s field does not match the %s field.',
  default: 'The %s field is still set to default, please change.',
  valid_email: 'The %s field must contain a valid email address.',
  valid_emails: 'The %s field must contain all valid email addresses.',
  min_length: 'The %s field must be at least %s characters in length.',
  max_length: 'The %s field must not exceed %s characters in length.',
  exact_length: 'The %s field must be exactly %s characters in length.',
  greater_than: 'The %s field must contain a number greater than %s.',
  less_than: 'The %s field must contain a number less than %s.',
  nullable: 'The %s field should be nullable.',
  array: 'The %s field must an array.',
  regex: 'The %s field must a regular expression pattern.',
  size: 'The size of the %s field must %s long.',
  accepted: 'The %s field must be accepted.',
  boolean: 'The %s field must be true or false (boolean only).',
  date: 'The %s field must be a date object.',
  alpha: 'The %s field must only contain alphabetical characters.',
  alpha_numeric: 'The %s field must only contain alpha-numeric characters.',
  alpha_dash: 'The %s field must only contain alpha characters, underscores, and dashes.',
  alphanum_dash: 'The %s field must only contain alpha-numeric characters, underscores, and dashes.',
  numeric: 'The %s field must contain only numbers.',
  integer: 'The %s field must contain an integer.',
  decimal: 'The %s field must contain a decimal number.',
  is_natural: 'The %s field must contain only positive numbers.',
  is_natural_no_zero: 'The %s field must contain a number greater than zero.',
  valid_ip: 'The %s field must contain a valid IP.',
  valid_ipv6: 'The %s field must contain a valid IP v6.',
  valid_base64: 'The %s field must contain a base64 string.',
  valid_credit_card: 'The %s field must contain a valid credit card number.',
  is_file_type: 'The %s field must contain only %s files.',
  valid_url: 'The %s field must contain a valid URL.',
  greater_than_date: 'The %s field must contain a more recent date than %s.',
  less_than_date: 'The %s field must contain an older date than %s.',
  greater_than_or_equal_date: 'The %s field must contain a date that\'s at least as recent as %s.',
  less_than_or_equal_date: 'The %s field must contain a date that\'s %s or older.'
};

/*
 * Define the regular expressions that will be used
*/
const regexSet = {
  ruleRegex: /^(.+?)\[(.+)\]$/,
  numericRegex: /^[0-9]+$/,
  integerRegex: /^\-?[0-9]+$/,
  decimalRegex: /^\-?[0-9]*\.+[0-9]+$/,
  emailRegex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  alphaRegex: /^[a-zA-Z]+$/i,
  alphaNumericRegex: /^[a-zA-Z0-9]+$/i,
  alphaDashRegex: /^[a-zA-Z_\-]+$/i,
  alphaNumDashRegex: /^[a-zA-Z0-9_\-]+$/i,
  naturalRegex: /^[0-9]+$/i,
  naturalNoZeroRegex: /^[1-9][0-9]*$/i,
  ipRegex: /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i,
  ipv6Regex: /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/i,
  base64Regex: /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{4})$/i,
  numericDashRegex: /^[\d\-\s]+$/,
  urlRegex: /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
  dateRegex: /\d{4}-\d{1,2}-\d{1,2}/,
};



const isMinLength = (value, minLength = 0) => (typeof value === "number" ? value >= minLength : value.length >= minLength);
const isMaxLength = (value, maxLength = 0) => (typeof value === "number" ? value <= maxLength : value.length <= maxLength);
const isEmail = value => regexSet.emailRegex.test(value) && value.length > 0;
const isUrl = value => regexSet.urlRegex.test(value) && value.length > 0;
const isAlpha = value => regexSet.alphaRegex.test(value) && value.length > 0;
const isIpAddress = value => regexSet.ipRegex.test(value) && value.length > 0;
const isIpv6Address = value => regexSet.ipv6Regex.test(value) && value.length > 0;
const isAlphaDash = value => regexSet.alphaDashRegex.test(value) && value.length > 0;
const isAlphaNumDash = value => regexSet.alphaNumDashRegex.test(value) && value.length > 0;
const isAlphaNum = value => regexSet.alphaNumericRegex.test(value) && value.length > 0;
const isInteger = value => regexSet.integerRegex.test(value);
const isDecimal = value => regexSet.decimalRegex.test(value);
const isNumeric = value => regexSet.numericRegex.test(value);
const isBase64 = value => regexSet.base64Regex.test(value);
const isArray = value => Array.isArray(value);
const isBoolean = value => (typeof value === 'boolean');
const isString = value => (typeof value === 'string');
const isDate = value => (value instanceof Date) || value instanceof moment;
const isNullable = value => !value;
const isRegex = (value, regex) => regexSet.ruleRegex.test(value);
const isSize = (value, size) => value.length === Number(size);

const isRequired = (value) => {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === "object" && value && !Array.isArray(value)) {
    return Object.keys(value).length !== 0 && value.constructor === Object;
  }

  return (
    value !== null &&
    value !== undefined &&
    value !== 0 &&
    value !== ''
  );
};

const isAccepted = value => (
  value === 1 ||
  value === true ||
  value === 'yes' ||
  value === 'on'
);

const isAfter = (value, date) => {
  // ...
};

const isBefore = (value, date) => {
  // ...
};

const isAfterOrEqual = (value, date) => {
  // ...
};

const isBeforeOrEqual = (value, date) => {
  // ...
};

const isBetween = (value, min, max) => {
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length >= min && value.length <= max;
  } else if (typeof value === 'number') {
    return value >= min && value <= max;
  }
  console.warn('The `between` rule should only be used with string, array and numbers');
  return false;
};

const isTimeZone = (value) => {
  if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
    console.error('Time zones are not available in this environment');
  }
  try {
    Intl.DateTimeFormat(undefined, { timeZone: value });
    return true;
  } catch (ex) {
    return false;
  }
};

const rulesFunctionMap = {
  required: isRequired,
  min: isMinLength,
  max: isMaxLength,
  email: isEmail,
  url: isUrl,
  alpha: isAlpha,
  alpha_dash: isAlphaDash,
  alpha_num: isAlphaNum,
  integer: isInteger,
  decimal: isDecimal,
  numeric: isNumeric,
  base64: isBase64,
  array: isArray,
  accepted: isAccepted,
  after: isAfter, //@TODO
  after_or_equal: isAfterOrEqual, //@TODO
  before: isBefore, //@TODO
  before_or_equal: isBeforeOrEqual, //@TODO
  between: isBetween,
  boolean: isBoolean,
  date: isDate,
  nullable: isNullable,
  regex: isRegex,
  string: isString,
  size: isSize,
  timezone: isTimeZone,
};

const parseRules = (rulesObject) => {
  const rules = [];
  _.forIn(rulesObject, (rulesSet, field) => {
    const parsedRules = _.chain(rulesSet.split('|')).map((rule) => {
      if (rule.indexOf(':') !== -1) {
        const ruleSplit = rule.split(':');
        return {
          name: ruleSplit[0],
          params: _.filter(ruleSplit[1].split(',')),
        };
      }
      return { name: rule };
    }).value();

    if (parsedRules.length > 0) {
      rules.push(_.set({}, field, parsedRules));
    }
  });
  return rules;
};


const isFieldValid = (field, value, rule) => {
  const rulesArray = _.get(rule, field);
  let errors = [];
  rulesArray.forEach((rule) => {
    switch(rule.name) {
      case 'required':
        if (isRequired(value) === false) {
          errors.push(sprintf(messages.required, field));
        }
        break;
      case 'min':
        if (!isMinLength(value, rule.params[0])) {
          errors.push(sprintf(messages.min_length, field, rule.params[0]));
        }
        break;
      case 'max':
        if (!isMaxLength(value, rule.params[0])) {
          errors.push(sprintf(messages.max_length, field, rule.params[0]));
        }
        break;
      case 'email':
        if (!isEmail(value)) {
          errors.push(sprintf(messages.valid_email, field));
        }
        break;
      case 'url':
        if (!isUrl(value)) {
          errors.push(sprintf(messages.valid_url, field));
        }
        break;
      case 'ip':
        if (!isIpAddress(value)) {
          errors.push(sprintf(messages.valid_ip, field));
        }
        break;
      case 'ipv6':
        if (!isIpv6Address(value)) {
          errors.push(sprintf(messages.valid_ipv6, field));
        }
        break;
      case 'alpha':
        if (!isAlpha(value)) {
          errors.push(sprintf(messages.alpha, field));
        }
        break;
      case 'alpha_dash':
        if (!isAlphaDash(value)) {
          errors.push(sprintf(messages.alpha_dash, field));
        }
        break;  
      case 'alphanum_dash':
        if (!isAlphaNumDash(value)) {
          errors.push(sprintf(messages.alphanum_dash, field));
        }
        break;
      case 'alpha_num':
        if (!isAlphaNum(value)) {
          errors.push(sprintf(messages.alpha_numeric, field));
        }
        break;
      case 'integer':
        if (!isInteger(value)) {
          errors.push(sprintf(messages.integer, field));
        }
        break;
      case 'decimal':
        if (!isDecimal(value)) {
          errors.push(sprintf(messages.decimal, field));
        }
        break;
      case 'numeric':
        if (!isNumeric(value)) {
          errors.push(sprintf(messages.numeric, field));
        }
        break;
      case 'base64':
        if (!isBase64(value)) {
          errors.push(sprintf(messages.base64, field));
        }
        break;
      case 'array':
        if (!isArray(value)) {
          errors.push(sprintf(messages.array, field));
        }
        break;
      case 'accepted':
        if (!isAccepted(value)) {
          errors.push(sprintf(messages.accepted, field));
        }
        break;
      case 'boolean':
        if (!isBoolean(value)) {
          errors.push(sprintf(messages.boolean, field));
        }
        break;
      case 'date':
        if (!isDate(value)) {
          errors.push(sprintf(messages.date, field));
        }
        break;
      case 'nullable':
        if (!isNullable(value)) {
          errors.push(sprintf(messages.date, field));
        }
        break;
      case 'size':
        if (!isSize(value, rule.params[0])) {
          errors.push(sprintf(messages.size, field));
        }
        break;
      case 'between':
        if (rule.params.length >= 2 && !isBetween(value, rule.params[0], rule.params[1])) {
          errors.push(sprintf(messages.between, field));
        }
        break;

      default:
        break;
    }
  });

  return { valid: errors.length === 0, errors: errors };
};

/**
 * Validate an object and return an array of errors or empty array if valid
 * @param {*} rulesObj The rules
 * @param {*} dataObj The object with the data to validate
 * @param {*} customValidation function
 * @return array
 */
const validateSync = (dataObj, rulesObj, customValidation = null) => {
  const rules = parseRules(rulesObj);
  const errors = [];
  Object.keys(dataObj).forEach((field) => {
    if (dataObj.hasOwnProperty(field)) {
      const value = _.get(dataObj, field);
      const fieldRule = _.find(rules, r => r.hasOwnProperty(field));
      const validation = isFieldValid(field, value, fieldRule);

      if (validation.errors.length > 0) {
        errors.push({ field, errors: validation.errors });
      }
    }
  });

  return errors;
};

/**
 * Check if an object is valid or not, testing against a rule set
 * @param {*} dataObj 
 * @param {*} rulesObj 
 * @return bool
 */
const isValid = (dataObj, rulesObj) => {
  const validation = validateSync(dataObj, rulesObj);
  return validation.length === 0;
};

/**
 * Check if an object is valid and return a promise
 * @param {*} dataObj 
 * @param {*} rulesObj 
 * @param {*} customValidation 
 * @return Promise
 */
const validate = (dataObj, rulesObj, customValidation = null) => {
  const errors = validateSync(dataObj, rulesObj, customValidation = null);
  return new Promise((resolve, reject) => {
    if (errors.length > 0) {
      reject(errors);
    } else {
      resolve();
    }
  });
}

module.exports = {
  validateSync,
  validate,
  isValid,
};