import React, { createContext, useContext, useState, ReactNode, useMemo, Dispatch } from 'react';
import { LinkAction, ModalAction, TriggerData } from '../../common/types';

interface UploadContextData {
    file: File | null;
    imageUrl: string | null;
}

interface UploadContextType {
    uploadData: UploadContextData;
    actionData: ModalAction | LinkAction | null;
    triggerData: TriggerData
    setTriggerData: Dispatch<React.SetStateAction<TriggerData>>;
    setFile: (file: File | null) => void;
    setActionData: Dispatch<React.SetStateAction<ModalAction | LinkAction | null>>;
    setImageUrl: (url: string | null) => void;
    clearUploadData: () => void;
}

const UploadContext = createContext<UploadContextType>({
    uploadData: { file: null, imageUrl: null },
    actionData: null,
    triggerData: {
        type: 'button',
        position: { x: 0, y: 0 },
        scale: 1,
        label: 'Click me!'
    },
    setTriggerData: () => {},
    setFile: () => {},
    setActionData: () => {},
    setImageUrl: () => {},
    clearUploadData: () => {},
});


export function UploadProvider({ children }: { children: ReactNode }) {
    const [uploadData, setUploadData] = useState<UploadContextData>({
            file: null,
            imageUrl: null,
        });
    const [actionData, setActionDataState] = useState<ModalAction | LinkAction | null>(null);
    const [triggerData, setTriggerData] = useState<TriggerData>({
        type: 'button',
        position: { x: 0, y: 0 },
        scale: 1,
        label: 'Click me!'
    });

    const setFile = (file: File | null) => {
        setUploadData(prev => ({ ...prev, file }));
        
        // Generate image URL for preview if file exists
        if (file) {
            const url = URL.createObjectURL(file);
            setUploadData(prev => ({ ...prev, imageUrl: url }));
        } else {
            setUploadData(prev => ({ ...prev, imageUrl: null }));
        }
    };

    const setImageUrl = (url: string | null) => {
        setUploadData(prev => ({ ...prev, imageUrl: url }));
    };

    const clearUploadData = () => {
        if (uploadData.imageUrl) {
            URL.revokeObjectURL(uploadData.imageUrl);
        }
        setUploadData({
            file: null,
            imageUrl: null,
        });
    };

    return (
        <UploadContext.Provider
            value={{
                uploadData,
                actionData,
                triggerData,
                setTriggerData,
                setFile,
                setImageUrl,
                setActionData:setActionDataState,
                clearUploadData
            }}
        >
            {children}
        </UploadContext.Provider>
    );
}

export function useUpload() {
    const context = useContext(UploadContext);
    if (context === undefined) {
        throw new Error('useUpload must be used within an UploadProvider');
    }
    return context;
}