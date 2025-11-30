import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div id="app">
            <Navbar />
            <main id="main-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;
