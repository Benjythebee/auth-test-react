
export type LinkAction = {
    type: 'link';
    url: string;
}

export type ModalAction = {
    type: 'modal';
    content: {
        title: string;
        body: string;
    }
}

export type TriggerData = {
        type: 'zone' | 'button';
        position: { x: number; y: number };
        scale: number;
        label: string;
    }

export type InteractiveMetadata = {
    trigger:TriggerData
    action:ModalAction | LinkAction | null;
}


export type InteractiveRow = {
    id: number;
    store_id: string;
    image: string;
    metadata: InteractiveMetadata
    created_at: Date;
};