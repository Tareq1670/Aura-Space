import Footer from '@/Components/Public/Footer';
import Navbar from '@/Components/Public/Navbar';
import React from 'react';

const layout = ({ children } : { children: React.ReactNode }) => {
    return (
        <div>
            <Navbar/>
            <div>{children}</div>
            <Footer/>
        </div>
    );
};

export default layout;