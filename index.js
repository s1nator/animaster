addListeners();

function animaster() {
    function resetFadeIn(element) {
        element.style.transitionDuration = null;
        element.classList.remove('show');
        element.classList.add('hide');
    }

    function resetFadeOut(element) {
        element.style.transitionDuration = null;
        element.classList.remove('hide');
        element.classList.add('show');
    }

    function resetMoveAndScale(element) {
        element.style.transitionDuration = null;
        element.style.transform = null;
    }

    return {
        _steps: [],

        fadeIn(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('hide');
            element.classList.add('show');
            return {
                reset: () => resetFadeIn(element)
            };
        },

        fadeOut(element, duration) {
            element.style.transitionDuration = `${duration}ms`;
            element.classList.remove('show');
            element.classList.add('hide');
            return {
                reset: () => resetFadeOut(element)
            };
        },

        move(element, duration, translation) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(translation, null);
            return {
                reset: () => resetMoveAndScale(element)
            };
        },

        scale(element, duration, ratio) {
            element.style.transitionDuration = `${duration}ms`;
            element.style.transform = getTransform(null, ratio);
            return {
                reset: () => resetMoveAndScale(element)
            };
        },
        addMove(duration, translation) {
            this._steps.push({
                name: 'move',
                duration: duration,
                params: translation
            });
            return this;
        },

        addScale(duration, ratio) {
            this._steps.push({
                name: 'scale',
                duration: duration,
                params: ratio
            });
            return this;
        },

        addFadeIn(duration) {
            this._steps.push({
                name: 'fadeIn',
                duration: duration
            });
            return this;
        },

        addFadeOut(duration) {
            this._steps.push({
                name: 'fadeOut',
                duration: duration
            });
            return this;
        },

        play(element) {
            let delay = 0;

            for (const step of this._steps) {
                setTimeout(() => {
                    switch (step.name) {
                        case 'move':
                            this.move(element, step.duration, step.params);
                            break;
                        case 'scale':
                            this.scale(element, step.duration, step.params);
                            break;
                        case 'fadeIn':
                            this.fadeIn(element, step.duration);
                            break;
                        case 'fadeOut':
                            this.fadeOut(element, step.duration);
                            break;
                    }
                }, delay);

                delay += step.duration;
            }
        },
        moveAndHide(element, duration) {
            this.move(element, duration * 0.4, { x: 100, y: 20 });

            const timeoutId = setTimeout(() => {
                this.fadeOut(element, duration * 0.6);
            }, duration * 0.4);

            return {
                reset() {
                    clearTimeout(timeoutId);
                    resetMoveAndScale(element);
                    resetFadeOut(element);
                }
            }
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
        },
    };
}

function addListeners() {
    document.getElementById('fadeInPlay').addEventListener('click', function () {
        const block = document.getElementById('fadeInBlock');
        animaster().addFadeIn(5000).play(block);
    });

    document.getElementById('fadeOutPlay').addEventListener('click', function () {
        const block = document.getElementById('fadeOutBlock');
        animaster().addFadeOut(5000).play(block);
    });

    document.getElementById('movePlay').addEventListener('click', function () {
        const block = document.getElementById('moveBlock');
        animaster().addMove(1000, { x: 100, y: 10 }).play(block);
    });

    document.getElementById('scalePlay').addEventListener('click', function () {
        const block = document.getElementById('scaleBlock');
        animaster().addScale(1000, 1.25).play(block);
    });

    let moveAndHideAnimation;

    document.getElementById('moveAndHidePlay').addEventListener('click', function () {
        const block = document.getElementById('moveAndHideBlock');
        moveAndHideAnimation = animaster().moveAndHide(block, 5000);
    });

    document.getElementById('moveAndHideReset').addEventListener('click', function () {
        if (moveAndHideAnimation) {
            moveAndHideAnimation.reset();
        }
    });

    document.getElementById('showAndHidePlay').addEventListener('click', function () {
        const block = document.getElementById('showAndHideBlock');
        animaster().showAndHide(block, 5000);
    });

    let heartAnimation;

    document.getElementById('heartBeatingPlay').addEventListener('click', function () {
        const block = document.getElementById('heartBeatingBlock');
        heartAnimation = animaster().heartBeating(block);
    });

    document.getElementById('heartBeatingStop').addEventListener('click', function () {
        if (heartAnimation) {
            heartAnimation.stop();
        }
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