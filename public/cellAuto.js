let w = 3 // this will be used to determine width of cells, like zoom in square()
let cells = [] //set up array
let y = 0 //
let ruleValue = userRule
let ruleSet //string


function setup() {
  let canvas = createCanvas(600, 1800); //createCanvas(width, height) - p5.js function, takes and defines
  canvas.parent('canvas-container') //telling p5.js to move canvas inside <div> with is="canvas-container"

  ruleSet = ruleValue.toString(2).padStart(8, "0") // .padStart adds necessary 0's
  //.toString(2) -> converts number to a string in base 10(default) or whatever base you put as the parameter()
  //.padStart(target length, padding character)

  let total = width / w; //p5.js - "width" is built in variable set with createCanvas fun
  for (let i = 0; i < total; i++){
    //so if starting at 600 width / 5 w = 120, so loops 120 times
    cells[i] = 0 //make all cells start at 0
  }
  cells[floor(total/2)] = 1 //total/2 gives index of middle cell
  //floor() round down to mearest whole number
  background(225); //this keeps background from being erased
}

function draw() {

// --DRAW CELLS--
  for (let i = 0; i < cells.length; i++){
    let x = i * w; //calculate x cordinate for each cell (as w is like pixel zoom)
    noStroke() //no outline around cells
    //BLACK/WHITE FILL - fill(255 - cells[i] * 255); //fill color based on cell's state
    //when cell is 1 square is black, when 0     white // (because inverted)
    //CRAZY FILL
    if (cells[i] === 1) {
      fill(random(125), 125, 255); // Random color for "on" cells
    } else {
      fill(255); // White for "off" cells
    }

    square(x, y, w) // draw square at the calculated x-coordinate (y starts at 0 and increments by w -pixel size)
  }
  
  y += w //stacks next cell gen 
  
  // --CALCULATE THE STATES FOR THE NEXT ROW OF CELLS--
  let nextCells = []  //define the nextCells array
  
  let len = cells.length //find lenght of cells array
  for (let i = 0; i < cells.length; i++) {
    //find the neighbor above
    let left = cells[(i-1 + len) % len]; // len % gives you the wrap around
    let right = cells[(i+1 + len) % len];
    let state = cells[i];
    let newState = calculateState(left, state, right);
    nextCells[i] = newState; //set new state of cell in next gen
  }
  
  cells = nextCells //replaces current gen with next gen for next loop to be drawn
}


// --DEFINE RULE SYSTEM--
function calculateState(a, b, c) {  
  let neighborhood = "" + a + b + c //empty string and concat
  // SO neighbor is "" empyt string + state if cell to the left, current state and right
  // if we have "" + 1 + 0 + 1 we would get = "101"
  let value = 7 - parseInt(neighborhood, 2);
  //parseInt("num as string", radix) - parses string argument and reurns integer of specified radix 
  //radix is the mathematical base
  // parseInt RETURNS IN BASE 10, you jsut specify what base you want to start with
  //So it takes neighborhood, which is a string (like "101") and turns it into the
  //Then binary number of 101 becomes 5 in base 10 after parseInt
  //70 parseInt because we want to reverse the rule order (just how noramlly set up)
  // bin | b10 | index
  // 000 | 0   | 7
  // 001 | 1   | 6
  // 010 | 2   | 5
  // 011 | 3   | 4
  // 100 | 4   | 5 etc
  return parseInt(ruleSet[value])
  //then ruleSet is a string of an 8 digit binary number
  //so go through that binary number, find the index ascribed to particular rule
  // ex if 00011110 (30) us our rule set and "010" was our neighborhood (order 5)
  // we would have "00011110"[5] which takes the 5th indexed element (0 indexed) 
  // which is "1" (then convert to int)
}