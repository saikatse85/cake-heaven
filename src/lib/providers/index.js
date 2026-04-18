import UserContextProvider from '@/context/UserContext';
import React from 'react';

const Providers = ({children}) => {
    return (
        <UserContextProvider>
        
            {children}
        
        </UserContextProvider>
    );
};

export default Providers;