import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Users from './components/Users';
import Orders from './components/Orders';
import NotFound from './components/NotFound';

const App: React.FC = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Dashboard} />
                <Route path="/users" component={Users} />
                <Route path="/orders" component={Orders} />
                <Route component={NotFound} />
            </Switch>
        </Router>
    );
};

export default App;