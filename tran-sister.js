import { transform as xform } from 'trans-render/lib/transform.js';
import { PE } from 'trans-render/lib/PE.js';
import { SplitText } from 'trans-render/lib/SplitText.js';
import { CE } from 'trans-render/lib/CE.js';
import { getPreviousSib, nudge } from 'on-to-me/on-to-me.js';
export class TranSisterCore extends HTMLElement {
    __ctx;
    #cache = {};
    //identical to pass-down
    locateAndListen({ on, _wr, previousOn, handleEvent, parentElement, ifTargetMatches }) {
        const previousElementToObserve = this._wr?.deref();
        this._wr = undefined;
        const elementToObserve = this.observedElement;
        if (!elementToObserve)
            throw "Could not locate element to observe.";
        let doNudge = previousElementToObserve !== elementToObserve;
        if ((previousElementToObserve !== undefined) && (previousOn !== undefined || (previousElementToObserve !== elementToObserve))) {
            previousElementToObserve.removeEventListener(previousOn || on, handleEvent);
        }
        else {
            doNudge = true;
        }
        this.attach(elementToObserve, this);
        if (doNudge) {
            if (elementToObserve === parentElement && ifTargetMatches !== undefined) {
                elementToObserve.querySelectorAll(ifTargetMatches).forEach(publisher => {
                    nudge(publisher);
                });
            }
            else {
                nudge(elementToObserve);
            }
        }
        this.setAttribute('status', '👂');
        this.previousOn = on;
    }
    ;
    //identical to pass-down
    attach(elementToObserve, { on, handleEvent, capture }) {
        elementToObserve.addEventListener(on, handleEvent, { capture: capture });
    }
    //https://web.dev/javascript-this/
    //identical to pass-down
    handleEvent = (e) => {
        if (this.ifTargetMatches !== undefined) {
            if (!e.target.matches(this.ifTargetMatches))
                return;
        }
        if (!this.filterEvent(e))
            return;
        this.lastEvent = e;
    };
    //identical to pass-down
    filterEvent(e) {
        return true;
    }
    doEvent({ lastEvent, noblock, cnt }) {
        this.setAttribute('status', '🌩️');
        if (!noblock && lastEvent.stopPropagation)
            lastEvent.stopPropagation();
        return { cnt: cnt + 1 };
    }
    applyTransform({ host, transform, lastEvent }) {
        if (this.__ctx === undefined) {
            this.__ctx = {
                match: transform,
                host: host,
                queryCache: this.#cache,
                postMatch: [
                    {
                        rhsType: Array,
                        rhsHeadType: Object,
                        ctor: PE
                    },
                    {
                        rhsType: Array,
                        rhsHeadType: String,
                        ctor: SplitText
                    },
                    {
                        rhsType: String,
                        ctor: SplitText,
                    }
                ],
            };
            this.__ctx.ctx = this.__ctx;
        }
        const hostLastEvent = host.lastEvent;
        host.lastEvent = lastEvent;
        xform(host, this.__ctx);
        host.lastEvent = hostLastEvent;
        this.setAttribute('status', '👂');
    }
    getHost({}) {
        let host = this.getRootNode().host;
        if (host === undefined) {
            host = this.parentElement;
            while (host && !host.localName.includes('-')) {
                host = host.parentElement;
            }
        }
        return { host };
    }
    _wr;
    //identical to pass-down
    //introduction of getHost method
    get observedElement() {
        const element = this._wr === undefined ? undefined : this._wr?.deref(); //TODO  wait for bundlephobia to get over it's updatephobia
        if (element !== undefined) {
            return element;
        }
        let elementToObserve;
        if (this.observeHost) {
            elementToObserve = this.getHost(this).host;
        }
        else if (this.observeClosest) {
            elementToObserve = this.closest(this.observeClosest);
            if (elementToObserve !== null && this.observe) {
                elementToObserve = getPreviousSib(elementToObserve.previousElementSibling || elementToObserve.parentElement, this.observe);
            }
        }
        else {
            elementToObserve = getPreviousSib(this.previousElementSibling || this.parentElement, this.observe ?? null);
        }
        if (elementToObserve === null)
            return null;
        this._wr = new WeakRef(elementToObserve);
        return elementToObserve;
    }
    clearCache({}) {
        this.#cache = {};
        this.cacheIsStale = false;
    }
}
const strProp = {
    type: 'String'
};
const ce = new CE({
    config: {
        tagName: 'tran-sister',
        propDefaults: {
            cacheIsStale: false,
            capture: false,
            noblock: false,
            observeHost: false,
            isC: true,
            cnt: 0,
        },
        propInfo: {
            on: strProp, observe: strProp,
            previousOn: strProp, ifTargetMatches: strProp, observeClosest: strProp,
            cnt: {
                notify: {
                    reflect: {
                        asAttr: true,
                    }
                }
            }
        },
        actions: {
            locateAndListen: {
                ifAllOf: ['isC', 'on'],
                ifKeyIn: ['observe', 'ifTargetMatches', 'observeHost']
            },
            doEvent: {
                ifAllOf: ['lastEvent'],
            },
            getHost: {
                ifAllOf: ['isC'],
            },
            applyTransform: {
                ifAllOf: ['host', 'transform', 'cnt'],
                setFree: ['lastEvent'],
            },
            clearCache: {
                ifAllOf: ['cacheIsStale']
            }
        },
        style: {
            display: 'none',
        }
    },
    superclass: TranSisterCore
});
export const TranSister = ce.classDef;
