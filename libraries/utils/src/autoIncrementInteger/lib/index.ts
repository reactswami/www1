/**
 * Increases an integer by one each time it is called
 * starting from 0
 */
export const autoincrementInteger = (function() {
   let counter = 0;
   return function() { counter++; return counter; };
})();