import "dotenv/config";
import express from "express";
import ViteExpress from "vite-express";
import multer from 'multer';
import { Interactive } from "./lib/interactives.js";
import { LinkAction, ModalAction, TriggerData } from "../common/types.js";
import { UploadAPIType } from "../common/api.type.js";
import path from "node:path";
import cors from 'cors';

const __dirname = process.cwd();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix+ path.extname(file.originalname))
  },
})
// Check file type
function checkFileType(file:Express.Multer.File, cb:any) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only! (jpeg, jpg, png, gif)');
  }
}
const upload = multer({
  storage: storage,
  limits: { fileSize: 25000000 }, // 25MB file size limit
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

const app = express();

app.use(cors());

app.get("/hello", (_, res) => {
  res.send("Hello Vite + React + TypeScript!");
});


const validateMetadata = (data: Partial<UploadAPIType>): string[] => {
  const errors: string[] = [];

  if (!data.type || (data.type !== 'link' && data.type !== 'modal')) {
    errors.push('Invalid or missing type.');
  }
  if (!data.trigger || (data.trigger.type !== 'button' && data.trigger.type !== 'zone')) {
    errors.push('Invalid or missing trigger type.');
  }
  if(data.trigger&& data.trigger.type === 'button' && (!data.trigger.label || typeof data.trigger.label !== 'string')) {
    errors.push('Missing or invalid button label.');
  }
  if(data.trigger?.type==='zone' && (typeof data.trigger.position !== 'object' || typeof data.trigger.position.x !== 'number' || typeof data.trigger.position.y !== 'number')) {
    errors.push('Missing or invalid zone position.');
  }
  if (data.type === 'link' && (!data.url || typeof data.url !== 'string')) {
    errors.push('Missing or invalid URL for link type.');
  }
  if (data.type === 'modal') {
    if (!data.content || typeof data.content.title !== 'string' || typeof data.content.body !== 'string') {
      errors.push('Missing or invalid content for modal type.');
    }
  }

  return errors;
}

app.post('/upload', upload.single('file'),async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const imageKey = req.file.path.split(path.sep).pop();

  if(!req.body.metadata) {
    return res.status(400).send('No metadata provided.');
  }

  let content;
  try{
    content = JSON.parse(req.body.metadata)
  }catch(err){
    return  res.status(400).send('Invalid metadata format.');
  }

  const contentTyped = content as UploadAPIType


  const validateErrors  =validateMetadata(contentTyped);
  if(validateErrors.length > 0){
    return res.status(400).json({errors: validateErrors});
  };

  const oldInteractive = await Interactive.getByStore('default_store');
  if(oldInteractive){

    const action = {
          type: (contentTyped.type === 'link' ? 'link' : 'modal') as 'link' | 'modal',
          ...(contentTyped.type === 'link' ? { url: contentTyped.url || '' } : {}),
          ...(contentTyped.type === 'modal' ? { content: contentTyped.content || { title: '', body: '' } } : {})
        } as LinkAction | ModalAction;

    const updated = await oldInteractive.update({
      image: imageKey!,
      metadata: {
        trigger: contentTyped.trigger,
        action 
      }
    })

    if(updated){
      console.log('Updated existing Interactive with ID:', oldInteractive.id);
      return res.json({message: `File ${req.file.originalname} uploaded and Interactive updated successfully.`});
    }
  }
  const action = {
          type: (contentTyped.type === 'link' ? 'link' : 'modal') as 'link' | 'modal',
          ...(contentTyped.type === 'link' ? { url: contentTyped.url || '' } : {}),
          ...(contentTyped.type === 'modal' ? { content: contentTyped.content || { title: '', body: '' } } : {})
        } as LinkAction | ModalAction;

  const newInteractive = await Interactive.create({
    store_id: 'default_store',
    image: imageKey!,
    metadata: {
        trigger: contentTyped.trigger,
        action 
      }
  })

  console.log('Created new Interactive with ID:', newInteractive.id);

  res.json({message: `File ${req.file.originalname} uploaded successfully.`});
});

app.use('/images', express.static(path.join(__dirname, 'uploads')));

app.post("/log", express.json(), (req, res) => {
  console.log('Client log:', req.body);
  res.sendStatus(200);
});

app.get("/store/:storeId", async (req, res) => {
  if(!req.params.storeId){
    return res.status(400).send('No storeId provided');
  }

  const item = await Interactive.getByStore(req.params.storeId);
  if(item){

    delete item.id // tiny security measure to not expose internal IDs

    res.json(item);
  }else{
    res.status(404).send('Item not found');
  }
})

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
