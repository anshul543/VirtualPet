var Dog, SadDog, HappyDog;
var FoodObj;
var Feed, AddFood;
var database;
var FoodAmount;
var LastFedHour, LastFedMinute, LastFed;


function preload(){
  SadDog = loadImage("Images/Dog.png");
  HappyDog = loadImage("Images/HappyDog.png");
}

function setup(){
  database = firebase.database();

  createCanvas(1000, 400);

  FoodStock = database.ref('Food');
  FoodStock.on('value', readStock)
  
  Dog = createSprite(800, 200, 150, 150);
  Dog.addImage(SadDog);
  Dog.scale = 0.15;

  FoodObj = new Food();

  Feed = createButton('Feed The Dog');
  Feed.position(700, 95);
  Feed.mousePressed(FeedDog);

  AddFood = createButton('Add Food');
  AddFood.position(800, 95);
  AddFood.mousePressed(AddFoods);
}

function draw() {
  background(46, 139, 87);
  FoodObj.display();

  LastFedHour = database.ref('FedHour');
  LastFedHour.on("value", function(data) {
    LastFedHour = data.val();
  });

  LastFedMinute = database.ref('FedMinute');
  LastFedMinute.on("value", function(data) {
    LastFedMinute = data.val();
  });
 
  fill(255, 255, 254);
  textSize(15);

  if(LastFedHour >= 12 && LastFedMinute > 9) {
      text("Last Feed - "+ LastFedHour % 12 + ":" + LastFedMinute + " PM", 350, 30);
   } else if(LastFedHour == 0) {
      text("Last Feed - 12:00 AM", 350, 30);
   } else if(LastFedMinute < 10 && LastFedHour >= 12){
      text("Last Feed - " + LastFedHour % 12  + ":"  + LastFedMinute + " PM", 350, 30);
   } else if(LastFedMinute < 10 && LastFedHour < 12){
      text("Last Feed - " + LastFedHour  + ":0" + LastFedMinute + " AM", 350, 30);
   } else {
      text("Last Feed - " + LastFedHour + ":" + LastFedMinute + " AM", 350, 30);
   }
 

  drawSprites();
}

function readStock(data){
    FoodAmount = data.val();
    FoodObj.UpdateFoodStock(FoodAmount);
}

function FeedDog(){
    Dog.addImage(HappyDog);

    if(FoodObj.GetFoodStock() <= 0){
      FoodObj.UpdateFoodStock(FoodObj.GetFoodStock() * 0);
    } else {
      FoodObj.UpdateFoodStock(FoodObj.GetFoodStock() - 1);
    }

    database.ref('/').update({
      Food: FoodObj.GetFoodStock(),
      FedHour: hour(),
      FedMinute: minute()
    });
}

function AddFoods(){
  FoodAmount++;

  database.ref('/').update({
    Food: FoodAmount,
  });
}