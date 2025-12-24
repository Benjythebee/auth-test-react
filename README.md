# Interactive Image Web App

A full-stack TypeScript application for creating interactive images with draggable triggers that can open links or modals.

<img width="1427" height="875" alt="image" src="https://github.com/user-attachments/assets/3739bf2a-de1f-428f-9554-1507a87ddeb1" />


## Features

- Upload images and create interactive hotspots
- Draggable zones and buttons on images
- Link and modal actions for interactive elements
- PostgreSQL database storage
- React frontend with Tailwind CSS and DaisyUI

## Tech Stack

**Frontend:**
- React 19 with TypeScript
- Vite for build tooling
- Tailwind CSS + DaisyUI for styling
- React Draggable for interactive elements

**Backend:**
- Express.js server
- Multer for file uploads
- PostgreSQL database
- Vite-Express for SSR integration

**Android Terminal App**
- Expo react native
- [Find the app repo here](https://github.com/Benjythebee/authi-expo-react)

## Design notes:

I'm using vite and vite-express for probably the fastest development possible.
It allows me to have a quick draft ready and get things going easily.

For saving data I'm using postgres (locally) and I have a very simple table called "Interactives".
Note that the table "interactives" has a "store_id" column which would then be the store_id as a foreign key. At the moment I'm just hardcoding "default_store" as a store_id.
I have not indexed the table yet.

A more realistic approach would be to have a table for linking EFTPOS serial number to specific store_id or brand_id and then on start of the app, fetch the appropriate data depending on a lot more than just store_id.


## Setup

1. Install dependencies:
```bash
pnpm install
#or
npm install
```

2. Set up PostgreSQL database and run migration:
```sql
-- See src/server/lib/migration.sql
```

3. Configure environment variables in `.env`
```
#this is the only env you need;
DATABASE_URL=<> 
```

4. Start development server:
```bash
pnpm dev
```

5. Build for production:
```bash
pnpm build
pnpm start
```

## Project Structure

```
src/
├── client/          # React frontend
│   ├── components/  # React components
│   └── context/     # React context providers
├── server/          # Express backend
│   └── lib/         # Database and utilities
└── common/          # Shared types and APIs
```


## AI disclaimer

I've used AI to generate components or contexts that I think are super repetitive or time consuming.

For example the following prompts:

```sh
PROMPT: generate a simple react context layout that handles my form information in form.tsx

# Generated a simple context which I then modified
```

```sh
PROMPT: Using tailwindcss and daisyUI, generate a simple UI split in two vertically, the left is a form and the right is a div with a strict ratio of height = 2.16 * width
```
if you ask yourself why the ratio is "2.16", it's because I quickly looked up the ratio of a Samsung S22.
