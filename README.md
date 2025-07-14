# Alistair's Portfolio Website

A modern, minimalist, and responsive portfolio website built with Next.js and TypeScript. Features a clean design, interactive UK map with location pins, and an AI chatbot assistant.

## Key Features

- **Responsive Design**: Adapts to all screen sizes using Tailwind CSS
- **Interactive UK Map**: Custom SVG-based map with location pins for work experience
- **Dark/Light Mode**: Theme switching with Tailwind CSS
- **AI Chatbot**: Interactive assistant to help visitors navigate the site
- **Accessible UI**: Semantic HTML and ARIA attributes for better accessibility
- **Type Safety**: Full TypeScript integration

## Sections

- **Home**: Introduction and quick navigation
- **About**: Personal bio and background
- **Skills**: Technical skills categorized by area
- **Experience**: Work history with interactive UK map
- **Education**: Academic background and certifications
- **Projects**: Showcase of notable projects
- **Contact**: Social links and contact information

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React hooks
- **Data**: JSON/YAML data files with typed loaders
- **Deployment**: Vercel

## Project Structure

```
/src
  /app             # Next.js App Router pages
  /components      # Reusable UI components
    /chat          # Chatbot components
    /layout        # Layout components (Header, Footer)
    /maps          # UK map implementation
    /sections      # Main site sections
  /hooks           # Custom React hooks
  /styles          # Global styles
  /types           # TypeScript type definitions
  /utils           # Helper functions
/data              # JSON/YAML data files
/public            # Static assets
```

## Data Architecture

Content is stored in JSON files under `/data` and loaded via typed hooks:

- `profile.json`: Personal info, skills, experience, education
- `projects.json`: Project details and metadata

## Getting Started

1. **Install dependencies**:

```bash
npm install
```

2. **Run development server**:

```bash
npm run dev
```

3. **Open in browser**:
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Key Components

- **LocationMap**: Custom UK map with interactive pins for experience locations
- **ChatWindow**: AI assistant interface with message threading and quick replies
- **Section Components**: Modular sections for different parts of the portfolio

## Development Notes

- CSS uses utility-first approach with Tailwind
- Dark mode toggle uses CSS class strategy
- React Server Components used where possible for better performance
- Client Components marked with 'use client' directive

## Deployment

The site is configured for deployment on Vercel:

```bash
npm run build
```

## License

All rights reserved.
