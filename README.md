# Pizza Management Frontend

A modern, responsive web application for managing a pizza business, built with Next.js 14, TypeScript, Tailwind CSS, and Shadcn/ui components.

## Features

- 📊 Interactive Dashboard with Key Metrics
- 🍕 Item Management (Pizza & Other Products)
- 📝 Invoice Generation and Management
- 📱 Responsive Design for All Devices
- 🎨 Modern UI with Shadcn/ui Components
- 🌙 Light/Dark Mode Support

## Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm package manager
- Backend API running (see backend README)

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd pizza
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Configure environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080  # Backend API URL
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Development

### Project Structure
```
pizza/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   │   ├── ui/             # Shadcn/ui components
│   │   ├── dashboard/      # Dashboard components
│   │   ├── invoice-management/
│   │   └── item-management/
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── styles/             # Global styles
├── public/                 # Static assets
└── ...config files
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Code Style

This project uses:
- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

To maintain consistent code style:
```bash
# Run ESLint
npm run lint

# Run type checking
npm run type-check
```

### Testing

Run the test suite:
```bash
npm run test
# or
yarn test
# or
pnpm test
```

### Building for Production

1. Build the application:
```bash
npm run build
# or
yarn build
# or
pnpm build
```

2. Start the production server:
```bash
npm run start
# or
yarn start
# or
pnpm start
```

## Deployment

### Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to a Git repository
2. Import your project to Vercel
3. Configure environment variables
4. Deploy!

### Other Platforms

For other platforms, ensure you:
1. Set up environment variables
2. Run the build command
3. Start the production server
4. Configure your reverse proxy (if needed)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Ensure Node.js version is 18.17 or later
   - Clear `.next` directory and node_modules
   - Reinstall dependencies

2. **API Connection Issues**
   - Verify backend is running
   - Check NEXT_PUBLIC_API_URL in .env.local
   - Ensure CORS is configured on backend

3. **Type Errors**
   - Run `npm run type-check`
   - Update TypeScript version if needed
   - Check for missing type definitions

For more help, check the [Next.js documentation](https://nextjs.org/docs) or open an issue.
