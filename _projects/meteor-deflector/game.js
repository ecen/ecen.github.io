var stage;
var canvas;
var speedX = 200;
var speedY = 0;
var density = 1;
var moverList = [];
var tick = 0;
var currentFocus;
var mouseBall;
var energyLossFactor = 1;
var gravityAcceleration = 200;
//Mouse tracking
var mouseDown = false;
var useSemiAuto;
var town;
var townWidth = 50;
var townShield;
var gameStarted = false;
var gameOverShown = false;
var asteroidsSpawned = 0;
var sky;
var skyColors;
var shieldColors;

/**
TODO
**/

function init() {
	canvas = document.getElementById("MainCanvas");
	stage = new createjs.Stage("MainCanvas");
	stage.mouseEventsEnabled = true;
	createjs.Ticker.addEventListener("tick", update);
	createjs.Ticker.framerate = 400;
	//stage.on("stagemousedown", drawBall);
	/*document.getElementById("RadiusInput").value = radius;
	document.getElementById("SpeedInputX").value = speedX;
	document.getElementById("SpeedInputY").value = speedY;
	document.getElementById("DensityInput").value = density;*/
	resize();
	//mouseBall = new Sphere(canvas.width/2 - 30, canvas.height - 300, 0, 0, 50, 1);
	//mouseBall.add();
	stage.on("stagemousedown", function(e) {
		mouseDown = true;
	});
	stage.on("stagemouseup", function(e) {
		mouseDown = false;
	});
	stage.on("stagemousedown", function(e) {
		handleShooting(e);
	});
	sky = new Sky();
	town = new Town(townWidth);
	townShield = town.shield;
	townShield.shape.alpha = 0.5;
	skyColors = genArgbGm(0xbbeeff, 0x883333, 200);
	shieldColors = genArgbGm(0xee2233, 0x88eeff, 300);

	var startText = new createjs.Text("Start Game", "128px Courier New", "#000000");
	startText.x = canvas.width/2 - startText.getBounds().width/2;
	startText.y = canvas.height/2 - startText.getBounds().height/2 - 64;
	stage.addChild(startText);
	
	var startText2 = new createjs.Text("Click to start. Instructions below.", "32px Courier New", "#000000");
	startText2.x = canvas.width/2 - startText2.getBounds().width/2;
	startText2.y = canvas.height/2 - startText2.getBounds().height/2 + 32;
	stage.addChild(startText2);
	
	stage.on("stagemouseup", function(e) {
		gameStarted = true;
		stage.removeChild(startText);
		stage.removeChild(startText2);
	});
}

var t1 = 0;
var t2 = 0;
var t3 = 0;
var t4 = 0;
var bulletAmmo = 200;
var maxBulletAmmo = 100000;

function update(e) {
	if (true) {
		var mover;
		var i, j;
		var theta, radius, x, y, xs, xy, sphere, r, d;
		var moverRemoved = false;
		for (i = 0; i < moverList.length; i++) {
			var moverRemoved = false;
			//Collide with townshield
			if (moverList[i].isHostile == true && isColliding(moverList[i], townShield)){
				town.damage(1/2000 * moverList[i].density * moverList[i].radius * moverList[i].speed.getLength());
				moverList[i].remove();
				moverRemoved = true;
			}
			//Update regular sphere-to-sphere collision
			for (j = i; j < moverList.length; j++) {
				if (i != j) {
					collide(moverList[i], moverList[j]);
				}
			}
			//Remove balls that are too far out
			if (createjs.Ticker.getTime() > 100) {
				mover = moverList[i];
				if (mover !== mouseBall) {
					mover.speed.y += (1 / createjs.Ticker.getMeasuredFPS()) * gravityAcceleration;
					if (mover.shape.x > canvas.width + mover.radius) {
						mover.remove();
						moverRemoved = true;
					} else if (mover.shape.x < -mover.radius) {
						mover.remove();
						moverRemoved = true;
					}
					if (mover.shape.y > canvas.height - mover.radius && (mover.shape.x < canvas.width / 2 - townWidth - mover.radius * 1 || mover.shape.x > canvas.width / 2 + townWidth + mover.radius * 1)) {
						mover.speed.x = 0;
						mover.speed.y = 40;
						if (bulletAmmo < maxBulletAmmo) {
							bulletAmmo += (250 / (mover.speed.y * mover.radius)) * (createjs.Ticker.getMeasuredTickTime(1)/1000) * mover.mass / 10000;
						}
					}
					if (mover.shape.y > canvas.height + mover.radius) {
						mover.remove();
						moverRemoved = true;
					} else if (mover.shape.y < - (canvas.height * 2 - mover.radius)) {
						mover.remove();
						moverRemoved = true;
					}
				}
			}
		}
		
		if (isPaused() == false) town.regen();
		manageTurret(canvas.width / 2, canvas.height);
		document.getElementById("HealthDisplay").value = Math.round(town.health);
		document.getElementById("AsteroidsSeenDisplay").value = Math.round(asteroidsSpawned);
		sky.setColor("#" + skyColors[Math.min(skyColors.length-1, Math.max(asteroidsSpawned, 0))].toString(16));
		townShield.setColor("#" + shieldColors[Math.min(shieldColors.length-1, Math.max(Math.round(town.health), 0))].toString(16));
		
		if (town.health <= 0) {
			townShield.shape.alpha = 0;
		} else {
			townShield.shape.alpha = 0.5;
		}
		
		tick += 1;
		stage.update();
		
		if (createjs.Ticker.getTime() - t4 > 30) {
			if (bulletAmmo > maxBulletAmmo) bulletAmmo = maxBulletAmmo;
			t4 = createjs.Ticker.getTime();
			document.getElementById("AmmoDisplay").value = Math.round(bulletAmmo);
		}
		
		//Spawn asteroids
		if (isPaused() == false) {
			if (createjs.Ticker.getTime() - t1 > Math.max(1500 - asteroidsSpawned * 5, 500) && moverList.length < 100) {
				r = 20 + Math.random() * 60;
				maxD = 40; //Maximum Density
				d = 1 + Math.random() * 9 + 20 * Math.random() * Math.min(asteroidsSpawned/200, 1) + 10 * Math.min(asteroidsSpawned/200, 1);
				theta = -( (1/4 + Math.random() * 2/4) * Math.PI);
				radius = Math.hypot(canvas.width, canvas.height);
				radius = radius * 2 + Math.random() * radius * 0;
				x = Math.random() * canvas.width;
				y = -100 - r;
				xs = -(x - canvas.width / 2) / 3;
				ys = 0;
				/*x = (canvas.width / 2) + Math.cos(theta) * radius;
				y = canvas.height + (Math.sin(theta) * radius);
				xs = ((canvas.width / 2) - x) * 0.5;
				ys = 0;//((canvas.height) - y) * 1;*/
					
				if (stage.hitTest(x, y) == false && stage.hitTest(x + r, y) == false && stage.hitTest(x, y + r) == false && stage.hitTest(x - r, y) == false && stage.hitTest(x, y - r) == false) {
					t1 = createjs.Ticker.getTime();
					new Sphere(x, y, xs, ys, r, d, "#" + Math.round((0xeeeeee - ((0xcc * (d/maxD)) << 16) - ((0xcc * (d/maxD)) << 8) - ((0xcc * (d/maxD)) << 0))).toString(16), true).add();
					asteroidsSpawned += 1;
				}
			}
		}
	}
	if (isGameOver() == true) { //If game over
		if (gameOverShown == false) {
			var gameOverText = new createjs.Text("Game Over", "128px Courier New", "#000000");
			gameOverText.x = canvas.width/2 - gameOverText.getBounds().width/2;
			gameOverText.y = canvas.height/2 - gameOverText.getBounds().height/2 - 64;
			stage.addChild(gameOverText);
			
			var gameOverText2 = new createjs.Text("Refresh the page (press F5) to restart.", "32px Courier New", "#000000");
			gameOverText2.x = canvas.width/2 - gameOverText2.getBounds().width/2;
			gameOverText2.y = canvas.height/2 - gameOverText2.getBounds().height/2 + 32;
			stage.addChild(gameOverText2);
			gameOverShown = true;
		}
	}
	//console.log("FPS: " + Math.round(createjs.Ticker.getMeasuredFPS()));
}

	var turret1;
function manageTurret(x, y) {
	stage.removeChild(turret1);
	var turret = turret1;
	turret = new createjs.Shape();
	turret.graphics.setStrokeStyle(1);
	turret.graphics.beginStroke("#cc0000");
	turret.graphics.moveTo(x, y);
	turret.graphics.lineTo(2000 * (- Math.cos(getAlpha())) + canvas.width / 2, canvas.height - 2000 * (Math.sin(getAlpha())));
	turret.graphics.endStroke();
	turret.graphics.setStrokeStyle(20);
	turret.graphics.beginStroke("black");
	turret.graphics.moveTo(canvas.width/2, canvas.height);
	turret.graphics.lineTo(75 * (- Math.cos(getAlpha())) + canvas.width / 2, canvas.height - 75 * (Math.sin(getAlpha())));
	turret.graphics.beginStroke("black").setStrokeStyle(2).beginFill("#446666").drawCircle(canvas.width/2, canvas.height, 50);
	
	turret.graphics.endFill();
	turret.graphics.setStrokeStyle(1).beginStroke("#cc0000").drawCircle(stage.mouseX, stage.mouseY, 10);
	turret.graphics.setStrokeStyle(1).beginFill("#cc0000").drawCircle(stage.mouseX, stage.mouseY, 1);
	stage.addChild(turret);
	turret1 = turret;
	
	
	t3 = createjs.Ticker.getTime();
	useSemiAuto = document.getElementById("useSemiAuto").checked;
	handleShooting();
	
}

var bulletRadius;
var bulletDensity;
var bulletSpeed;
var bulletDelay;
var bulletCost;
function handleShooting(e) {
	
	//Shoot bullets
	if (keysPressed[16] === true){
		bulletSpeed = 1200;
		bulletRadius = 8;
		bulletDensity = 320;
		bulletCost = 5;
		bulletDelay = 80;
	} else if (keysPressed[17] === true) {
		bulletSpeed = 800;
		bulletRadius = 16;
		bulletDensity = 320;
		bulletCost = 40;
		bulletDelay = 160;
	} else {
		bulletSpeed = 1000;
		bulletRadius = 4;
		bulletDensity = 160;
		bulletCost = 1;
		bulletDelay = 40;
	}
	if (isPaused() == false && bulletAmmo < maxBulletAmmo) {
		bulletAmmo += 10 * (createjs.Ticker.getMeasuredTickTime(1) / 1000);
	}
	if (e == null && mouseDown && createjs.Ticker.getTime() > t2 && bulletAmmo >= bulletCost && useSemiAuto == false || e != null && createjs.Ticker.getTime() > t2 && bulletAmmo >= bulletCost && useSemiAuto == true) {
		bulletAmmo -= bulletCost;
		t2 = createjs.Ticker.getTime() + bulletDelay;
		spawnBullet(bulletSpeed, bulletRadius, bulletDensity);
	}
}

function spawnBullet(bulletSpeed, bulletRadius, bulletDensity){
	var alpha = getAlpha();
	new Sphere(80 * (- Math.cos(getAlpha())) + canvas.width / 2, canvas.height - 80 * (Math.sin(getAlpha())), -bulletSpeed * Math.cos(alpha), -bulletSpeed * Math.sin(alpha), bulletRadius, bulletDensity, "#" + (0x555555).toString(16)).add();
}

function getAlpha() {
	var b = canvas.width / 2 - stage.mouseX;
	var a = canvas.height - stage.mouseY;
	var alpha = Math.atan2(a, b);
	return alpha;
}
function isGameOver() {
	if (town.health <= 0) {
		return true;
	} else {
		return false;
	}
}

function isGameStarted() {
	if (gameStarted == true) {
		return true;
	} else {
		return false;
	}
}

function isPaused()
{
	if (isGameOver() == true || isGameStarted() == false) {
		return true;
	} else {
		return false;
	}
}

function Sky() {
	this.sky = new createjs.Shape();
	this.colorObject = this.sky.graphics.beginFill("#bbeeff").command;
	this.sky.graphics.drawRect(0, 0, canvas.width, canvas.height);
	this.sky.graphics.endFill();
	stage.addChild(this.sky);
	this.setColor = function setColor(color){
		this.colorObject.style = color;
	}
}

function Town(townWidth){
	this.maxHealth = 300;
	this.health = this.maxHealth;
	this.shield = new Sphere(canvas.width/2, canvas.height, 0, 0, townWidth*3.3);
	stage.addChild(this.shield.shape);
	
	var city = new createjs.Shape();
	city.graphics.beginStroke("black").setStrokeStyle(1).beginFill("#228822").drawRect(0, canvas.height, canvas.width, -7 * (townWidth / 100));
	city.graphics.beginStroke("black").beginFill("#bbbbcc").drawRect(canvas.width/2 - 100 * (townWidth / 100), canvas.height, 50 * (townWidth / 100), -100);
	city.graphics.beginStroke("black").beginFill("#bbccbb").drawRect(canvas.width/2 - 10 * (townWidth / 100), canvas.height, 60 * (townWidth / 100), -125);
	city.graphics.beginStroke("black").beginFill("#ddddee").drawRect(canvas.width/2 - 50 * (townWidth / 100), canvas.height, 60 * (townWidth / 100), -150);
	city.graphics.beginStroke("black").beginFill("#99aa99").drawRect(canvas.width/2 + 40 * (townWidth / 100), canvas.height, 60 * (townWidth / 100), -100);
	city.graphics.beginStroke("black").beginFill("#ddaaaa").drawRect(canvas.width/2 + 100 * (townWidth / 100), canvas.height, 100 * (townWidth / 100), -60);
	city.graphics.beginStroke("black").beginFill("#ffff99").drawRect(canvas.width/2 - 175 * (townWidth / 100), canvas.height, 100 * (townWidth / 100), -60);
	city.graphics.beginStroke("black").beginFill("#996666").drawRect(canvas.width/2 - 200 * (townWidth / 100), canvas.height, 50 * (townWidth / 100), -30);
	city.graphics.endStroke();
	stage.addChild(city);
	
	this.damage = function damage(damage) {
		this.health -= damage;
	}
	this.regen = function regen()  {
		this.health += 0.01 * createjs.Ticker.getMeasuredTickTime(1);
		if (this.health > this.maxHealth) this.health = this.maxHealth;
	}
	this.remove = function remove() {
		stage.removeChild(city);
	}
}

function getShapeSphere(x, y, r, c) {
	var ball = new createjs.Shape();
	ball.graphics.setStrokeStyle(r / 100).beginStroke("black").beginFill(c).drawCircle(0, 0, r);
	canvas = document.getElementById("MainCanvas");
	ball.x = x;
	ball.y = y;
	return ball;
}

function Vector2(xValue, yValue) {
	this.x = xValue;
	this.y = yValue;
	this.getLength = function getLength(){
		return Math.hypot(this.x, this.y);
	}
}

function Sphere(x, y, xs, ys, r, d = 1, c = "#aaaaaa", hostile="false") {
	this.shape = new createjs.Shape();
	this.colorObject = this.shape.graphics.setStrokeStyle(r / 100).beginStroke("black").beginFill(c).command;
	this.shape.graphics.drawCircle(0, 0, r);
	canvas = document.getElementById("MainCanvas");
	this.shape.x = x;
	this.shape.y = y;
	
	this.speed = new Vector2(xs, ys);
	this.radius = r;
	this.density = d;
	this.mass = Math.pow(this.radius, 3) * (4 / 3) * Math.PI * this.density;
	this.collided = false;
	this.lastBounceTick = 0;
	this.isHostile = hostile;
	this.handleTick = function handleTick(e) {
		//Set position from speed. Rounding to ignore the tiny float errors. They cause unstable behaviour.
		this.shape.x = Math.round((this.shape.x + this.speed.x * e.delta / 1000) * 1000) / 1000;
		this.shape.y = Math.round((this.shape.y + this.speed.y * e.delta / 1000) * 1000) / 1000;
		/*if (this.shape.x > canvas.width - this.radius) {
			this.speed.x = -this.speed.x * energyLossFactor;
			this.shape.x = canvas.width - this.radius;
		} else if (this.shape.x < this.radius) {
			this.speed.x = -this.speed.x * energyLossFactor;
			this.shape.x = this.radius;
		}
		if (this.shape.y > canvas.height - this.radius) {
			this.speed.y = -this.speed.y * energyLossFactor;
			this.shape.y = canvas.height - this.radius;
		} else if (this.shape.y < this.radius) {
			this.speed.y = -this.speed.y * energyLossFactor;
			this.shape.y = this.radius;
		}*/
	};
	/*Sets the speed so that this object will move to x, y in time t (seconds) */
	this.speedTo = function speedTo(x, y, t) {
		var maxSpeed = 2000; //The mostly matters for following quickly at long ranges.
		var speedFactor = 100; //When this is higher the ball will tend to follow your pointer better at short ranges.
		var cAbs = Math.min(Math.hypot(x - this.shape.x, y - this.shape.y) * speedFactor, maxSpeed);
		var theta = Math.atan2((y - this.shape.y), (x - this.shape.x));
		this.speed.x = Math.cos(theta) * cAbs;
		this.speed.y = Math.sin(theta) * cAbs;
	}
	this.add = function add() {
		stage.addChild(this.shape);
		moverList.push(this);
	}
	this.remove = function remove() {
		stage.removeChild(this.shape);
		moverList.splice(moverList.indexOf(this), 1);
	}
	this.removeSlowly = function removeSlowly(time) {
		
	}
	this.setColor = function setColor(color){
		this.colorObject.style = color;
	}
	createjs.Ticker.addEventListener("tick", this.handleTick.bind(this), false);
}

function isColliding(sphere1, sphere2){
	var x1 = sphere1.shape.x;
	var y1 = sphere1.shape.y;
	var r1 = sphere1.radius;
	var x2 = sphere2.shape.x;
	var y2 = sphere2.shape.y;
	var r2 = sphere2.radius;
	//Does "bounding box" intersect?
	if (Math.abs(x1 - x2) < r1 + r2 && Math.abs(y1 - y2) < r1 + r2){
		//Does spheres intersect?
		if (Math.hypot(x1 - x2, y1 - y2) < r1 + r2) {
			return true;
		}
	}
	return false;
}

function collide(sphere1, sphere2) {
	if (isColliding(sphere1, sphere2)){
		/*if (sphere1 === mouseBall) {
			sphere2.remove();
		} else if (sphere2 === mouseBall){
			sphere1.remove();
		}*/
		if (!(tick == sphere1.lastBounceTick + 1 && tick == sphere2.lastBounceTick + 1)) {
			bounce(sphere1, sphere2);
		}
		sphere1.lastBounceTick = tick;
		sphere2.lastBounceTick = tick;
		var moveOutVector;
		if (sphere1.mass < sphere2.mass) {
			moveOutVector = getMoveOutVector(sphere1, sphere2);
			sphere1.shape.x += moveOutVector.x;
			sphere1.shape.y += moveOutVector.y;
		} else {
			moveOutVector = getMoveOutVector(sphere2, sphere1);
			sphere2.shape.x += moveOutVector.x;
			sphere2.shape.y += moveOutVector.y;
		}
		//sphere1.shape.x += moveOutVector.x;
		//sphere1.shape.y += moveOutVector.y;
	}
	
	function rotatePoints(x, y, angle) {
		var point = {};
		point.x = x * Math.cos(angle) - y * Math.sin(angle);
		point.y = x * Math.sin(angle) + y * Math.cos(angle);
		return point;
	}

	function bounce(sphere1, sphere2) {
		var theta = Math.atan2(sphere1.shape.x - sphere2.shape.x, sphere1.shape.y - sphere2.shape.y);
		var	v1 = rotatePoints(sphere1.speed.x, sphere1.speed.y, theta);
		var	v2 = rotatePoints(sphere2.speed.x, sphere2.speed.y, theta);
		var	m1 = sphere1.mass;
		var	m2 = sphere2.mass;
		var	u1 = {};
		var	u2 = {};
		u1.x = v1.x; //((m1 - m2) / (m1 + m2)) * v1.x + ((2 * m2) / (m1 + m2)) * v2.x * 1;
		u2.x = v2.x; //((2 * m1) / (m1 + m2)) * v1.x - ((m1 - m2) / (m1 + m2)) * v2.x * 1;
		u1.y = ((m1 - m2) / (m1 + m2)) * v1.y + ((2 * m2) / (m1 + m2)) * v2.y * energyLossFactor;
		u2.y = ((2 * m1) / (m1 + m2)) * v1.y - ((m1 - m2) / (m1 + m2)) * v2.y * energyLossFactor;
		u1 = rotatePoints(u1.x, u1.y, -theta);
		u2 = rotatePoints(u2.x, u2.y, -theta);
		sphere1.speed.x = u1.x;
		sphere1.speed.y = u1.y;
		sphere2.speed.x = u2.x;
		sphere2.speed.y = u2.y;
		//console.log("Bounce, tick: " + tick);
	}
	
	/**Returns the shortest vector that will make the objects no longer collide.*/
	function getMoveOutVector(sphere1, sphere2) {
		var theta = Math.atan2(sphere1.shape.x - sphere2.shape.x, sphere1.shape.y - sphere2.shape.y);
		var k = sphere1.radius + sphere2.radius - Math.hypot(sphere1.shape.x - sphere2.shape.x, sphere1.shape.y - sphere2.shape.y),
			a = k * Math.cos(theta), //The positive solution is always the shortest
			b = a * Math.tan(theta),
			vector = {};
		vector.x = b;
		vector.y = a;
		return vector;
	}
}

function getMomentumSum() {
	var i,
		sum = 0;
	for (i = 0; i < moverList.length; i++) {
		sum += moverList[i].mass * Math.hypot(moverList[i].speed.x, moverList[i].speed.y);
	}
	return sum;
}

function getVelocityEnergySum() {
	var i,
		sum = 0;
	for (i = 0; i < moverList.length; i++) {
		sum += moverList[i].mass * Math.pow(Math.hypot(moverList[i].speed.x, moverList[i].speed.y), 2) * (1 / 2);
	}
	return sum;
}

function getRandomColor(baseColor, randomColor) {
	//Base color components
	var br = (baseColor & 0xff0000) >> 16;
	var bg = (baseColor & 0x00ff00) >> 8;
	var bb = (baseColor & 0x0000ff) >> 0;
	//Random Color components
	var rr = (randomColor & 0xff0000) >> 16;
	var rg = (randomColor & 0x00ff00) >> 8;
	var rb = (randomColor & 0x0000ff) >> 0;
	//Complete Color components
	var cr = Math.min(br + rr * Math.random(), 0xff);
	var cg = Math.min(bg + rg * Math.random(), 0xff);
	var cb = Math.min(bb + rb * Math.random(), 0xff);
	//The Final Color
	var f = (((cr << 8) | cg) << 8) | cb; //Example of how it works: (0101 | 0011) = 0111
	return f;
}

/** colorSteps Vector containing all colors you want to gradient through. Has to have atleast 2 elements.
 * steps Vector containing how many steps you want there to be in the gradient between every colorStep.
 * Has to have exactly one less element than colorsteps.
 * */
function genMultiStepGm(colorSteps, steps)
{
	var vec = [];
	for (var i = 0; i < (colorSteps.length - 1); i++ ) {
		var cv = genArgbGm(colorSteps[i], colorSteps[i + 1], steps[i]);
		for (var j = 0; j < cv.length; j++ ) {
			vec.push(cv[j]);
		}	
	}
	return vec;
}

/** Generates a vector containing numSteps many RGB colors including and between colorBegin and colorEnd.
 * colorBegin An RGB color that will be the first in the output Vector.
 * colorEnd And RGB color that will be the last in the output Vector.
 * numsteps How many steps will be taken to generate intermediate colors. This will be the length of the output Vector. 
 * */
function genArgbGm(colorBegin, colorEnd, numSteps)
{
	var r0 = (colorBegin & 0xff0000) >> 16;
	var g0 = (colorBegin & 0x00ff00) >> 8;
	var b0 = (colorBegin & 0x0000ff) >> 0;
	
	var r1 = (colorEnd & 0xff0000) >> 16;
	var g1 = (colorEnd & 0x00ff00) >> 8;
	var b1 = (colorEnd & 0x0000ff) >> 0;
	
	var value;
	var vec = [];
	
	for (var i = 0; i < numSteps; i++) {
		var r = interpolate(r0, r1, i, numSteps);
		var g = interpolate(g0, g1, i, numSteps);
		var b = interpolate(b0, b1, i, numSteps);
		value = (((r << 8) | g) << 8) | b;
		vec.push(0x000000 + value);
	}
	return vec;
}

function interpolate(pBegin, pEnd, pStep, pMax)
{
	if (pBegin < pEnd) {
		return ((pEnd - pBegin) * (pStep / pMax)) + pBegin;
	} else {
		return ((pBegin - pEnd) * (1 - (pStep / pMax))) + pEnd;
	}
}

function changeRadius(change) {
	setRadius(radius + change);
}

function setRadius(value) {
	radius = value;
	if (radius < 2) {
		radius = 2;
	} else if (radius > 300) {
		radius = 300;
	}
}

function setSpeedX(value) {
	var max = 4000;
	var min = -max;
	if (value < min) {
		value = min;
	} else if (value > max) {
		value = max;
	}
	speedX = value;
}

function setSpeedY(value) {
	var max = 4000;
	var min = -max;
	if (value < min) {
		value = min;
	} else if (value > max) {
		value = max;
	}
	speedY = value;
}

function setDensity(value) {
	var max = 1000;
	var min = 0.1;
	if (value < min) {
		value = min;
	} else if (value > max) {
		value = max;
	}
	density = value;
}

function resize() {
	document.getElementById("MainCanvas").width = window.innerWidth - 20;
	document.getElementById("MainCanvas").height = window.innerHeight - 250;
	if (town != undefined) town.remove();
	town = new Town(townWidth);
}

var doScroll = function(e) {
	// cross-browser wheel delta
	e = window.event || e;
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	var radiusF = document.getElementById("RadiusInput");
	var speedXF = document.getElementById("SpeedInputX");
	var speedYF = document.getElementById("SpeedInputY");
	var densityF = document.getElementById("DensityInput");
	if (currentFocus == radiusF) {
		scrollRadius();
	} else if (currentFocus == speedXF) {
		scrollSpeedX();
	} else if (currentFocus == speedYF) {
		scrollSpeedY();
	} else if (currentFocus == densityF) {
		scrollDensity();
	}

	function scrollRadius() {
		var valuePerScroll = 5;
		if (keysPressed[16] === true) {
			valuePerScroll = 20;
		} else if (keysPressed[17] === true) {
			valuePerScroll = 1;
		} else {
			valuePerScroll = 5;
		}
		var v = delta * valuePerScroll;
		/*if (radiusF.value == 2 && v >= 5) v = 3;
		changeRadius(v);
		radiusF.value = radius;*/
	}

	function scrollSpeedX() {
		var valuePerScroll = 5;
		if (keysPressed[16] === true) {
			valuePerScroll = 1000;
		} else if (keysPressed[17] === true) {
			valuePerScroll = 10;
		} else {
			valuePerScroll = 100;
		}
		var v = delta * valuePerScroll;
		if (speedXF.value == 2 && v >= 2) v = 3;
		setSpeedX(speedX + v);
		speedXF.value = speedX;
	}

	function scrollSpeedY() {
		var valuePerScroll = 5;
		if (keysPressed[16] === true) {
			valuePerScroll = 1000;
		} else if (keysPressed[17] === true) {
			valuePerScroll = 10;
		} else {
			valuePerScroll = 100;
		}
		var v = delta * valuePerScroll;
		if (speedYF.value == 2 && v >= 2) v = 3;
		setSpeedY(speedY + v);
		speedYF.value = speedY;
	}

	function scrollDensity() {
		var valuePerScroll = 5;
		if (keysPressed[16] === true) {
			valuePerScroll = 50;
		} else if (keysPressed[17] === true) {
			valuePerScroll = 0.1;
		} else {
			valuePerScroll = 1;
		}
		var v = delta * valuePerScroll;
		if (densityF.value == 2 && v >= 2) v = 3;
		setDensity(density + v);
		densityF.value = Math.round(density * 10) / 10;
	}
	e.preventDefault();
};

function reset() {
	stage.removeAllChildren();
	moverList = [];
}

function focusMe(caller) {
	currentFocus = caller;
}
if (window.addEventListener) {
	window.addEventListener("mousewheel", doScroll, false);
	window.addEventListener("DOMMouseScroll", doScroll, false);
} else {
	window.attachEvent("onmousewheel", doScroll);
}
var keysPressed = [];
window.addEventListener("keydown", keyDownListener, false);
//window.addEventListener("keypress", keyboardListener, false);
window.addEventListener("keyup", keyUpListener, false);

function keyDownListener(e) {
	keysPressed[e.keyCode] = true;
}

function keyUpListener(e) {
	keysPressed[e.keyCode] = false;
}