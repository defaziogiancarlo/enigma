// Gian-Carlo DeFazio February 2018

// global constants
// the standard alphabet
const alphabet    = Array.from("abcdefghijklmnopqrstuvwxyz")

// rotor configurations         abcdefghijklmnopqrstuvwxyz
const I_CODE      = Array.from("ekmflgdqvzntowyhxuspaibrcj");
const II_CODE     = Array.from("ajdksiruxblhwtmcqgznpyfvoe");
const III_CODE    = Array.from("bdfhjlcprtxvznyeiwgakmusqo");
const IV_CODE     = Array.from("esovpzjayquirhxlnftgkdcmwb");
const V_CODE      = Array.from("vzbrgityupsdnhlxawmjqofeck");
const VI_CODE     = Array.from("jpgvoumfyqbenhzrdkasxlictw");
const VII_CODE    = Array.from("nzjhgrcxmyswboufaivlpekqdt");
const VIII_CODE   = Array.from("fkqhtlxocbjspdzramewniuygv");

const I_ROTATE    = ["r"];
const II_ROTATE   = ["f"];
const III_ROTATE  = ["w"];
const IV_ROTATE   = ["k"];
const V_ROTATE    = ["a"];
const VI_ROTATE   = ["a", "n"];
const VII_ROTATE  = ["a", "n"];
const VIII_ROTATE = ["a", "n"];

// reflector configurations     abcdefghijklmnopqrstuvwxyz
const A           = Array.from("ejmzalyxvbwfcrquontspikhgd");
const B           = Array.from("yruhqsldpxngokmiebfzcwvjat");
const C           = Array.from("fvpjiaoyedrzxwgctkuqsbnmhl");
const BTHIN       = Array.from("enkqauywjicopblmdxzvfthrgs");
const CTHIN       = Array.from("rdobjntkvehmlfcwzaxgyipsuq");

const zeroTo25    = makeRangeArray(0,26);
const letterToInt = makeMappingFunction(alphabet, zeroTo25);
const intToLetter = makeMappingFunction(zeroTo25, alphabet);

// make array of integers [low,...(high-1)] or empty array if (high - 1) < low
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


// given two array of strings, representing inputs to outputs of a rotor
// converts letters to integer values, and returns a function
// that takes an input location and the rotor's current rotational position
// and outputs an output location
function makeRotorMapping(source, target) {
  var size = source.length;
  var mapping = makeMapping(source.map(letterToInt), target.map(letterToInt));
  var mapFunction = function(input) {
    // input location in absolute coordinates  = input
    // input location in relative coordinates  = (input + pos) % size
    // output location in relative coordinates = mapping[(input + pos) % size]
    // then convert relative output coordinates to absolute
    return (mapping[(input + this.pos) % size] - (this.pos % size) + size) % size;
  }
  return mapFunction;
}


// code is the mapping, the output values
function Rotor(code) {
  this.forward = makeRotorMapping(alphabet, code);
  this.reverse = makeRotorMapping(code, alphabet);
  this.pos = 0;
  this.ringSetting = 0;
//  this.rotateLetters = rotateLetters;
}

function Reflector(code) {
  this.reflect = makeMappingFunction(zeroTo25, code.map(letterToInt));
}

function Enigma(rotors, reflector) {
  this.rotors = rotors;
  this.reflector = reflector;
  this.encrypt = function(c) {
    var x = letterToInt(c);
    for (let i = 0; i < this.rotors.length; i++) {
      x = this.rotors[i].forward(x);
    }
    x = this.reflector.reflect(x);
    for (let i = this.rotors.length - 1; i > -1; i--) {
      x = this.rotors[i].reverse(x);
    }
    x = intToLetter(x);
    return x;
  }
  this.step = function() {
      //step
  }
}


var theRotors = [new Rotor(I_CODE), new Rotor(II_CODE), new Rotor(III_CODE)];
var refl = new Reflector(A);

var En = new Enigma(theRotors, refl);


document.getElementById("input-button").onclick = function() {
  var inputVal = document.getElementById("input-box").value;
  document.getElementById("output-box").value = inputVal;
}


// give each letter key a function
for (let i = 0; i < alphabet.length; i++) {
  document.getElementById(alphabet[i]).onclick = function() {
    document.getElementById(alphabet[i]).style.backgroundColor = "rgb( 200,150 ,250 )";
    console.log(alphabet[i]);
  }
}
