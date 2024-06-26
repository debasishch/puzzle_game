// image-puzzle.js

var imagePuzzle = (function() {
    var gridSize = 4;
    var images = [];
    var currentImage = {};
    var timer;
    var countdown;
    var stepCount;

    function init(imgs) {
        images = imgs;
        gridSize = 4;
        $('#imgTitle').text('');
        $('#sortable').html('');
        $('#actualImage').attr('src', '');
        $('#stepBox .stepCount').text(0);
        $('#timerPanel').text(90);
        $('#levelPanel input:radio[value="4"]').prop('checked', true);
        startGame(images, gridSize);
    }

    function startGame(imgs, size) {
        clearInterval(timer);
        countdown = 90;
        stepCount = 0;
        $('#timerPanel').text(countdown);
        $('#stepBox .stepCount').text(stepCount);
        timer = setInterval(updateTimer, 1000);
        currentImage = imgs[Math.floor(Math.random() * imgs.length)];
        gridSize = size;
        createGrid(currentImage, gridSize);
        $('#actualImage').attr('src', currentImage.src);
    }

    function createGrid(image, size) {
        var pieces = [];
        for (var i = 0; i < size * size; i++) {
            pieces.push('<li class="ui-state-default" data-pos="' + i + '" style="background-image:url(' + image.src + '); background-size: ' + size * 100 + '% ' + size * 100 + '%; background-position: ' + ((i % size) * 100 / (size - 1)) + '% ' + (Math.floor(i / size) * 100 / (size - 1)) + '%;"></li>');
        }

        pieces = shuffleArray(pieces);
        $('#sortable').html(pieces.join(''));
        $('#sortable').sortable({
            stop: function(event, ui) {
                stepCount++;
                $('#stepBox .stepCount').text(stepCount);
                checkOrder();
            }
        });
        $('#sortable').disableSelection();
    }

    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    function checkOrder() {
        var currentOrder = $('#sortable li').map(function() {
            return $(this).data('pos');
        }).get();

        var isSolved = currentOrder.every(function(val, index) {
            return val === index;
        });

        if (isSolved) {
            clearInterval(timer);
            $('#gameOver h2').text('You win!');
            $('#gameOver').show();
        }
    }

    function updateTimer() {
        countdown--;
        $('#timerPanel').text(countdown);
        if (countdown <= 0) {
            clearInterval(timer);
            $('#gameOver').show();
        }
    }

    return {
        init: init,
        startGame: startGame
    };
})();

$(function() {
    var images = [
        { src: 'img/cat.jpeg' },
        { src: 'img/cartoon.jpeg' },
        { src: 'img/OIP.jpeg' },
        { src: 'img/download.jpeg' },
        { src: 'img/french_polynesia.jpeg' },
        { src: 'img/south_africa.jpeg' },
        { src: 'img/vietnam.jpeg' },
        { src: 'img/scotland.jpeg' },
        { src: 'img/scenery.jpeg' }
    ];

    imagePuzzle.init(images);

    $('#newPhoto').click(function() {
        var gridSize = $('#levelPanel :radio:checked').val();
        imagePuzzle.startGame(images, gridSize);
    });

    $('#levelPanel :radio').change(function(e) {
        var gridSize = $(this).val();
        imagePuzzle.startGame(images, gridSize);
    });
});