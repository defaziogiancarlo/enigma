
// global constants

// the standard alphabet
const alphabet   = Array.from("abcdefghijklmnopqrstuvwxyz")
const alphabetS   = "abcdefghijklmnopqrstuvwxyz";
// the rotor configurations
//                             abcdefghijklmnopqrstuvwxyz
const I_CODE     = Array.from("ekmflgdqvzntowyhxuspaibrcj");
const II_CODE    = Array.from("ajdksiruxblhwtmcqgznpyfvoe");
const III_CODE   = Array.from("bdfhjlcprtxvznyeiwgakmusqo");
const IV_CODE    = Array.from("esovpzjayquirhxlnftgkdcmwb");
const V_CODE     = Array.from("vzbrgityupsdnhlxawmjqofeck");
const VI_CODE    = Array.from("jpgvoumfyqbenhzrdkasxlictw");
const VII_CODE   = Array.from("nzjhgrcxmyswboufaivlpekqdt");
const VIII_CODE  = Array.from("fkqhtlxocbjspdzramewniuygv");
const BETA_CODE  = Array.from("leyjvcnixwpbqmdrtakzgfuhos");
const GAMMA_CODE = Array.from("fsokanuerhmbtiycwlqpzxvgjd");

const letterToInt = makeMappingFunction(alphabet, makeRangeArray(0,26));
const intToLetter = makeMappingFunction(makeRangeArray(0,26), alphabet);

// make array of integers [low,...(high-1)]
// or empty array if (high - 1) < low
// does not check for values outside of integer range
function makeRangeArray(low, high) {
  if ((high - 1) < low) {
    return [];
  }
  var size = high - low;
  var rangeArray = new Array(size);
  for (let i = 0; i < size; i++) {
    rangeArray[i] = low + i;
  }
  return rangeArray;
}


// creates an object that maps corresponding elements (by index)
// of source to target
// does not not verify properties of result (injective,surjective,bijective)
function makeMapping(source, target) {
  var size = source.length;
  var mapping = {};
  for (let i = 0; i < size; i++) {
    mapping[source[i]] = target[i];
  }
  return mapping;
}

function makeMappingFunction(source, target) {
  var mapping = makeMapping(source, target);
  return function(x) {return mapping[x]};
}







// creates an object that is a mapping of strings
// to other strings
// mapping is from source to target
function makeMapping2(source, target) {
  var size = source.length;
  var mapping = {};
  for (let i = 0; i < source.length; i++) {
    mapping[source[i]] = target[i];
  }
  console.log(mapping);
  var mapFunction = function(input, pos) {
    return (mapping[(input + pos) % size] - (pos + size)) % size;
  }
  //return mapFunction;
  return mapFunction;
}

// given two array of strings, representing inputs to outputs of a rotor
// converts letters to integer values, and returns a function
// that takes an input location and the rotor's current rotational position
// and outputs an output location
function makeRotorMapping(source, target) {
  var size = source.length;
  console.log(size);
  var mapping = makeMapping(source.map(letterToInt), target.map(letterToInt));
  console.log(mapping);
  var mapFunction = function(input, pos) {
    // input location in absolute coordinates  = input
    // input location in relative coordinates  = (input + pos) % size
    // output location in relative coordinates = mapping[(input + pos) % size]
    // then convert relative output coordinates to absolute
    return (mapping[(input + pos) % size] - (pos % size) + size) % size;
  }
  return mapFunction;
}

var jj = makeRotorMapping(alphabet, I_CODE);

// function makeEncryptor(code, ref) {
//   // verify properties of the inputs
//   // should be same size and have same chracters
//
//   var fwd = makeMapping(ref, code);
// //  var rev = makeMapping(code, ref);
//   var modulus = ref.length;
// //  var





//}

// code is the mapping, the oupput values
// ref is the reference alpahbet
function Rotor(code, ref) {
  this.code = code;
  this.ref = ref;
  this.posistion = 0;
  this.forwardEncryptor = make
}







document.getElementById("input-button").onclick = function() {
  var inputVal = document.getElementById("input-box").value;
  document.getElementById("output-box").value = inputVal;
  console.log("hey");
}


// give each letter key a function
for (let i = 0; i < alphabet.length; i++) {
  document.getElementById(alphabet[i]).onclick = function() {
    document.getElementById(alphabet[i]).style.backgroundColor = "rgb( 200,150 ,250 )";
    console.log(alphabet[i]);
  }
}

// var I = {};
// for (let i = 0; i < I_CODE.length; i++) {
//   I[alphabet[i]] = I_CODE[i];
// }
// console.log(I);
