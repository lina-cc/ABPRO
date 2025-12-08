import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div id="app">
            <Navbar />
            <main id="main-content">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
