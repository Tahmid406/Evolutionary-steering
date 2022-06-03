class Vehicle {
  constructor(position, dna) {
    this.dna;
    if (dna) this.dna = dna;
    else
      this.dna = [
        3.2471609642516506, 2.723869928893016, 96.06365643514205,
        65.11632917885916, 2.183975226904412,
      ];

    this.position = position;
    this.maxSpeed = this.dna[4];
    this.velocity = p5.Vector.random2D().mult(this.maxSpeed);
    this.accelaration = createVector(0, 0);
    this.maxForce = 0.1;
    this.health = 1;
    this.healthDecreament = map(this.maxSpeed, 2, 6, -0.001, -0.005);
    this.nutrition = 0;
    this.armLength = 6;
    this.target;
    this.repelTarget;
  }

  calcTarget(targetList, dnavalue) {
    if (!targetList.includes(this.repelTarget)) {
      let record = Infinity;
      let result = null;
      targetList.forEach((target) => {
        const d = p5.Vector.sub(target, this.position).magSq();
        if (d < pow(dnavalue, 2) && d < record) {
          record = p5.Vector.sub(target, this.position).magSq();
          result = target;
        }
      });
      return result;
    }
  }

  edges() {
    if (this.position.x > width || this.position.x < 0) this.velocity.x *= -1;
    if (this.position.y > height || this.position.y < 0) this.velocity.y *= -1;
  }

  steer(target, repel = false) {
    if (target) {
      let dir = p5.Vector.sub(target, this.position);
      dir.setMag(this.maxSpeed);
      dir.sub(this.velocity).limit(this.maxForce);
      if (repel) dir.mult(-this.dna[1]);
      else dir.mult(this.dna[0]);
      this.accelaration.add(dir);
    }
  }

  reproduce() {
    let child = new Vehicle(this.position.copy(), [
      constrain(this.dna[0] + random(-0.5, 0.5), 1, 5),
      constrain(this.dna[1] + random(-0.5, 0.5), 1, 5),
      constrain(this.dna[2] + random(-5, 5), 1, 100),
      constrain(this.dna[3] + random(-5, 5), 1, 100),
      constrain(this.dna[4] + random(-1, 1), 2, 6),
    ]);
    vehicles.push(child);
  }

  update() {
    this.edges();
    this.health += this.healthDecreament;
    if (this.health > 5) {
      this.health = 1;
      this.reproduce();
    }

    this.velocity.add(this.accelaration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.accelaration.set(0, 0);
  }

  render() {
    fill(0, 255, 0);
    push();
    translate(this.position.x, this.position.y);
    rotate(this.velocity.heading() + PI / 2);
    triangle(
      0,
      -this.armLength * 2,
      this.armLength,
      this.armLength,
      -this.armLength,
      this.armLength
    );
    pop();
    stroke(0, 0, 255);
    line(
      this.position.x - 20,
      this.position.y - this.armLength * 2,
      this.position.x + map(this.health, 0, 5, -20, 20),
      this.position.y - this.armLength * 2
    );
  }
}
