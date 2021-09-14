export interface TranSisterProps{
    //on: string,
    //observe: string,
    transform: any,
    cacheIsStale: boolean;
    //previousOn?: string;

    /**
     * Only act on event if target element css-matches the expression specified by this attribute.
     * @attr
     */
    //ifTargetMatches: string;

    /**
     * A Boolean indicating that events of this type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree.
    */
    //capture: boolean;

    lastEvent?: Event;

    /**
     * Don't block event propagation.
     * @attr
     */
    noblock: boolean;

    //observeClosest: string;

    //observeHost: boolean;

    host: HTMLElement;

    isC: boolean;

    cnt: number;
}

export interface TranSisterActions{

    applyTransform(self: this): void;
    clearCache(self:this): void;
}