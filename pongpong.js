	var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(callback) { window.setTimeout(callback, 1000/60) };

  var mainMusic = document.getElementById("main_music"),
      playerHitMusic = document.getElementById("playerHit"), 
      PCHitMusic = document.getElementById("PCHit");

  var files = [mainMusic, playerHitMusic, PCHitMusic];

  var score_player = 0;
	var score_computer = 0;

  var canvas = $('#mijnCanvas').get(0);	
  var width = 700;
	var height = 300;
	canvas.width = width;
	canvas.height = height;
	var context = canvas.getContext('2d');
	var player = new Player();
	var computer = new Computer();
	var ball = new Ball(350, 150,5);
  var ball2 = new Ball(300, 100,9);
  var object = new Object(250,75, 15, 80);
	var keysDown = {};

	window.onload = function() {
  	animate(step);
  	mainMusic.play();
    $("#StartStop").on("click", function(){
      StartPauze();
    });
	};

  var StartPauze = function(){
    StartStop =! StartStop;
    if (StartStop === false) {
      $("#StartStop").text("Start");
    }
    else {
      $("#StartStop").text("Pauze");
    }
  }

	var step = function() {
    if (StartStop === true) {
      update();
    };
  	render();
  	animate(step);
	};

	function Paddle(x, y, width, height) {
 	  this.x = x;
  	this.y = y;
  	this.width = width;
  	this.height = height;
  	this.x_speed = 0;
  	this.y_speed = 0;
	}

	Paddle.prototype.render = function() {
  	context.fillStyle = "red";
  	context.fillRect(this.x, this.y, this.width, this.height);
	};

	function Player() {
   	this.paddle = new Paddle(10, 125, 10, 50);
	}

	function Computer() {
  	this.paddle = new Paddle(680, 125, 10, 50);
	}

	Player.prototype.render = function() {
  	this.paddle.render();
	};

	Computer.prototype.render = function() {
  	this.paddle.render();
	};

	Computer.prototype.update = function(ball, ball2) {
    var y_pos = ball.y;
    if ((ball2.x !== 300) && (ball.x <= ball2.x)) {
    y_pos = ball2.y;
    }
    var diff = -((this.paddle.y + (this.paddle.height / 2)) - y_pos);
    if (diff < 0 && diff < -4) { //max speed left
        diff = -3;
    } else if (diff > 0 && diff > 4) { //max speed right
        diff = 3;
    }
    this.paddle.move(0, diff);
    if (this.paddle.y < 0) {
        this.paddle.y = 0;
    } else if (this.paddle.y + this.paddle.height > 300) {
        this.paddle.y = 300 - this.paddle.height;
    }
	};

	function Ball(x, y, radius) {
  	this.x = x;
  	this.y = y;
  	this.x_speed = -3;
  	this.y_speed = 0;
  	this.radius = radius;}

	Ball.prototype.render = function() {
  	context.beginPath();
  	context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
  	context.fillStyle = "yellow";
  	context.fill();
	};

	var render = function() {
	context.clearRect(0,0, width, height);
  	player.render();
  	computer.render();
  	ball.render();
    if (score_computer > 9 || score_player > 9) {
      ball2.render();
      ball.render();
    };
    if (score_computer > 24 || score_player > 24) {
      object.render();
    };
	};

	var update = function() {
	player.update();
	computer.update(ball, ball2);	
  ball.update(player.paddle, computer.paddle);
    if (score_computer > 9 || score_player > 9) {
      ball2.update(player.paddle, computer.paddle);
      computer.update(ball, ball2);
    };
	};

	Ball.prototype.update = function(paddle1, paddle2) {
  	this.x += this.x_speed;
  	this.y += this.y_speed;
  	var top_x = this.x - this.radius;
 	  var top_y = this.y - this.radius;
  	var bottom_x = this.x + this.radius;
  	var bottom_y = this.y + this.radius;

  	if(this.y - 5 < 0) { // de bovenmuur raken
    this.y = 5;
    this.y_speed = -this.y_speed;
  	}

  	else if(this.y + 5 > 300) { // de ondermuur raken
    this.y = 295;
    this.y_speed = -this.y_speed;
  	}

  	if(this.x < 0) { // Een punt gescoord voor de computer
   
    this.y_speed = 0;
    this.x_speed = -3;
    this.y = 150;
    this.x = 350;
    
    score_computer += 1;
    $(".score2").text(score_computer);
  	}
  
    if(this.x > 700) { // Een punt gescoord voor de player
    this.y_speed = 0;
    this.x_speed = -3;
    this.y = 150;
    this.x = 350;
    score_player += 1;
    $(".score1").text(score_player);
 	}

  	if(top_x < 350) {
    	if(top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
      // hit the player's paddle
    playerHitMusic.play();
    this.x_speed = 5;
    this.y_speed += (paddle1.y_speed / 2);
    this.x += this.x_speed;
    	}
  	} 
  	else {
    if(top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
      // hit the computer's paddle
      PCHitMusic.play();
      this.x_speed = -5;
      this.y_speed += (paddle2.y_speed / 2);
      this.x += this.x_speed;
    }
  }

    if (score_computer > 24 || score_player > 24) {
      if((top_x < 268 && top_x > 260) && bottom_y > 75 && top_y < 155 && this.x_speed < 0) { // de rechterkant raken van het object
      this.x_speed = 3;
      this.y_speed += (paddle1.y_speed / 2);
      this.x += this.x_speed;
      }
      if((bottom_x < 260 && bottom_x > 250) && bottom_y > 75 && top_y < 155 && this.x_speed > 0) { // de linkerkant raken van het object
      this.x_speed = -3;
      this.y_speed += -(paddle2.y_speed / 2);
      this.x += this.x_speed;
      }
      if(bottom_x > 250 && bottom_x < 265 && (top_y < 77 && top_y > 74 /*&& this.y_speed > 0*/)) { // de onderkant raken van het object
      this.y_speed = -3;
      this.x_speed += -(paddle1.x_speed / 2);
      this.y += this.y_speed;
      }
      if(bottom_x > 250 && bottom_x < 265 && (bottom_y < 157 && bottom_y > 153 /*&& this.y_speed > 0*/)) { // de bovenkant raken van het object
      this.y_speed = 3;
      this.x_speed += -(paddle1.x_speed / 2);
      this.y += this.y_speed;
      }
    };
};

	var keysDown = {};

	window.addEventListener("keydown", function(event) {
  	keysDown[event.keyCode] = true;
	});

	window.addEventListener("keyup", function(event) {
  	delete keysDown[event.keyCode];
	});

	Player.prototype.update = function() {
  	for(var key in keysDown) {
    var value = Number(key);
    if(value == 38) { // left arrow
      this.paddle.move(0, -5);
    } else if (value == 40) { // right arrow
      this.paddle.move(0, 5);
    } else {
      this.paddle.move(0, 0);
    }
  }
};

	Paddle.prototype.move = function(x, y) {
  	this.x += x;
  	this.y += y;
  	this.x_speed = x;
  	this.y_speed = y;
  	if(this.y < 0) { // all the way to the top
    this.y = 0;
    this.x_speed = 0;
  } else if (this.y + this.width > 260) { // all the way to the right
    this.y = 260 - this.width;
    this.x_speed = 0;
  }
}

$(".first").on("click",function() {
  document.body.style.backgroundImage = "url('gantz.jpg')";
});

$(".second").on("click",function() {
  document.body.style.backgroundImage = "url('latten.jpg')";
});

$(".third").on("click",function() {
  document.body.style.backgroundImage = "url('Houses.jpg')";
});

function Object(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

Object.prototype.render = function() {
  context.fillStyle = "orange";
  context.fillRect(this.x, this.y, this.width, this.height);
};

$("#Show").on("click",function() {
  $(".hide").show();
});

$("#Hide").on("click",function() {
  $(".hide").hide();
});
