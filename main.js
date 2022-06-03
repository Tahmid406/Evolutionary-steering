const foodRadius = 3;
let debug = true;
let vehicles = [];

function setup() {
  createCanvas(innerWidth, innerHeight);

  foods = [];
  for (let i = 0; i < 100; i++)
    foods.push(createVector(random(width), random(height)));

  poisons = [];
  for (let i = 0; i < 50; i++)
    poisons.push(createVector(random(width), random(height)));

  for (let i = 0; i < 1; i++) {
    vehicles[i] = new Vehicle(createVector(random(width), random(height)));
    vehicles[i].calcTarget(foods);
  }

  updateData();
}

function draw() {
  background(31);

  if (random(1) < 0.15) foods.push(createVector(random(width), random(height)));
  vehicles.forEach((vehicle, i) => {
    foods.forEach((food, j) => {
      //checking if the food has been eaten
      if (food.dist(vehicle.position) < foodRadius + vehicle.armLength) {
        vehicle.health += 0.5;
        foods.splice(j, 1);
      }
    });
    poisons.forEach((poison, j) => {
      //checking if the poison has been eaten
      if (poison.dist(vehicle.position) < foodRadius + vehicle.armLength) {
        vehicle.healthDecreament = -0.01;
        poisons.splice(j, 1);
        poisons.push(createVector(random(width), random(height)));
      }
    });
    vehicle.steer(vehicle.calcTarget(foods, vehicle.dna[2]));
    vehicle.steer(vehicle.calcTarget(poisons, vehicle.dna[3]), true);
    vehicle.update();
    vehicle.render();
    //=====Debgu=====
    if (debug) {
      noFill();
      stroke(0, 255, 0, 100);
      circle(vehicle.position.x, vehicle.position.y, vehicle.dna[2] * 2);
      stroke(255, 0, 0, 100);
      circle(vehicle.position.x, vehicle.position.y, vehicle.dna[3] * 2);
    }
    //===============
    noStroke();
    if (vehicle.health < 0) {
      vehicles.splice(i, 1);
    }
  });

  fill(0, 255, 0);
  foods.forEach((food) => {
    circle(food.x, food.y, foodRadius * 2);
  });

  fill(255, 0, 0);
  poisons.forEach((poison) => {
    circle(poison.x, poison.y, foodRadius * 2);
  });
}

//Utility function
function calcNewTargets(targetList) {
  vehicles.forEach((vehicle) => {
    vehicle.calcTarget(targetList);
  });
}

const calcDNA = () => {
  return [
    random(1, 5),
    random(1, 5),
    random(0, 150),
    random(0, 150),
    random(2, 6),
  ];
};

//store data
let labels = [
  "Time",
  "Population",
  "Speed",
  "Food Sensor",
  "Steer Force",
  "Poison Sensor",
  "Repel Force",
];
let time = [];
let population = [];
let speed = [];
let foodSensor = [];
let steerForce = [];
let posionSensor = [];
let repelForce = [];

let current_Time = 0;

function updateData() {
  const totalVehicles = vehicles.length;
  time.push(current_Time);
  population.push(totalVehicles);
  current_Time += 10;

  let avg_speed = 0;
  let avg_foodSensor = 0;
  let avg_steerForce = 0;
  let avg_poisonSensor = 0;
  let avg_repelForce = 0;
  vehicles.forEach((vehicle) => {
    avg_speed += vehicle.dna[4];
    avg_foodSensor += vehicle.dna[2];
    avg_steerForce += vehicle.dna[0];
    avg_poisonSensor += vehicle.dna[3];
    avg_repelForce += vehicle.dna[1];
  });
  speed.push(avg_speed / totalVehicles);
  foodSensor.push(avg_foodSensor / totalVehicles);
  steerForce.push(avg_steerForce / totalVehicles);
  posionSensor.push(avg_poisonSensor / totalVehicles);
  repelForce.push(avg_repelForce / totalVehicles);

  setTimeout(updateData, 10000);
}

function getData() {
  console.log(time);
  console.log(population);
  console.log(speed);
  console.log(foodSensor);
  console.log(steerForce);
  console.log(posionSensor);
  console.log(repelForce);
}
