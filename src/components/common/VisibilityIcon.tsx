import React from 'react';
import { Unlock, Lock, Shield } from 'lucide-react';

export const VisibilityIcon = ({ vis }: { vis?: string }) => {
    if (vis === '+') return <Unlock className="w-3 h-3 text-green-500" />;
    if (vis === '-') return <Lock className="w-3 h-3 text-red-500" />;
    if (vis === '#') return <Shield className="w-3 h-3 text-yellow-500" />;
    return <div className="w-3 h-3" />;
};
