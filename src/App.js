import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from './routes';
import DefaultLayout from './components/Layout/DefautLayout';
import { Fragment } from 'react';
import { UserProvider } from './hook/UserContext';

function App() {
    return (
        <UserProvider>
            <Router>
                <div className="App">
                    <Routes>
                        {publicRoutes.map((route, index) => {
                            const Layout = route.layout === null ? Fragment : DefaultLayout;
                            const Page = route.component;
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        })}{' '}
                    </Routes>
                </div>
            </Router>
        </UserProvider>
    );
}

export default App;
