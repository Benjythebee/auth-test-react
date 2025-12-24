import { TriggerData } from "./types.js";

export type UploadAPIType =  {
    type: 'link' | 'modal';
    url?: string;
    content?: {
      title: string;
      body: string;
    }
    trigger:TriggerData
  };