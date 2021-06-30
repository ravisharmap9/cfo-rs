import React, { Component } from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { publicRoutes } from './routes';
import PublicRoute from './public-route';

class Router extends Component {
  render() {
    return (
      <BrowserRouter
      // basename={process.env.PUBLIC_URL}
      >
        <Switch>
          {publicRoutes.map(({
            key, exact, path, component, layout, allowedRoles
          }) => (
              <PublicRoute
                key={key}
                exact={exact}
                path={path}
                component={component}
                layout={layout}
                allowedRoles={allowedRoles}
              />
            ))}
        </Switch>
      </BrowserRouter>
    )
  }
}

export default Router;