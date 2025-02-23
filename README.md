# EJ Fox Nuxt 3 Starter

[![Netlify Status](https://api.netlify.com/api/v1/badges/981b9e46-6878-4ddb-a716-2713c5f3e412/deploy-status)](https://app.netlify.com/sites/ejfox-nuxt-template/deploys)

## Database Schema

### Posts Table
```sql
create table zackposts (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  phone_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table zackposts enable row level security;

-- Create a policy that allows all operations for now
create policy "Allow all operations" on zackposts
  for all
  using (true)
  with check (true);
```

This minimalist schema provides:
- `id`: Unique identifier for each post
- `content`: The main text content of the post
- `phone_number`: The Twilio number that sent the message (optional)
- `created_at`: Timestamp of when the post was created
- `updated_at`: Timestamp of last modification

Row Level Security (RLS) is enabled by default with a permissive policy. You may want to restrict this in production.

## Environment Setup

Create a `.env` file with the following variables:
```bash
# Twilio (required for SMS endpoint)
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_ACCOUNT_SID=your_account_sid_here
```

## Usage
`npx room302-template`

Deployed through a small script that handles naming, cloning, and setting up the repo for prototyping. <https://www.npmjs.com/package/room302-template>

## What's different from the standard Nuxt 3 starter?
- VueUse 🔧 
- Vueuse motion 🌈 
- OpenAI plugin 🧠 
- Pinia store 🏬 
- Helpers file 🔨 
- Google fonts 🖋️ 

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# yarn
yarn dev
```

## Production

Build the application for production:

```bash
# yarn
yarn build
```

Locally preview production build:

```bash
# yarn
yarn preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.