# redux-async-loader

Async data loader for Redux apps with React-Router.

## Installation

```
npm install --save redux-async-loader
```

## Usage

### 1. Register Reducer

```javascript
import { combineReducers, createStore } from 'redux';
import { reduxAsyncLoader } from 'redux-async-loader';

const store = createStore(combineReducers({
  reduxAsyncLoader,
  ...
}), initialState);
```

### 2. Server-Side Rendering (Optional)

```javascript
import { applyRouterMiddleware, match, RouterContext } from 'react-router';
import { loadOnServer } from 'redux-async-loader';

match({ history, routes }, (error, redirectLocation, renderProps) => {
  // ...

  loadOnServer(renderProps, store).then(() => {
    const content = renderToString(
      <Provider store={store} key="provider">
        <RouterContext {...renderProps} />
      </Provider>
    );
  });
});
```

### 3. Client-Side Rendering

```javascript
import { render } from 'react-dom';
import { Router, applyRouterMiddleware, browserHistory } from 'react-router';
import { useAsyncLoader } from 'redux-async-loader';

const RenderWithMiddleware = applyRouterMiddleware(
  useAsyncLoader(),
);

render(
  <Provider store={store} key="provider">
    <Router history={browserHistory} render={(props) => <RenderWithMiddleware {...props} />} />
  </Provider>
, el);
```

If you are using
[react-router-scroll](https://github.com/taion/react-router-scroll),
it should be applied *after* redux-async-loader.

```javascript
import useScroll from 'react-router-scroll';

const RenderWithMiddleware = applyRouterMiddleware(
  useAsyncLoader(),
  useScroll()
);
```

### 4. Async data loading by routing (both client and server-side rendering)

```javascript
import { connect } from 'react-redux';
import { asyncLoader } from 'redux-async-loader';

class UserList extends React.Component {
  // ...
}

export default asyncLoader((props, store) => store.dispatch(loadUsers(props)))(
  connect({ ... }, { ... })(
    UserList
  )
);
```

or, with
[decorator](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy):

```javascript
@asyncLoader((props, store) => store.dispatch(loadUsers(props)))
@connect({ ... }, { ... })
export default class UserList extends React.Component {
  // ...
}
```

or, with
[recompose](https://github.com/acdlite/recompose):

```javascript
import { compose } from 'recompose';

export default compose(
  asyncLoader((props, store) => store.dispatch(loadUsers(props))),
  connect({ ... }, { ... })
)(class UserList exptends React.Component {
  // ...
});
```

Unlike
[redux-async-connect](https://www.npmjs.com/package/redux-async-connect),
redux-async-loader itself doesn't connect to store.
You have to call
[connect()](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options)
explicitly if you want to use store's state.

If you want to invoke `asyncLoader()` when just querystring (not path) is changed, you must specify key names of querystring to router.

```
<Route path="items" component=ItemList asyncLoaderProps={{queryKeys: "q, page"}} ... />
```

Or, you can use the wildcard for any keys of querystring:

```
<Route path="items" component=ItemList asyncLoaderProps={{queryKeys: "*"}} ... />
```

### 5. Async data loading by mounting/updating (client-side rendering only)

```javascript
import { connect } from 'react-redux';
import { deferLoader } from 'redux-async-loader';

class UserList extends React.Component {
  // ...
}

export default deferLoader((props, store) => store.dispatch(loadUsers(props)))(
  connect({ ... }, { ... })(
    UserList
  )
);
```

or, with
[decorator](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy):

```javascript
@deferLoader((props, store) => store.dispatch(loadUsers(props)))
@connect({ ... }, { ... })
export default class UserList extends React.Component {
  // ...
}
```

or, with
[recompose](https://github.com/acdlite/recompose):

```javascript
import { compose } from 'recompose';

export default compose(
  deferLoader((props, store) => store.dispatch(loadUsers(props))),
  connect({ ... }, { ... })
)(class UserList exptends React.Component {
  // ...
});
```

## API

#### `asyncLoader(loader)`

Creates Higher-order Component for async data loading by routing.

##### Arguments

* `loader` *(Function)*: Called when this component is routed.
    * Arguments
        * `props` *(Object)*: The props passed from React-Router.
          See
          [React-Router API docs](https://github.com/reactjs/react-router/blob/master/docs/API.md#proptypes)
          for more info.
        * `store`: *(Object)*: Redux's store object.
    * Returns
        * *(Promise)*: Fulfilled when data loading is completed.

##### Returns

* *(Function)*: Creates higher-order component.
    * Arguments
        * wrappedComponent *(Component)*: Wrapped component.
    * Returns
        * *(Component)*: Wrapper component.

#### `deferLoader(loader)`

Creates Higher-order Component for async data loading by mounting and updating.

##### Arguments

* `loader` *(Function)*: Called when this component is mounted or updated.
    * Arguments
        * `props` *(Object)*: The props passed from parent component.
        * `store`: *(Object)*: Redux's store object.
    * Returns
        * *(Promise)*: Fulfilled when data loading is completed.

##### Returns

* *(Function)*: Creates higher-order component.
    * Arguments
        * wrappedComponent *(Component)*: Wrapped component.
    * Returns
        * *(Component)*: Wrapper component.

#### `loadOnServer(renderProps, store)`

Loads async data on the server side.

##### Arguments

* `renderProps` *(Object)*: The props passed via `match()`'s callback.
  See
  [React-Router API docs](https://github.com/reactjs/react-router/blob/master/docs/API.md#match-routes-location-history-options--cb)
  for more info.
* `store` *(Object)*: Redux's store object.

##### Returns

* *(Promise)*: Fulfilled when data loading is completed.
