import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';

export default function deferLoader(loader) {
  return (WrappedComponent) => {
    class WrapperComponent extends Component {
      componentDidMount() {
        const { store } = this.context;
        loader(this.props, store);
      }

      componentWillReceiveProps(nextProps) {
        const { store } = this.context;
        loader(nextProps, store);
      }

      render() {
        return (
          <WrappedComponent {...this.props} />
        );
      }
    }

    WrapperComponent.displayName = `deferLoader(${getDisplayName(WrappedComponent)})`;
    WrapperComponent.contextTypes = {
      store: PropTypes.object.isRequired,
    };
    return hoistStatics(WrapperComponent, WrappedComponent);
  };
}

function getDisplayName(component) {
  return component.displayName || component.name;
}
