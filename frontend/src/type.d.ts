declare module 'react-floating-whatsapp' {
    import * as React from 'react';

    interface FloatingWhatsAppProps {
        phoneNumber: string;
        accountName?: string;
        avatar?: string;
        darkMode?: boolean;
        chatMessage?: string;
        placeholder?: string;
        statusMessage?: string;
        allowClickAway?: boolean;
        allowEsc?: boolean;
        styles?: React.CSSProperties;
        className?: string;
    }

    const FloatingWhatsApp: React.FC<FloatingWhatsAppProps>;
}