var app = angular.module('Pomodoro', []);
app.controller("PomodoroCtrl", function ($scope) {
    'use strict';

    var studySound = 'http://www.brainwave-music.com/fileadmin/media/Alpha-Brainwave-Relax-Meditation-Ambient.mp3',
        studyAudio = new Audio(studySound),
        currentMinutes = 25,
        currentSeconds = 0,
        playDisabled = false,
        pauseDisabled = false,
        changeDisabled = false,
        interval,
        checkbox = document.getElementById('checkbox'),
        clockDiv = document.getElementsByClassName('clock')[0],
        timeString = document.getElementsByClassName('time')[0];

    $scope.session = 25;
    $scope.break = 5;
    $scope.secondsDisplay = currentSeconds < 10 ? '0' + String(currentSeconds) : currentSeconds;
    $scope.minutesDisplay = currentMinutes < 10 ? '0' + String(currentMinutes) : currentMinutes;
    $scope.string = "Ready?";

    //If Study Mode is checked, the user gets a "Study!" message
    function studyOrWork() {
        if (checkbox.checked) {
            $scope.string = "Study!";
        } else {
            $scope.string = "Work!";
        }
    }

    //Change background color of clock div, depending on whether it's session or break time
    function changeColor() {
        if ($scope.string === "Work!" || $scope.string === "Ready?" || $scope.string === "Study!") {
            clockDiv.style.backgroundColor = "rgba(128, 0, 0, 0.8)";
            timeString.style.color = "#1f222e";
        } else {
            clockDiv.style.backgroundColor = "#ffff4d";
            timeString.style.color = "#303746";
        }
    }

    changeColor();

    //Allowing the user to increment/decrement the length of the session and the break
    $scope.plusMinus = function (arg) {
        if (arg === 'sessionPlus') {
            $scope.session += 1;
        } else if (arg === 'sessionMinus' && $scope.session > 1) {
            $scope.session -= 1;
        } else if (arg === 'breakPlus') {
            $scope.break += 1;
        } else if (arg === 'breakMinus' && $scope.break > 1) {
            $scope.break -= 1;
        }
        if (!changeDisabled) {
            currentMinutes = $scope.session;
            $scope.minutesDisplay = currentMinutes < 10 ? '0' + String(currentMinutes) : currentMinutes;
        }
    };

    $scope.play = function () {
        if (!playDisabled) {
            playDisabled = true;
            changeDisabled = true;
            checkbox.disabled = true;
            if (!pauseDisabled) {
                currentMinutes = $scope.session;
                studyOrWork();
            }
            interval = setInterval(function () {
                if (currentMinutes === 0 && currentSeconds === 0) {
                    if ($scope.string === "Work!" || $scope.string === "Study!") {
                        currentMinutes = $scope.break;
                        $scope.string = "Rest!";
                    } else {
                        currentMinutes = $scope.session;
                        studyOrWork();
                    }
                } else if (currentSeconds === 0) {
                    currentSeconds = 59;
                } else {
                    currentSeconds -= 1;
                }

                if (currentSeconds === 59) {
                    currentMinutes -= 1;
                }

                changeColor();
                $scope.secondsDisplay = currentSeconds < 10 ? '0' + String(currentSeconds) : currentSeconds;
                $scope.minutesDisplay = currentMinutes < 10 ? '0' + String(currentMinutes) : currentMinutes;
                $scope.$apply();
            }, 1000);

            //Plays audio if Study Mode is checked
            if (checkbox.checked) {
                studyAudio.play();
                studyAudio.loop();
            }
        }
    };

    $scope.pause = function () {
        studyAudio.pause();
        clearInterval(interval);
        playDisabled = false;
        pauseDisabled = true;
    };

    $scope.reset = function () {
        studyAudio.pause();
        studyAudio.load();
        checkbox.disabled = false;
        clearInterval(interval);
        currentMinutes = $scope.session;
        $scope.minutesDisplay = currentMinutes < 10 ? '0' + String(currentMinutes) : currentMinutes;
        currentSeconds = 0;
        $scope.secondsDisplay = currentSeconds < 10 ? '0' + String(currentSeconds) : currentSeconds;
        $scope.string = "Ready?";
        changeColor();
        playDisabled = false;
        pauseDisabled = false;
        changeDisabled = false;
    };

});
