import React, { Component } from 'react';
import { ReactReduxContext } from 'react-redux';
import hoistStatics from 'hoist-non-react-statics';

export default function deferLoader(loader) {
  return (WrappedComponent) => {
    class WrapperComponent extends Component {
      componentDidMount() {
        const { store } = this.props.ctx;
        loader(this.props, store);
      }

      UNSAFE_componentWillReceiveProps(nextProps) {
        const { store } = this.props.ctx;
        loader(nextProps, store);
      }

      render() {
        return <WrappedComponent {...this.props} />;
      }
    }

    WrapperComponent.displayName = `deferLoader(${getDisplayName(
      WrappedComponent
    )})`;

    const WrapperComponentWithContext = (props) => (
      <ReactReduxContext.Consumer>
        {({ store }) => <WrapperComponent ctx={{ store }} {...props} />}
      </ReactReduxContext.Consumer>
    );

    return hoistStatics(WrapperComponentWithContext, WrappedComponent);
  };
}

function getDisplayName(component) {
  return component.displayName || component.name;
}
