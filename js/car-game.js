/**
 * Created by sg_2 on 21-11-2014.
 */

var gameRefreshRate = 20;
var welcomeScreen = document.getElementById('welcome-screen');
var opponentCars = [];

var trackLength = 10000;
var trackWidth = 300;
var laneWidth = 300 / 3;
var visibleTrack = 580;
var carSpeed = 5;       // the speed of road-background movement

var roadContainer = document.getElementById('main-container');
roadContainer.style.height = visibleTrack + "px";
roadContainer.style.width = trackWidth + "px";

var road = document.getElementById('road');
road.style.width = trackWidth + "px";          // width of track
road.style.height = trackLength + "px";          // length of track

// initial road-holding div's top position (i.e top of the visible segment
var trackTopPos = -(trackLength - visibleTrack);

var carWidth = 50;
var carLength = 60;
var carImages = ['car1', 'car2', 'car3'];
var explosionImages = ['explosion-top', 'explosion-bottom'];

var interCarGap = 4 * carLength;
var playerCarTailPos = 20;        // distance between the the tail position of car and the bottom of the visible track

var carPositionsX = [];
for (var i = 0, temp = laneWidth / 2 - carWidth / 2; i < trackWidth / laneWidth; i++) {
    carPositionsX.push(temp);
    temp += laneWidth;
}
var previousOpponentCarPosX = 0;

var playerCarPosY = trackLength - (carLength + playerCarTailPos);
var playerCarPosX = (trackWidth / 2) - (carWidth / 2);

var player_car = new Car();
player_car.createCar(playerCarPosX, playerCarPosY, 'playerCar1');
road.appendChild(player_car.element);

function Car() {
    this.x = 0;
    this.y = 0;
    this.element;
    var that = this;

    this.createCar = function (xCord, yCord, carImage) {

        that.element = document.createElement('div');
        that.element.className = "car";
        that.element.style.background = 'url("images/' + carImage + '.png")';
        that.element.style.width = carWidth + "px";
        that.element.style.height = carLength + "px";
        that.element.style.position = "absolute";

        that.x = xCord;
        that.y = yCord;

        that.element.style.left = that.x + "px";
        that.element.style.top = that.y + "px";

    }
}

function gameloop() {

    // make the player car stay at same position
    player_car.y -= carSpeed;   // carSpeed is the speed at which the road background moves
    player_car.element.style.top = player_car.y + "px";

//    if (counter % 5) {
    var opponent = new Car();

    // to create appropriate distance between opponent cars
    //    and to stop the creation of cars once the road ends
    if (trackTopPos % interCarGap == 0 && !(trackTopPos > -visibleTrack)) {

        yCord = Math.abs(trackTopPos) - carLength;
        var carPositonsIndex = Math.round(Math.random() * 2);

        // avoid two subsequent car being in same lane
        if (previousOpponentCarPosX == carPositonsIndex) {

            carPositonsIndex = (carPositonsIndex + 1) % carPositionsX.length;

        }

        xCord = carPositionsX[carPositonsIndex];

        opponent.createCar(xCord, yCord, carImages[Math.round(Math.random() * 2)]);
        opponentCars.push(opponent);
        road.appendChild(opponent.element);

        previousOpponentCarPosX = carPositonsIndex;

//        }

    }


    for (var i = 0; i < opponentCars.length; i++) {

        currCar = opponentCars[i];
        if (currCar != undefined) {
            // remove cars past visible track
            if (Math.abs(trackTopPos) <= (currCar.y - visibleTrack)) {
                road.removeChild(currCar.element);
                delete opponentCars[i];
            }

            // detect collison and stop the car and disable car movement(left right)
            if (currCar.x == player_car.x && (currCar.y + carLength) >= player_car.y && currCar.y <= (player_car.y + carLength)) {

                carSpeed = 0;
                currCar.element.style.background = 'url("images/' + explosionImages[0] + '.png")';
                player_car.element.style.background = 'url("images/' + explosionImages[1] + '.png")';
                document.removeEventListener("keydown", keyEventListener);

                welcomeScreen.innerHTML = "<h1>Game Over</h1>";
                welcomeScreen.style.top = (player_car.y - 300) + "px";

            }
        }
    }

    function moveOpponent() {

        trackTopPos = trackTopPos + carSpeed;
        road.style.top = trackTopPos + "px";
    }

    // move track bg resulting movement of the car till no track left to scroll(move)
    if (trackTopPos <= -carSpeed) {

        moveOpponent();

    } else {

        welcomeScreen.innerHTML = "<h1>Congratulation! you won</h1>";
        welcomeScreen.style.top = (visibleTrack - 300) + "px";
    }
//    counter += 1;
}

welcomeScreen.onclick = function () {
    setInterval(gameloop, gameRefreshRate);
    welcomeScreen.style.background = "none";
    welcomeScreen.innerHTML = "";
};

function keyEventListener(event) {

    var left = player_car.x - laneWidth;
    var right = player_car.x + laneWidth;

    if (event.keyCode == "37" && left >= (laneWidth / 2 - carWidth / 2)) {

        player_car.x = left;
        player_car.element.style.left = left + "px";

    } else if (event.keyCode == "39" && right < trackWidth - (laneWidth / 2)) {

        player_car.x = right;
        player_car.element.style.left = right + "px";

    }
}
document.addEventListener("keydown", keyEventListener);