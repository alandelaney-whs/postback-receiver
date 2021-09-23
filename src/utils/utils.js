/* eslint-disable no-eq-null */
export const isNull = x => x == null;
export const isNotNull = x => x != null;
/* eslint-enable no-eq-null */

export const isError = x => Object.prototype.toString.call(x) === '[object Error]';

// throwError takes an error message string and wraps it in a function that throws
// that error when called.
export const throwError = message => () => {
    throw new Error(message);
};

// getRandomInt generates a function that returns a random number in a given range.
export const getRandomInt = (min, max) => () => (
    Math.floor(Math.random() * (max - min + 1)) + min
);
