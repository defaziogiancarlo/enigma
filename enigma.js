// Gian-Carlo DeFazio February 2018
// enigma information at http://users.telenet.be/d.rijmenants/en/enigmatech.htm

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

const rotorPresets = [I_CODE ,II_CODE ,II_CODE ,IV_CODE ,V_CODE,
                      VI_CODE, VII_CODE, VIII_CODE];


const I_ROTATE    = ["r"];
const II_ROTATE   = ["f"];
const III_ROTATE  = ["w"];
const IV_ROTATE   = ["k"];
const V_ROTATE    = ["a"];
const VI_ROTATE   = ["a", "n"];
const VII_ROTATE  = ["a", "n"];
const VIII_ROTATE = ["a", "n"];

const rotatePresets = [I_ROTATE ,II_ROTATE ,II_ROTATE ,IV_ROTATE ,V_ROTATE,
                      VI_ROTATE, VII_ROTATE, VIII_ROTATE];

// reflector configurations     abcdefghijklmnopqrstuvwxyz
const A           = Array.from("ejmzalyxvbwfcrquontspikhgd");
const B           = Array.from("yruhqsldpxngokmiebfzcwvjat");
const C           = Array.from("fvpjiaoyedrzxwgctkuqsbnmhl");
const BTHIN       = Array.from("enkqauywjicopblmdxzvfthrgs");
const CTHIN       = Array.from("rdobjntkvehmlfcwzaxgyipsuq");

const reflectorPresets = [A, B, C, BTHIN, CTHIN];

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
function Rotor(code, rotateLetters) {
  this.forward = makeRotorMapping(alphabet, code);
  this.reverse = makeRotorMapping(code, alphabet);
  this.pos = 0;
  this.ringSetting = 0;
  this.rotatePositions = rotateLetters.map(letterToInt);
  this.ringPos = 0;
}

function Reflector(code) {
  this.reflect = makeMappingFunction(zeroTo25, code.map(letterToInt));
}

function Enigma(rotors, reflector) {
  this.rotors = rotors;
  this.reflector = reflector;
  // need to add plugboard steps too
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

  this.setRotor = function(rotorNum, rotorPos) {
    this.rotors[rotorNum].pos = rotorPos % 26;
    var theRotor = document.getElementById("rotor" + (rotorNum+1) +"-pos");
    theRotor.innerHTML = intToLetter(this.rotors[rotorNum].pos).toUpperCase();
  }

  this.incRotor = function(rotorNum) {
    this.setRotor(rotorNum, (this.rotors[rotorNum].pos + 1));
  }

  this.decRotor = function(rotorNum) {
    this.setRotor(rotorNum, (this.rotors[rotorNum].pos + 25));
  }

  // the stepping sequence is not quite like a normal odometer
  //
  this.step = function() {
    // step the 0th rotor by 1
    this.incRotor(0);
    //this.rotors[0].pos = (this.rotors[0].pos + 1) % 26;
    // stepping for middle rotor (rotors[1])
    // either rotors[0] reaches a rotate position
    // or rotors[1] is just before it's rotate position
    if (this.rotors[0].rotatePositions.includes(this.rotors[0].pos) ||
        this.rotors[1].rotatePositions.includes((this.rotors[1].pos + 1) % 26)) {
        // rotate rotor 1
        this.incRotor(1);
        //this.rotors[1].pos = (this.rotors[1].pos + 1) % 26;
        // check if this now requires a step for rotors[2]
        if (this.rotors[1].rotatePositions.includes(this.rotors[1].pos)) {
          this.incRotor(2);
          //this.rotors[2].pos = (this.rotors[2].pos + 1) % 26;
        }
    }
  }

  this.buttonPress = function(c) {
      this.step();
      return this.encrypt(c);
  }
  this.blockInput = function(text) {
      var nums = letterToInt(text);
      var output = "";
      for (let i = 0; i < text.length; i++) {
          output += this.buttonPress(text[i]);
      }
      document.getElementById("output-box").value = output;
  }
}


var theRotors = [new Rotor(III_CODE, III_ROTATE), new Rotor(II_CODE, II_ROTATE),
                new Rotor(I_CODE, I_ROTATE)];
var refl = new Reflector(B);

var En = new Enigma(theRotors, refl);
//En.rotors[1].pos = 2;


document.getElementById("input-button").onclick = function() {
  var inputVal = document.getElementById("text-input").value;
  En.blockInput(inputVal);
  //document.getElementById("output-box").value = inputVal;
}

document.getElementById("reset").onclick = function() {
  document.getElementById("output-box").value = "";
}


// give each letter key a function
for (let i = 0; i < alphabet.length; i++) {
  let element = document.getElementById(alphabet[i]);
  element.onmousedown = function() {
    element.style.backgroundColor = "rgb(200,150,250)";

  }
  element.onclick = function() {
    element.style.backgroundColor = "rgb(230,240,240)";
    document.getElementById("output-box").value += En.buttonPress(intToLetter(i));
    //console.log(alphabet[i]);
  }
  element.onmouseup = function() {
    element.style.backgroundColor = "rgb(200,150,250)";
  }

  element.onmouseout = function() {
    element.style.backgroundColor = "rgb(230,240,240)";
  }


}


// give functions to the increment, decrement buttonPress
document.getElementById("rotor1-inc").onclick = function() {
  En.incRotor(0);
}

document.getElementById("rotor2-inc").onclick = function() {
  En.incRotor(1);
}

document.getElementById("rotor3-inc").onclick = function() {
  En.incRotor(2);
}

document.getElementById("rotor1-dec").onclick = function() {
  En.decRotor(0);
}

document.getElementById("rotor2-dec").onclick = function() {
  En.decRotor(1);
}

document.getElementById("rotor3-dec").onclick = function() {
  En.decRotor(2);
}


// give functions to the rotor radio buttons
for (let rotorPosition = 0; rotorPosition < 3; rotorPosition++) {
  for (let buttonIndex = 1; buttonIndex < 9; buttonIndex++) {
    let button = document.getElementById("rot" + (rotorPosition+1) + "-" + buttonIndex);
    button.onclick = function() {
      theRotors[rotorPosition] = new Rotor(rotorPresets[buttonIndex-1],
                                          rotatePresets[buttonIndex-1]);
      let theRotor = document.getElementById("rotor" + (rotorPosition+1) + "-pos");
      theRotor.innerHTML = intToLetter(theRotors[rotorPosition].pos).toUpperCase();

    }
  }
}


// give functions to the reflector button
for (let reflectorNum = 0; reflectorNum < 3; reflectorNum++) {
  let reflector = document.getElementById("ref" + intToLetter(reflectorNum));
  reflector.onclick = function() {
    En.reflector = new Reflector(reflectorPresets[reflectorNum]);
  }
}

var theRotors = [new Rotor(I_CODE, I_ROTATE), new Rotor(II_CODE, II_ROTATE),
                new Rotor(III_CODE, III_ROTATE)];
var refl = new Reflector(A);

var En = new Enigma(theRotors, refl);
