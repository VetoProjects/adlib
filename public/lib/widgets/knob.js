// IDEA: dispatch input/change event if max is changed and value was bigger than the new value (same for min)

(() => {
    'use strict';

    const style = `
  /* FireFox */
  veto-knob,
  input[is="veto-knob"] {
      cursor: pointer;
      width: 48px;
      height: 48px;
      background-color: transparent;
      background-image: url('img/knob.png');
      background-size: 100%;
      border-radius: 100%;
      border: none;
      -webkit-appearance: none;
  }

  veto-knob::-moz-range-thumb,
  input[is="veto-knob"]::-moz-range-thumb {
      background: none;
      border: none;
  }

  veto-knob::-moz-range-track,
  input[is="veto-knob"]::-moz-range-track {
      background: none
  }

  /* Chrome */
  veto-knob::-webkit-slider-thumb,
  input[is="veto-knob"]::-webkit-slider-thumb {
      -webkit-appearance: none;
  }

  /* IE (Untested) */
  veto-knob::-ie-thumb,
  input[is="veto-knob"]::-ie-thumb {
      background: none;
      border: none;
  }
  
  veto-knob::-ie-track,
  input[is="veto-knob"]::-ie-track {
      background: none
  }
`;

    const styleSheet = document.createElement('style');
    styleSheet.append(document.createTextNode(style));
    document.head.append(styleSheet);

    class Knob extends HTMLInputElement {
        connectedCallback() {
            if (!this.hasAttribute('min')) this.setAttribute('min', '0');
            if (!this.hasAttribute('max')) this.setAttribute('max', '1');
            if (!this.hasAttribute('value')) this.setAttribute('value', "0.5");

            if (this.img) this.attributeChangedCallback('img', null, this.img);
            if (this.size) this.attributeChangedCallback('size', null, this.size);

            this.updateRotation();
            this.addEventListener('input', this.updateRotation);

            // Handle mouse events
            let _drag = null;

            const mousedown = (e) => {
                _drag = { x: e.clientX, y: e.clientY, value: +this.value };
                window.addEventListener('mousemove', mousemove, true);
                window.addEventListener('mouseup', mouseup, true);
                e.preventDefault();
                return e.returnValue = false;
            };

            const mousemove = (e) => {
                if (e.clientX && e.clientY) {
                    const value = _drag.value + Math.round(((e.clientX - _drag.x) + (_drag.y - e.clientY)) / 3) * this.step;
                    this.value = value.toString();
                    super.dispatchEvent(new Event('input'));
                }

                e.preventDefault();
                return e.returnValue = false;
            };

            const mouseup = (e) => {
                window.removeEventListener('mousemove', mousemove, true);
                window.removeEventListener('mouseup', mouseup, true);
                if (+this.value !== _drag.value) {
                    super.dispatchEvent(new Event('change'));
                }

                e.preventDefault();
                return e.returnValue = false;
            };

            this.addEventListener('mousedown', mousedown, true);
        }

        static get observedAttributes() {
            return ['size', 'img'];
        }

        attributeChangedCallback(name, old, value, nsuri) {
            switch (name) {
                case 'size':
                    super.style.width = super.style.height = `${value}px`;
                    break;

                case 'img':
                    super.style.backgroundImage = `url("${value}")`;
                    break;
            }
        }

        updateRotation() {
            const deg = (+this.value - +this.min) / (+this.max - +this.min) * 240 - 120;
            this.style.transform = `rotate(${deg}deg)`;
        };
    }

    window.customElements.define('veto-knob', Knob, { extends: 'input' });
})();
