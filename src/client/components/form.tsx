import React, { useState } from 'react';
import { useUpload } from '../context/upload.context';
import { UploadAPIType } from '../../common/api.type';

interface FormData {
    file: File | null;
    actionType: 'url' | 'modal';
    url: string;
    buttonLabel: string;
    modalTitle: string;
    modalDescription: string;
}

export default function ImageForm() {

    const {actionData, uploadData,triggerData,setFile,setActionData,setTriggerData} = useUpload()
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;

        setFile(file);
        // setFormData(prev => ({ ...prev, file }));
    };

    const handleActionTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const actionType = e.target.value as 'link' | 'modal';
        setActionData({
            type: actionType === 'link' ? 'link' : 'modal',
            content: actionType === 'modal' ? { title: '', body: '' } : null,
            url: actionType === 'link' ? '' : undefined
        } as any)
    };

    const handleInputChange = (field: keyof Omit<FormData, 'file' | 'actionType'>) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        if (field === 'buttonLabel') {
            setTriggerData(prev => ({ ...prev, label: value }));
        }
        if( field === 'url') {
            setActionData({
                type: 'link',
                url: value
            });
        }
        if (field === 'modalTitle' || field === 'modalDescription') {
            setActionData((prev) => {
                if (prev && prev.type === 'modal') {
                    return {
                        type: 'modal',
                        content: {
                            ...prev.content || {},
                            title: field === 'modalTitle' ? value : prev.content?.title || '',
                            body: field === 'modalDescription' ? value : prev.content?.body || ''
                        }
                    };
                }
                return prev;
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if(!uploadData.file) {
            setError('File is required');
            return;
        }   
        if(!actionData) {
            setError('Action data is required');
            return;
        }
        if(!triggerData) {
            setError('Trigger data is required');
            return;
        }
        const formData =  new FormData();
        formData.append('file', uploadData.file!);

        // Some very basic validation
        if(actionData.type === 'link' && !actionData.url) {
            setError('URL is required for link action');
            return;
        }
        if(actionData.type === 'modal' && (!actionData.content?.title || !actionData.content?.body)) {
            setError('Title and body are required for modal action');
            return;
        }
        if(triggerData.type === 'button' && !triggerData.label) {
            setError('Button label is required for button trigger');
            return;
        }
        if(triggerData.position.x === undefined || triggerData.position.y === undefined) {
            setError('Trigger position is required');
            return;
        }

        const dataToSubmit:UploadAPIType = ({
            type: actionData!.type,
            trigger:triggerData,
            content: actionData!.type === 'modal' ? {
                title: actionData!.content!.title,
                body: actionData!.content!.body
            } : undefined,
            url: actionData!.type === 'link' ? actionData!.url! : undefined,
        })
        formData.append('metadata', JSON.stringify(dataToSubmit));

        try{
            fetch('/upload', {
                method: 'POST',
                body: formData,
            }).then(res=>{
                if(!res.ok){
                    res.json().then(data=>{
                        setError(data.errors ? data.errors.join(', ') : 'Upload failed');
                    });
                }else{
                    setSuccess('Upload successful!');
                }
            });

        } catch (error) {
            setError('An unexpected error occurred');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-6">
            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Upload File</span>
                </label>
                <input
                    type="file"
                    name="file"
                    className="file-input file-input-bordered w-full"
                    onChange={handleFileChange}
                />
            </div>


            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Trigger Type</span>
                </label>
                <select
                    className="select select-bordered w-full"
                    value={triggerData.type}
                    name="triggerType"
                    onChange={(e) => {
                        const type = e.target.value as 'zone' | 'button';
                        setTriggerData(prev => ({ ...prev, type }));
                    }}
                >
                    <option value="button">Button</option>
                    <option value="zone">Zone</option>
                </select>
            </div>

            {
                triggerData.type === 'button' && (
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Button Label</span>
                        </label>
                        <input
                            type="text"
                            className="input input-bordered w-full"
                            placeholder="Enter button label"
                            name="buttonLabel"
                            value={triggerData.label || ''}
                            onChange={handleInputChange('buttonLabel')}
                        />
                    </div>
                )
            }

            <div className="form-control w-full">
                <label className="label">
                    <span className="label-text">Action Type</span>
                </label>
                <select
                    className="select select-bordered w-full"
                    value={actionData?.type  || 'link'}
                    name="actionType"
                    onChange={handleActionTypeChange}
                >
                    <option value="link">URL</option>
                    <option value="modal">Modal</option>
                </select>
            </div>

            {actionData?.type === 'link' && (
                <>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">URL</span>
                        </label>
                        <input
                            type="url"
                            className="input input-bordered w-full"
                            placeholder="https://example.com"
                            name="url"
                            value={actionData?.type === 'link' ? actionData.url : ''}
                            onChange={handleInputChange('url')}
                        />
                    </div>
                </>
            )}

            {actionData?.type === 'modal' && (
                <>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Modal Title</span>
                        </label>
                        <input
                            type="text"
                            name='modalTitle'
                            className="input input-bordered w-full"
                            placeholder="Enter modal title"
                            value={actionData?.type === 'modal' ? actionData.content.title : ''}
                            onChange={handleInputChange('modalTitle')}
                        />
                    </div>
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Modal Description</span>
                        </label>
                        <textarea
                            name='modalDescription'
                            className="textarea textarea-bordered w-full"
                            placeholder="Enter modal description"
                            value={actionData?.type === 'modal' ? actionData.content.body : ''}
                            onChange={handleInputChange('modalDescription')}
                        />
                    </div>
                </>
            )}


            <div>
                <label className="label">
                    <span className="label-text">Define Position</span>
                </label>
                <p className="text-sm text-gray-500 mb-2">Drag the {triggerData.type === 'zone' ? 'hotzone' : 'button'} to set the position.</p>
            </div>
            <div className='grid grid-cols-2 gap-1.5'>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Position X</span>
                    </label>
                    <input
                        type="number"
                        className="input input-bordered w-full"
                        placeholder="Enter position X"
                        name="positionX"
                        readOnly
                        value={triggerData.position?.x || 0 }
                    />
                </div>
                <div className="form-control w-full">
                    <label className="label">
                        <span className="label-text">Position Y</span>
                    </label>
                    <input
                        type="number"
                        className="input input-bordered w-full"
                        placeholder="Enter position Y"
                        name="positionY"
                        value={triggerData.position?.x || 0}
                        readOnly
                    />
                </div>
            </div>

            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <button type="submit" className="btn btn-primary w-full">
                Submit
            </button>
        </form>
    );
}