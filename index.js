addListeners();

function animaster() {
    return {
        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
        },

        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
        },

        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
        },

        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
        },

        moveAndHide(element, duration) {
            this.move(element, duration * 0.4, { x: 100, y: 20 });
            setTimeout(() => {
                this.fadeOut(element, duration * 0.6);
            }, duration * 0.4);
        },

        showAndHide(element, duration) {
            this.fadeIn(element, duration / 3);
            setTimeout(() => {
                this.fadeOut(element, duration / 3);
            }, duration * 2 / 3);
        },

        heartBeating(element) {
            const beat = () => {
                this.scale(element, 500, 1.4);
                setTimeout(() => {
                    this.scale(element, 500, 1);
                }, 500);
            };

            beat();
            const interval = setInterval(beat, 1000);
            return {
                stop() {
                    clearInterval(interval);
                }
            };
        }
    };
}

function addListeners() {
    document.getElementById('fadeInPlay').addEventListener('click', function () {
        const block = document.getElementById('fadeInBlock');
        animaster().fadeIn(block, 5000);
    });

    document.getElementById('fadeOutPlay').addEventListener('click', function () {
        const block = document.getElementById('fadeOutBlock');
        animaster().fadeOut(block, 5000);
    });

    document.getElementById('movePlay').addEventListener('click', function () {
        const block = document.getElementById('moveBlock');
        animaster().move(block, 1000, { x: 100, y: 10 });
    });

    document.getElementById('scalePlay').addEventListener('click', function () {
        const block = document.getElementById('scaleBlock');
        animaster().scale(block, 1000, 1.25);
    });

    document.getElementById('moveAndHidePlay').addEventListener('click', function () {
        const block = document.getElementById('moveAndHideBlock');
        animaster().moveAndHide(block, 5000);
    });

    document.getElementById('showAndHidePlay').addEventListener('click', function () {
        const block = document.getElementById('showAndHideBlock');
        animaster().showAndHide(block, 5000);
    });

    document.getElementById('heartBeatingPlay').addEventListener('click', function () {
        const block = document.getElementById('heartBeatingBlock');
        animaster().heartBeating(block);
    });
}

function getTransform(translation, ratio) {
    const result = [];
    if (translation) {
        result.push(`translate(${translation.x}px,${translation.y}px)`);
    }
    if (ratio) {
        result.push(`scale(${ratio})`);
    }
    return result.join(' ');
}
