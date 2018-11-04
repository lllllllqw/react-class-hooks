/**
 *  https://github.com/salvoravida/react-class-hooks
 */

import React from 'react';
import invariant from 'tiny-invariant';

// inject None effects
React.PureComponent.prototype.componentDidMount = () => {};
React.Component.prototype.componentDidMount = () => {};

//TODO - polyfill
invariant(typeof Symbol === 'function' && Symbol.for, 'react-class-hooks needs Symbols!');

// Separate objects for better debugging.
export const MAGIC_STATES = Symbol.for('magicStates');
export const MAGIC_EFFECTS = Symbol.for('magicEffects');
export const MAGIC_MEMOS = Symbol.for('magicMemos');

//React 15.3.2 support + Polyfill
const instanceKey = React.version.indexOf('16') === 0 ? 'stateNode' : '_instance';

if (React.version.indexOf('15') === 0) {
    invariant(React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
        'Please for React ^15.3.2 - 15.6.2 import "react-class-hooks/poly15" in your root index.js!');
}

export function getMagicSelf() {
    invariant(React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner.current,
        'You are using Hooks outside of "render" React.Component Method!');
    return React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner.current[instanceKey];
}

export function checkSymbol(name, keySymbol) {
    invariant(typeof keySymbol === 'symbol', `${name} - Expected a Symbol for key!`);
}
