import { NotifyMixin } from 'trans-render/lib/mixins/notify.js';
import { transform as xform } from 'trans-render/lib/transform.js';
import { PE } from 'trans-render/lib/PE.js';
import { SplitText } from 'trans-render/lib/SplitText.js';
import { CE } from 'trans-render/lib/CE.js';
import { OnMixin } from 'on-to-me/on-mixin.js';
export class TranSisterCore extends HTMLElement {
    __ctx;
    #cache = new WeakMap();
    doEvent({ lastEvent, noblock, cnt }) {
        this.setAttribute('status', '🌩️');
        if (!noblock && lastEvent.stopPropagation)
            lastEvent.stopPropagation();
        return { cnt: cnt + 1 };
    }
    applyTransform({ host, transform, lastEvent, debug }) {
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
        if (debug)
            debugger;
        xform(host.shadowRoot || host, this.__ctx);
        host.lastEvent = hostLastEvent;
        this.setAttribute('status', '👂');
    }
    clearCache({}) {
        new WeakMap();
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
            debug: false,
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
    mixins: [NotifyMixin, OnMixin],
    superclass: TranSisterCore
});
export const TranSister = ce.classDef;
