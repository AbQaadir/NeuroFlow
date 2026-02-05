import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface IconContextType {
    customIcons: Record<string, string>; // name -> svgContent
    addCustomIcon: (name: string, content: string) => void;
    removeCustomIcon: (name: string) => void;
}

const IconContext = createContext<IconContextType | undefined>(undefined);

export const useIconContext = () => {
    const context = useContext(IconContext);
    if (!context) {
        throw new Error('useIconContext must be used within an IconProvider');
    }
    return context;
};

interface IconProviderProps {
    children: ReactNode;
}

export const IconProvider = ({ children }: IconProviderProps) => {
    const [customIcons, setCustomIcons] = useState<Record<string, string>>({});

    // Load from LocalStorage on mount
    useEffect(() => {
        const savedIcons = localStorage.getItem('neuroflow_custom_icons');
        if (savedIcons) {
            try {
                setCustomIcons(JSON.parse(savedIcons));
            } catch (e) {
                console.error("Failed to parse custom icons from localStorage", e);
            }
        }
    }, []);

    // Save to LocalStorage whenever icons change
    useEffect(() => {
        localStorage.setItem('neuroflow_custom_icons', JSON.stringify(customIcons));
    }, [customIcons]);

    const addCustomIcon = (name: string, content: string) => {
        setCustomIcons(prev => ({
            ...prev,
            [name]: content
        }));
    };

    const removeCustomIcon = (name: string) => {
        setCustomIcons(prev => {
            const newIcons = { ...prev };
            delete newIcons[name];
            return newIcons;
        });
    };

    return (
        <IconContext.Provider value={{ customIcons, addCustomIcon, removeCustomIcon }}>
            {children}
        </IconContext.Provider>
    );
};
