import {TranSisterActions, TranSisterProps} from './types';
import {NotifyMixin, INotifyPropInfo, INotifyMixin} from 'trans-render/lib/mixins/notify.js';
import { transform as xform} from 'trans-render/lib/transform.js';
import { PE } from 'trans-render/lib/PE.js';
import { SplitText } from 'trans-render/lib/SplitText.js';
import { Action, PropInfo, RenderContext, RenderOptions } from 'trans-render/lib/types.js';
import {CE} from 'trans-render/lib/CE.js';
import {OnMixin} from 'on-to-me/on-mixin.js';
import {OnMixinProps, OnMixinActions} from 'on-to-me/types';

export class TranSisterCore extends HTMLElement implements TranSisterActions{

    __ctx: RenderContext | undefined;
    #cache: {[key: string]: NodeListOf<Element>} = {};



    doEvent({lastEvent, noblock, cnt}: this) {
        this.setAttribute('status', '🌩️');
        if(!noblock && lastEvent!.stopPropagation) lastEvent!.stopPropagation();
        return {cnt: cnt + 1};
    }

    applyTransform({host, transform, lastEvent}: this){
        if(this.__ctx === undefined){
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
        const hostLastEvent = (<any>host).lastEvent;
        (<any>host).lastEvent = lastEvent;
        xform(host!, this.__ctx);
        (<any>host).lastEvent = hostLastEvent;
        this.setAttribute('status', '👂');
    }



    clearCache({}: this){
        this.#cache = {};
        this.cacheIsStale = false;
    }
}
export interface TranSisterCore extends TranSisterProps {}
const strProp: PropInfo = {
    type: 'String'
}
const ce = new CE<TranSisterProps & OnMixinProps, TranSisterActions & OnMixinActions & INotifyMixin, INotifyPropInfo>({
    config: {
        tagName: 'tran-sister',
        propDefaults:{
            cacheIsStale: false,
            capture: false,
            noblock: false,
            observeHost: false,
            isC: true,
            cnt: 0,
        },
        propInfo:{
            on: strProp, observe: strProp,
            previousOn: strProp, ifTargetMatches: strProp, observeClosest: strProp,
            cnt:{
                notify:{
                    reflect:{
                        asAttr: true,
                    }
                }
            }
        },
        actions:{
            locateAndListen:{
                ifAllOf: ['isC', 'on'],
                ifKeyIn: ['observe', 'ifTargetMatches', 'observeHost']
            },
            doEvent:{
                ifAllOf: ['lastEvent'],
            },
            getHost:{
                ifAllOf: ['isC'],
            },
            applyTransform:{
                ifAllOf: ['host', 'transform', 'cnt'],
                setFree: ['lastEvent'],
            },
            clearCache:{
                ifAllOf: ['cacheIsStale']
            }
        },
        style:{
            display:'none',
        }
    },
    mixins: [NotifyMixin, OnMixin],
    superclass: TranSisterCore
});

export const TranSister = ce.classDef!;