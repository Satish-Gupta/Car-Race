/**
 * Created by sg_2 on 21-11-2014.
 */

var gameRefreshRate = 20;
var opponentCars = [];

var trackLength = 10000;
var trackWidth = 300;
var visibleTrack = 580;
var carSpeed = 5;       // the speed of road-background movement

var roadContainer = document.getElementById('main-container');
roadContainer.style.height = visibleTrack + "px";
roadContainer.style.width = trackWidth + "px";

var road = document.getElementById('road-wrapper');
road.style.width = trackWidth + "px";          // width of track
road.style.height = trackLength + "px";          // length of track

// initial road-holding div's top position (i.e top of the visible segment
var trackTopPos = -(trackLength - visibleTrack);

var carWidth = 50;
var carLength = 60;
var carColour = "yellow";
var interCarGap = 4 * carLength;
var playerCarTailPos = 20;        // distance between the the tail position of car and the bottom of the visible track
var carPositionsX = [20, (trackWidth / 2) - (carWidth / 2), 220];     // possible car x-positions
var previousOpponentCarPosX = 0;

var playerCarPosY = trackLength - (carLength + playerCarTailPos);
var playerCarPosX = (trackWidth / 2) - (carWidth / 2);

var player_car = new Car();
player_car.createCar(playerCarPosX, playerCarPosY);
road.appendChild(player_car.element);

function Car() {
    this.x = 0;
    this.y = 0;
    this.element;
    var that = this;

    this.createCar = function (xCord, yCord) {

        that.element = document.createElement('div');
        that.element.className = "car";
        that.element.style.background = carColour;
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

        opponent.createCar(xCord, yCord);
        opponentCars.push(opponent);
        road.appendChild(opponent.element);

        previousOpponentCarPosX = carPositonsIndex;

//        }

    }

    // remove cars past visible track
    for (var i = 0; i < opponentCars.length; i++) {
        if (opponentCars[i] != undefined) {
            if (Math.abs(trackTopPos) <= (opponentCars[i].y - visibleTrack)) {
                road.removeChild(opponentCars[i].element);
                delete opponentCars[i];
            }
        }
    }

    function moveOpponent() {
        trackTopPos = trackTopPos + carSpeed;
        road.style.top = trackTopPos + "px";
    }

    // move track bg resulting movement of the car till no track left to scroll(move)
    if (trackTopPos <= 0) {

        moveOpponent();

    }
//    counter += 1;
}

setInterval(gameloop, gameRefreshRate);