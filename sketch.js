//bust

swrongCount = 0
savedWords = []

count = 0
before = ''
after = ['','','','']
correct = ''
flashWord = ''
score = 0
team = 0
secs = 0

r = 255
g = 255
b = 255
let rr,gg,bb
let points, times

w = 0
h = 0

numRects = 10
timeSet = 60
p1timer = timeSet;
p2timer = timeSet;
timers = [p1timer, p2timer]

prev = 0
flows = []

let re, gr, bl

function setup() {
  w = windowWidth
  h = windowHeight
  createCanvas(w, h);
  button = createButton('New Game');
  button.position(w/2-w/12, h*2/3);
  button.size(w/6, h/12)
  button.style('font-size', '2.5vw');
  
  button.mousePressed(newGame);
  button.hide()
  
  rsel = createSelect();
  rsel.size(w/15, h/20)
  rsel.style('font-size', '2vw');
  rsel.style('border-radius', '6px');
  rsel.position(w*9.1/10, h/100);
  rsel.option(5);
  rsel.option(10);
  rsel.option(15);
  rsel.selected(10);
  rsel.changed(rectEvent);
  
  tsel = createSelect();
  tsel.size(w/15, h/20)
  tsel.style('font-size', '2vw');
  tsel.style('border-radius', '6px');
  tsel.position(w*9.1/10, h/15);
  tsel.option(60);
  tsel.option(90);
  tsel.option(120);
  tsel.selected(60);
  tsel.changed(timeEvent);
  
  msel = createSelect();
  msel.size(w/7, h/11.9)
  msel.style('font-size', '3vw');
  msel.style('background-color', 'indigo');
  msel.style('color', 'white');
  msel.style('border-radius', '6px');
  msel.position(w*4.3/10, h/50);
  msel.option('Versus');
  msel.option('Timed');
  msel.selected('Versus');
  msel.changed(modeEvent);
  
  before = random(Object.keys(defs)).toUpperCase()
  correct = random(matches[before.toLowerCase()]).toUpperCase()

  savedWords.push(before)
  savedWords.push(correct)
  points = 'Points to Win'
  times = 'Time Per Player'
}

function draw() {
  background(220)
  colorMode(RGB);
  
  if (r < 255){
    r+=25
    b+=25
    rr=r
    bb=b
  }
  if (g < 255 && flashWord == '') {
    g+=25
    b+=25
    gg=g
    bb=b
  }
  else if (g < 255) {
    rr=255
    g+=15
    b+=15
  }
  else {
    flashWord = ''
  }
  
  //Top Banner
  fill('mediumpurple')
  stroke('mediumpurple')
  rect(0, 0, w, 100);
  fill('white')
  stroke('indigo')
  strokeWeight(5)
  textStyle(BOLD);
  textSize(w/22);
  text('TUG OF WORDS:', w/25, h/11);
  strokeWeight(1)
  
  textSize(w/50);
  text(points, w*0.76, h/20);
  text(times, w*0.74, h/9.8);
  
  //Word viewer
  fill(r, g, b)
  rect(w/2-h/24-h/10, h/4.4, h/12, h/12, 10);
  rect(w/2-h/24-h/5.2, h/4.4, h/12, h/12, 10);
  rect(w/2-h/24-h/3.5, h/4.4, h/12, h/12, 10);
  rect(w/2-h/24-h/2.64, h/4.4, h/12, h/12, 10);
  
  if (points != ''){ fill(rr, gg, bb) }
  else { fill('white ') }
  rect(w/2-h/24+h/10, h/4.4, h/12, h/12, 10);
  rect(w/2-h/24+h/5.2, h/4.4, h/12, h/12, 10);
  rect(w/2-h/24+h/3.5, h/4.4, h/12, h/12, 10);
  rect(w/2-h/24+h/2.64, h/4.4, h/12, h/12, 10);
  
  fill('indigo')
  textSize(w/30);
  text(before[0], w/2-h/24-h/2.7, h/3.3);
  text(before[1], w/2-h/24-h/3.7, h/3.3);
  text(before[2], w/2-h/24-h/5.5, h/3.3);
  text(before[3], w/2-h/24-h/10.8, h/3.3); 
  
  fill('mediumpurple')
  textSize(w/30);
  text(after[3], w/2-h/24+h/2.6, h/3.3);
  text(after[2], w/2-h/24+h/3.4, h/3.3);
  text(after[1], w/2-h/24+h/4.9, h/3.3);
  text(after[0], w/2-h/24+h/9.3, h/3.3); 
  
  //Definition
  fill('mediumpurple')
  textSize(w/20);
  text('→', w/2.1, h/3.3);
  fill('white')
  rect(w/3.9, h/2.7, w/2, h/7, 10);

  fill('indigo')
  textStyle(NORMAL)
  textWrap(WORD);
  textSize(w/47);
  def = defs[correct.toLowerCase()]
  text(def, w/3.7, h/2.5, w/2.1, h/7);
  
  fill(r,g,b)
  textSize(w/30);
  if (flashWord != ''){
    text(flashWord[3], w/2-h/24+h/2.6, h/3.3);
    text(flashWord[2], w/2-h/24+h/3.4, h/3.3);
    text(flashWord[1], w/2-h/24+h/4.9, h/3.3);
    text(flashWord[0], w/2-h/24+h/9.3, h/3.3);
  }
  
  strokeWeight(1)
  //Score keeper & timer
  if (points != '') {
    if (frameCount % 60 == 0 && timers[0] > 0 && timers[1] > 0) {
      timers[team%2]--;
    }
    for (let i = 0; i <= numRects; i++) {

      plift = 0
      nlift = 0
      if (i == score) {
        plift = h/25
      }
      else if (i == score*-1) {
        nlift = h/25
      }

      if (i == 0){
        fill('grey')
        stroke('black')
        rect(w/15+(15*w/35.5), h/3.8+h/3-plift, w/47, h/3.8, 5);
      }
      else {
        fill('lightgreen')
        stroke('darkgreen')
        rect(w/15+((15-i)*w/35.5), h/3.7+h/3-nlift, w/47, h/6, 10);

        fill('pink')
        stroke('crimson')
        rect(w/15+((15+i)*w/35.5), h/3.7+h/3-plift, w/47, h/6, 10);
      }
    }

    fill('lightgreen')
    stroke('darkgreen')
    rect(w/16.8, h/2.2+h/3, w/2.4, h/15, 5);
    fill('darkgreen')
    textSize(w/35)
    text('Player 1: ', w/6.5, h/1.95+h/3)
    text(timers[0], w/3.1, h/1.95+h/3)

    fill('pink')
    stroke('crimson')
    rect(w/15+w/2.19, h/2.2+h/3, w/2.4, h/15, 5);
    fill('crimson')
    textSize(w/35)
    text('Player 2: ', w/6.5+w/2.19, h/1.95+h/3)
    text(timers[1], w/3.1+w/2.19, h/1.95+h/3)
  }
  else {
    if (frameCount%60 == 0 && score != 31){
      timers[0] += 1;
    }
    textSize(w/22)
    strokeWeight(5)
    stroke('indigo')
    fill('white')
    tx = w*0.85
    ty = h/11
    if (timers[0]%60 < 10) { text(int(timers[0]/60)+':0'+timers[0]%60, tx, ty); }
    else { text(int(timers[0]/60)+':'+timers[0]%60, tx, ty); }
    
    strokeWeight(2)
    if (score < 0){
      score = 0
    }
    if (wrongCount == 0){
      wrongCount = 1
    }
    for (let i = 15; i > 15-score; i--) {
      if (i > 5){
        fill('pink')
        stroke('crimson')
        
      }
      else if (i > -5) {
        fill('peachpuff')
        stroke('darkorange')
      }
      else if (i > -15) {
        fill('lightgreen')
        stroke('darkgreen')
      }
      else {
        fill('darkgreen')
        stroke('darkgreen')
      }
      rect(w/15+((15-i)*w/35.5), h/3.6+h/3, w/47, h/4, 10);
    }
  }
  
  //Endgame
  if (points != '' && (timers[0] == 0 || timers[1] == 0 || score == numRects || score == numRects*-1)) {
    let textToAnimate, textX, textY
    textSize(w/16)
    fill('white')
    stroke('black')
    rect(w/12, h/7, w/1.2, h/1.2)
    fill('indigo')

    if (score > 0) { 
      text('Round over:', w/3, h/3)
      textToAnimate = 'Player 2 Wins!     '
      textX = 1/3.3
      textY = h/2
      stroke('crimson')
    }
    else if (score < 0) { 
      text('Round over:', w/3, h/3)
      textToAnimate = 'Player 1 Wins!     '
      textX = 1/3.3
      textY = h/2
      stroke('lime')
    }
    else { 
      text('Round over: ', w/4.7, h/2.5) 
      textToAnimate = 'It\'s a tie!     '
      textX = 2.28/4
      textY = h/2.5  
      stroke('indigo')
    }

    prev = 0
    for (let i = 0; i < textToAnimate.length; i++) {
      if (i == int(frameCount/7 % textToAnimate.length)) {
        strokeWeight(5);
      } else {
        strokeWeight(0);
      }
      text(textToAnimate[i], w*textX + prev, textY);
      prev += textWidth(textToAnimate[i])
    }
    strokeWeight(1)
    
    if (frameCount % 5 == 0) {
      let xOptions = [random(w/8, w*7/8)]
      let x=random(xOptions);     
      let y=random(h/5, h*4);
      let a = color(random(255), random(255), random(255))
      let b = color(random(255), random(255), random(255))
      flows.push([x, y, a, b])
    }
    
    for (let i = 0; i < flows.length; i++){
      x = flows[i][0]
      y = flows[i][1]
      a = flows[i][2]
      b = flows[i][3]
      
      noStroke()
      fill(a);
      ellipse(x+13,y-3,20,20)
      ellipse(x-13,y-3,20,20)
      ellipse(x-7.5,y+14,20,20)
      ellipse(x+7.5,y+14,20,20)
      ellipse(x,y-15,20,20)
      fill (b);
      ellipse(x,y+1,22,22) 
    }
    
    re = map(sin(frameCount * 0.05), -1, 1, 195, 147);
    gr = map(sin(frameCount * 0.05), -1, 1, 176, 112);
    bl = map(sin(frameCount * 0.05), -1, 1, 234, 255);
    button.style("background-color", "rgb(" + re + ", " + gr + ", " + bl + ")");
    button.show();
  }
  else if (score == 31 && points == '') {
    let textToAnimate, textX, textY
    textSize(w/16)
    fill('white')
    stroke('black')
    rect(w/12, h/7, w/1.2, h/1.2)
    fill('indigo')

    if (score > 0) { 
      text('You solved 31 words in:', w/6, h/3)
      textToAnimate = int(timers[0]/60) + ' minutes and ' + timers[0]%60 + ' seconds!     ';
      textX = 1/7
      textY = h/2
      stroke('indigo')
    }
    
    prev = 0
    for (let i = 0; i < textToAnimate.length; i++) {
      if (i == int(frameCount/7 % textToAnimate.length)) {
        strokeWeight(5);
      } else {
        strokeWeight(0);
      }
      text(textToAnimate[i], w*textX + prev, textY);
      prev += textWidth(textToAnimate[i])
    }
    strokeWeight(1)
    
    if (frameCount % 5 == 0) {
      let xOptions = [random(w/8, w*7/8)]
      let x=random(xOptions);     
      let y=random(h/5, h*4);
      let a = color(random(255), random(255), random(255))
      let b = color(random(255), random(255), random(255))
      flows.push([x, y, a, b])
    }
    
    for (let i = 0; i < flows.length; i++){
      x = flows[i][0]
      y = flows[i][1]
      a = flows[i][2]
      b = flows[i][3]
      
      noStroke()
      fill(a);
      ellipse(x+13,y-3,20,20)
      ellipse(x-13,y-3,20,20)
      ellipse(x-7.5,y+14,20,20)
      ellipse(x+7.5,y+14,20,20)
      ellipse(x,y-15,20,20)
      fill (b);
      ellipse(x,y+1,22,22) 
    }
    
    re = map(sin(frameCount * 0.05), -1, 1, 195, 147);
    gr = map(sin(frameCount * 0.05), -1, 1, 176, 112);
    bl = map(sin(frameCount * 0.05), -1, 1, 234, 255);
    button.style("background-color", "rgb(" + re + ", " + gr + ", " + bl + ")");
    button.show();
  }
}

function newGame() {
  if (points != ''){ 
    timers[0] = timeSet;
    timers[1] = timeSet;
  }
  else { timers[0] = 0; }
  
  wrongCount = 0
  
  score = 0;
  team = 0;
  button.hide();
  flows = []
  
  savedWords = []
  before = random(Object.keys(defs)).toUpperCase()
  correct = random(matches[before.toLowerCase()]).toUpperCase()
  savedWords.push(before)
  savedWords.push(correct)
  
  after = ['','','','']
  
}


const sleep = ms => new Promise(r => setTimeout(r, ms));
async function keyPressed() {
  if (timers[0] != 0 && timers[1] != 0 && score != numRects && score != numRects*-1) {
    after[count%4] = String.fromCharCode(keyCode)
    if (keyCode == 8) {
      after = ['','','','']
      count = 0
    }
    else if (keyCode == 8) {
      after = ['','','','']
      count = 0
    }
    else if (count%4 == 3) {
      arrEqual = true
      for (let c = 0; c < after.length; c++) {
        if (after[c] !== correct[c]) arrEqual = false;
      }
      
      await sleep(50);
      if (arrEqual){
        r = 0
        b = 0
        clone = ''
        for (let c = 0; c < 4; c++) { clone += after[c] }
        before = clone

        correct = random(matches[before.toLowerCase()]).toUpperCase()
        correctCount = 0
        while (savedWords.includes(correct)){
          if (correctCount == matches[before.toLowerCase()].length) {
            before = random(Object.keys(defs)).toUpperCase()
            while (savedWords.includes(before)){
              before = random(Object.keys(defs)).toUpperCase()
            }

            correct = random(matches[before.toLowerCase()]).toUpperCase()
            savedWords.push(before)
            break
          }
          else {
            correct = random(matches[before.toLowerCase()]).toUpperCase()
            correctCount += 1
          } 
        }
        savedWords.push(correct)

        if (team % 2 == 0 && points != ''){
          score -= 1
        }
        else {
          score += 1
        }
        after = ['','','','']
        count = 0
        wrongCount = 0
      }
      else {
        g = 0
        b = 0

        after = ['','','','']
        count = 0
        wrongCount += 1
        if (wrongCount == 2){
          flashWord = correct
          
          before = random(Object.keys(defs)).toUpperCase()
          while (savedWords.includes(before)){
            before = random(Object.keys(defs)).toUpperCase()
          }
          correct = random(matches[before.toLowerCase()]).toUpperCase()
          savedWords.push(before)
          savedWords.push(correct)
          
          wrongCount = 0
        }
      }
      team += 1
    } 
    else {
      count++
    }
  }
}

function rectEvent() {
  let item = rsel.value();
  numRects = item;
  newGame()
}

function timeEvent() {
  let item = tsel.value();
  timeSet = item;
  newGame()
}

function modeEvent() {
  let item = msel.value();
  if (item == 'Versus'){
    rsel.show()
    tsel.show()
    points = 'Points to Win'
    times = 'Time Per Player'
    numRects = 10
    rsel.selected(10)
    tsel.selected(60)
  }
  else {
    rsel.hide()
    tsel.hide()
    timers[0] = 0
    points = ''
    times = ''
    numRects = -100
  }
  newGame()
}