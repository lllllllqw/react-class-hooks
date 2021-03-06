
# react-universal-hooks
<p align="center"><b>UPDATE 2019.03.04 -> Recommended way to use Class Hooks</b></p>
https://github.com/salvoravida/react-universal-hooks

# react-class-hooks [![npm version](https://img.shields.io/npm/v/react-class-hooks.svg?style=flat)](https://www.npmjs.org/package/react-class-hooks) 

React Hooks implementation for Class Components. Support React >= 15.3.2

Installation
-----------
Using [npm](https://www.npmjs.com/):

    $ npm install --save react-class-hooks

Or [yarn](https://yarnpkg.com/):

    $ yarn add react-class-hooks

React 15.3.2 - 15.6.2 polyfill needed
----
For React Versions 15.3.2 to 15.6.2 you have to import `react-class-hooks/poly15` in your root index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import 'react-class-hooks/poly15';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));
```
Usage
-----    
```javascript
import { useClassState, useClassCallback, useClassEffect } from 'react-class-hooks';
import { useClassWindowSize  } from "./hooks";

class MyComponent extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = { /* your already existing business logic here */ };
    }
    componentDidMount (){ /* your already existing business logic here */}
    componentDidUpdate (){ /* your already existing business logic here */}
    componentUnmount (){ /* your already existing business logic here */} 
    
    render() {
    const { width, height } = useClassWindowSize();

    return (
        <div>
          <p> windowSize : {width} x {height}</p>
          {/** ..... **/}
        </div>
    );
    }
}
```

hooks.js
```javascript
import { useClassState, useClassEffect } from 'react-class-hooks';

export const useClassWindowSize = () => {
    const [size, setSize] = useClassState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const handle = (() => {
        setSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    });
    useClassEffect(() => {
        window.addEventListener('resize', handle);
        return () => {
            window.removeEventListener('resize', handle);
        };
    }, []);
    return size;
};
```


## Abstract
React Hooks implementation for Class Components. Support React >= 15.3.2

## What are React Hooks ?
Official Intro -> https://reactjs.org/docs/hooks-intro.html

In poor words, with use******** you are injecting @ runtime during render phase a
*piece of {state, didMount, didUpdate, unMount}* just in one line of code,
<strong>*without collision with eventually already existing state & lifecycle of your components.*</strong><br/>
You can think Hooks like Mixin without Mixin drawbacks, because of Runtime Injection&Isolation.

## Why Hooks?
Share Business Logic (*piece of [state, didMount, didUpdate, unMount]*) between components in one line of code.<br/>
Does it have a performance cost? Of course, injecting @ runtime have always a cost. So Why?<br/>
<strong>Share Business Logic (*piece of [state, didMount, didUpdate, unMount]*) beetween components in one line of code.</strong>

## Why Hooks for Class Components?
* Why not? (of course the useClassState used alone does not make sense in Class Comp. The real advantage is partial state isolation in Custom Hooks) 
* In future you could have custom Hooks for functional components, but you want to use it in a complex Class Container for any reason.
* You can play with hooks today in already existing apps, testing them in class components. `react-class-hooks` should be fine with React >= 15.3.2
* useClassMemo & useClassCallback make PureComponents 100% pure! (max performance!)
* You could use Advanded Class Hooks concepts (see below)

## Use Case : Make PureComponent 100% Pure
```javascript
import { useClassCallback } from 'react-class-hooks';

//named stack hooks -> see below (isolated named stack - no order rules drawbacks)
const myComponentCallback = useClassCallback.createStack('myComponentCallback');

class MyComponent extends React.PureComponent {
  render (){
    //....
  }
}

class Container extends React.PureComponent {
  render (){
    {this.props.arrayProp.map(el=>
      <MyComponent key={el.id} onClick={myComponentCallback( ()=> someAction(el.id) , [el.id])} /> 
    )}
  }
}
```

## Does `react-class-hooks` use under the hood React official hooks?
No. It implement useClass*** without React use****. It should supports React >=15.3.2<br/>

## Api Reference
Api Reference are the same as official ones, so you can see api reference @ https://reactjs.org/docs/hooks-reference.html
<br/>
Currently supported api:

* useClassState -> create & use a partial isolated Component State.
* useClassEffect -> inject code on didMount+didUpdate+didUnmount
* useClassMemo -> memoize values 
* useClassCallback -> memoize dynamic callbacks -> useful on PureComponent when rendering Arrays.
* useClassReducer -> a Redux-like local state
* useClassRef -> a mutable ref object with .current 
* useClassContext -> use Context
* useClassLayoutEffect -> alias for useClassEffect
* useClassImperativeHandle -> just for compatibility with useImperativeHandle. 

## Advanded Class Hooks : Named Hooks
Hooks are anonymous, so order matters in the "render" method, because there is no other way to differentiate from one call to another in the same render.
But you could need one inside a condition, or you want to share state beetween 2 subRenders in the same render phase.

let's see an example : 
```javascript
const useMyLoggerState = useClassState.create("MyLogger");
const useMyLoggerEffect = useClassEffect.create("MyLogger");

class App extends React.PureComponent {
  renderLogger() {
    const [logger, setLogger] = useMyLoggerState(0);
    return (
      <>
        <p>Hidden LOGGER COUNTER {logger}</p>
        <button onClick={() => setLogger(logger + 1)}>
          Add Hidden LoggerCounter
        </button>
      </>
    );
  }

  render() {
    const [count, setCount] = useClassState(0);
    const { width, height } = useClassWindowSize();

    if (count % 5 === 0) {
      const [logger] = useMyLoggerState(0);
      useMyLoggerEffect(() => {
        document.title = "logged times " + logger;
      });
    }

    const [count2, setCount2] = useClassState(0);

    return (
          <div>
            <p>
              windowSize : {width}x{height}
            </p>
            <p>Anonymous Counter 1 {count}</p>
            <button onClick={() => setCount(count + 1)}>Add Counter 1</button>
            {count % 5 === 0 && this.renderLogger()}
            <p>Other Anonymous Counter {count2}</p>
            <button onClick={() => setCount2(count2 + 1)}>Add Other Counter</button>
          </div>
        );
    }
}
```
https://codesandbox.io/s/v8y8o3m737

I know that hooks should not be inside a condition, because it breaks the order rule, but a Named Hooks 
does not break anonymous hooks stack, as it has a isolated named own state.
Note that named hooks share context so calling 2 times the same Named Hook in the same render phase,
will get the same value! 
```javascript
   render () {
   
   const [logger, setLogger] = useMyLoggerState({});
   
   const [logger2, setLogger2] = useMyLoggerState({});
   
   // => logger2===logger !!
      
   }
```
May it be useful or not? In many cases custom hooks are based on one call only of useState and useEffect!
In such case using Named Hooks is better because the created *namedCustomHooks* does not need hook order rule!

let's see a useClassWindowSize with named hooks:
```javascript
import { useClassState, useClassEffect } from 'react-class-hooks';

const useClassWsState= useClassState.create("WindowSize");
const useClassWsEffect= useClassEffect.create("WindowSize");

const useClassWindowSize = () => {
    const [size, setSize] = useClassWsState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const handle = (() => {
        setSize({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    });
    
    useClassWsEffect(() => {
        window.addEventListener('resize', handle);
        return () => {
            window.removeEventListener('resize', handle);
        };
    }, []);
    return size;
}; 
```
Moreover debugging is easier with Named Hooks :
<p align="center">
    <img alt="react-adal" src="https://i.postimg.cc/sXFWT77F/app.png">
</p>
Symbol(WindowSize) is more clear than Symbol(States-0) and if you have more custom hooks used in a component,
you have to check the order in the source ...

## Advanded Class Hooks : Named Stack Hooks
If you need an ordered list of Named Hooks you could find useful the last advanced api concept.
```javascript
const useMyLoggerStateStack = useClassState.createStack("MyLoggerStack");

class App extends React.PureComponent {
   render () {
   
   const [logger, setLogger] = useMyLoggerStateStack({});
   //....
   const [logger2, setLogger2] = useMyLoggerStateStack({});
   
   // => logger2 !== logger !!
      
   }
}   
```

## How can i create Universal Custom Hooks in future?
https://github.com/salvoravida/react-universal-hooks

# Feedback

Let me know what do you think about! <br>
*Enjoy it? Star this project!* :D

# Todo
* didCatch support
* tests
* others api
* more custom hooks examples
* better docs

any idea? let me know and contribute!

Contributors
------------
See [Contributors](https://github.com/salvoravida/react-class-hooks/graphs/contributors).

License
-------
[MIT License](https://github.com/salvoravida/react-class-hooks/blob/master/LICENSE.md).
