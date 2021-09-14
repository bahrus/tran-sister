import {TranSisterActions, TranSisterProps} from './types';
import {NotifyMixin, INotifyPropInfo, INotifyMixin} from 'trans-render/lib/mixins/notify.js';
import { transform as xform} from 'trans-render/lib/transform.js';
import { PE } from 'trans-render/lib/PE.js';
import { SplitText } from 'trans-render/lib/SplitText.js';
import { Action, PropInfo, RenderContext, RenderOptions } from 'trans-render/lib/types.js';
import {CE} from 'trans-render/lib/CE.js';
import {getPreviousSib, passVal, nudge, getProp, convert} from 'on-to-me/on-to-me.js';

export class TranSisterCore extends HTMLElement implements TranSisterActions{

    __ctx: RenderContext | undefined;
    #cache: {[key: string]: NodeListOf<Element>} = {};

    //identical to pass-down
    locateAndListen({on, _wr, previousOn, handleEvent, parentElement, ifTargetMatches}: this) {
        const previousElementToObserve = this._wr?.deref();
        this._wr = undefined;
        const elementToObserve = this.observedElement;
        if(!elementToObserve) throw "Could not locate element to observe.";
        let doNudge = previousElementToObserve !== elementToObserve;
        if((previousElementToObserve !== undefined) && (previousOn !== undefined || (previousElementToObserve !== elementToObserve))){
            previousElementToObserve.removeEventListener(previousOn || on as keyof ElementEventMap, handleEvent);
        }else{
            doNudge = true;
        }
        this.attach(elementToObserve, this);
        if(doNudge){
            if(elementToObserve === parentElement && ifTargetMatches !== undefined){
                elementToObserve.querySelectorAll(ifTargetMatches).forEach(publisher =>{
                    nudge(publisher);
                });
            }else{
                nudge(elementToObserve);
            }
            
        }
        this.setAttribute('status', '👂');
        this.previousOn = on;
    };

    //identical to pass-down
    attach(elementToObserve: Element, {on, handleEvent, capture}: this){
        elementToObserve.addEventListener(on!, handleEvent, {capture: capture});
    }

    //https://web.dev/javascript-this/
    //identical to pass-down
    handleEvent = (e: Event) => {
        if(this.ifTargetMatches !== undefined){
            if(!(e.target as HTMLElement).matches(this.ifTargetMatches!)) return;
        }
        if(!this.filterEvent(e)) return;
        this.lastEvent = e;
    }

    //identical to pass-down
    filterEvent(e: Event) : boolean{
        return true;
    }

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

    getHost({}: this): {host: HTMLElement}{
        let host = (<any>this.getRootNode()).host;
        if(host === undefined){
            host = this.parentElement;
            while(host && !host.localName.includes('-')){
                host = host.parentElement;
            }
        }
        return {host};
    }

    _wr: WeakRef<Element> | undefined;
    //identical to pass-down
    //introduction of getHost method
    get observedElement() : Element | null{
        const element = this._wr === undefined ? undefined : this._wr?.deref(); //TODO  wait for bundlephobia to get over it's updatephobia
        if(element !== undefined){
            return element;
        }
        let elementToObserve: Element | null;
        if(this.observeHost){
            elementToObserve = this.getHost(this).host;
        }
        else if(this.observeClosest){
            elementToObserve = this.closest(this.observeClosest);
            if(elementToObserve !== null && this.observe){
                elementToObserve = getPreviousSib(elementToObserve.previousElementSibling || elementToObserve.parentElement as HTMLElement, this.observe) as Element;
            }
        }else{
            elementToObserve = getPreviousSib(this.previousElementSibling || this.parentElement as HTMLElement, this.observe ?? null) as Element;
        }
        if(elementToObserve === null) return null;
        this._wr = new WeakRef(elementToObserve);
        return elementToObserve;
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
const ce = new CE<TranSisterProps, TranSisterActions & INotifyMixin, INotifyPropInfo>({
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
    superclass: TranSisterCore
});

export const TranSister = ce.classDef!;