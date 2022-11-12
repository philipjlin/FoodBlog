/*
 * Case module provides methods for standardizing strings to make search queries more consistent
 *
 */

//Required packages
let path = require('path');
const appVars = require(path.join(__dirname, "app.js"));  //Required local module


//Module exports used in other files
module.exports.standardFormat = standardFormat;


/*
 * Standard format takes a string, replaces dashes with spaces, and capitalizes first letter of each word
 */
function standardFormat( title ){

  //Replaces all "-" and "_" with space
  title = title.toLowerCase().replace(/-|_/g, " ");

  const arr = title.split(" ");

  for (var i = 0; i < arr.length; i++) {

      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
  }

  return arr.join(" ");
}
