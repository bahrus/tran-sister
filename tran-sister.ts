import {TranSisterActions, TranSisterProps} from './types';
import {CE} from 'trans-render/lib/CE.js';
export class TranSisterCore extends HTMLElement implements TranSisterActions{

}
export interface TranSisterCore extends TranSisterProps {}

const ce = new CE<TranSisterProps, TranSisterActions>({
    config: {
        tagName: 'trans-sister'
    }
});