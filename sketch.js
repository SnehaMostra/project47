var bg, movingBg;
var dementor, dementorImg;
var harry, harryImg;
var edges;
var gameState = "play";
var spell, spellGrp, dementorGrp, spellImage;
var candy, candyImg, candyGrp;
var horcrux, horcruxImg;
var health = 4;
var healthMeter, meterOutline;
var flag = false;

function preload(){
  
  bg = loadImage("images/bg.jpg");
  dementorImg = loadImage("images/dementor.png");
  spellImage = loadImage("images/spell.png");
  candyImg = loadImage("images/candyFrog.png");
  harryImg = loadImage("images/harry1.png");
  horcruxImg = loadImage("images/horcrux.png")

} 


function setup() { 
  createCanvas(displayWidth,displayHeight); 

  movingBg = createSprite(width/2,height/2);
  movingBg.addImage(bg);
  movingBg.scale = 3;

  meterOutline = createSprite(width-200,50,200,20);
  meterOutline.shapeColor = "white";

  healthMeter = createSprite(width-200,50,196,16);
  healthMeter.shapeColor = "green";

  horcrux = createSprite(width/2,0);
  horcrux.addImage(horcruxImg);
  horcrux.scale = 0.1;
  horcrux.visible = false;
  
  harry = createSprite(width/2,height-100, 50,50);
  harry.addImage(harryImg);
  harry.scale = 0.3;
  harry.setCollider("circle",0,0,10);
  //harry.debug = true;
  edges = createEdgeSprites();

  spellGrp=new Group();
  dementorGrp = new Group();
  candyGrp = new Group();
} 

function draw() { 
  background("White"); 
  if(gameState==="play"){
    //making of the moving background
    movingBg.scale+=0.01;
    if(movingBg.scale>4){
      movingBg.scale = 3;
    }

    spawnDementors();
    spawnCandy();

    harry.bounceOff(edges);

    //for making arry go left
    if(keyDown("left_arrow")){
      harry.x-=5;
    }


    //for making arry go right
    if(keyDown("right_arrow")){
      harry.x+=5;
    }

    //for shooting the spell
    if(keyDown("space")){
      shoot();
    }
   
    //for destroying the dementors
    if(dementorGrp.isTouching(spellGrp)){
      dementorGrp[0].destroy();
    }

    if(dementorGrp.isTouching(harry)){
      health--;
      healthMeter.width=healthMeter.width-49;
      healthMeter.x=healthMeter.x-24;
      if(health===0){
        gameState = "end";
      }
      dementorGrp[0].destroy();
      console.log(health);
    }
    if(candyGrp.isTouching(harry)){
      if(health<4){
        health++;
        healthMeter.width=healthMeter.width+49;
        healthMeter.x=healthMeter.x+24;
        candyGrp[0].destroy();
      }
     
    }
    if(frameCount===1000){
      gameState = "win";
    }

    drawSprites(); 
  }
    else if(gameState==="end"){
      text(" Better luck next time Harry ", width/2, height/2);
    }

    else if(gameState==="win"){
      dementorGrp.destroyEach();
      if(flag===false){
        horcrux.visible = true;
        horcrux.attractionPoint (30,harry.x, harry.y );
        flag = true;
      }
      if(horcrux.isTouching(harry)){
        horcrux.setVelocity(0,0);
      }
      //horcrux.collide(harry);
      drawSprites();

    }
}
function spawnDementors(){
  if(frameCount%60===0){
    var y=-150;
    var x=Math.round(random(0,width));
    dementor = createSprite(x,y);
    dementor.addImage(dementorImg);
    dementor.scale = 0.2;
    //dementor.velocityX = 0.005;
    dementor.attractionPoint (5,harry.x, harry.y );
    //dementor.setCollider("circle",0,0,10);
    //dementor.debug = true;
    //var direction = (180*Math.atan2(200,200))/Math.PI;
    //dementor.setSpeedAndDirection(10,direction); 
    dementor.lifetime = 500;
    dementorGrp.add(dementor);
  }
}

function shoot(){
  spell = createSprite(harry.x, harry.y, 5,5);
  spell.shapeColor= "blue";
  spell.velocityY = -8;
  spell.addImage("spell",spellImage);
  spell.scale = 0.3;
  spellGrp.add(spell);
  spell.attractionPoint (30, mouseX, mouseY );
}

function spawnCandy(){
  if(frameCount%200===0){
    var y=-50;
    var x=Math.round(random(0,width));
    candy = createSprite(x,y);
    candy.addImage(candyImg);
    candy.scale = 0.1;
    candy.velocityY = 3;
    candy.setCollider("circle",0,0,500);
    //candy.debug = true;
    candy.lifetime = 500;
    candyGrp.add(candy);
  }
}

