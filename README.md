# SkyRoute - Flight Booking Application

A modern, feature-rich flight booking application built with Next.js, React, and TypeScript. Experience seamless travel booking with an intuitive interface, secure authentication, and integrated payment processing.

## ✨ Features

- **🔐 User Authentication** - Simple and secure login system with Redux state management
- **✈️ Flight Search & Booking** - Search flights between major Indian cities with real-time availability
- **💳 Payment Integration** - Stripe integration for secure payment processing
- **🪪 Seat Selection** - Interactive seat selection interface with visual seat map
- **📱 Responsive Design** - Fully responsive UI that works seamlessly on all devices
- **🎨 Modern UI/UX** - Built with Tailwind CSS, Radix UI components, and Lucide icons
- **⚡ Performance Optimized** - Lazy loading, code splitting, and optimized images
- **🎯 Popular Destinations** - Quick access to trending flight routes
- **📋 Booking Management** - View and manage your flight bookings
- **🎫 Digital Tickets** - Generate and view flight tickets with QR codes

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **Lucide React** - Beautiful icon library

### State Management
- **Redux Toolkit** - State management
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

### Payment & Authentication
- **Stripe** - Payment processing
- **Custom Auth** - Simple authentication system

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Flight_booking
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Add your Stripe keys and other environment variables:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
STRIPE_SECRET_KEY=your_secret_key
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication page
│   ├── bookings/          # Booking management
│   ├── api/               # API routes
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── auth/              # Authentication components
│   ├── ui/                # UI components (shadcn/ui)
│   ├── booking-form.tsx   # Flight booking form
│   ├── checkout-form.tsx  # Payment checkout
│   ├── header.tsx         # Navigation header
│   ├── seat-selection.tsx # Seat selection interface
│   └── ticket.tsx         # Flight ticket component
├── lib/                   # Utility libraries
│   ├── data.ts            # Mock flight data
│   └── placeholder-images.ts # Image assets
└── store/                 # Redux store
    ├── slices/            # Redux slices
    ├── provider.tsx       # Redux provider
    └── store.ts           # Store configuration
```

## 🎯 Available Routes

- **/** - Home page with flight search
- **/auth** - Login/authentication page
- **/bookings** - View and manage bookings
- **/flights** - Flight status information

## ✈️ Supported Destinations

The application supports flights between major Indian cities:

- New Delhi (DEL)
- Mumbai (BOM)
- Bengaluru (BLR)
- Chennai (MAA)
- Kolkata (CCU)
- Hyderabad (HYD)
- Pune (PNQ)
- Ahmedabad (AMD)
- Goa (GOI)
- Kochi (COK)

## 💻 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Quality

The project uses ESLint for code quality and consistency. Run the linter before committing:

```bash
npm run lint
```

## 🚀 Deployment

### Vercel (Recommended)

The easiest way to deploy is using [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme):

1. Connect your GitHub repository
2. Configure environment variables
3. Deploy automatically

### Other Platforms

```bash
npm run build
npm run start
```

Check out [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or need help, please:

1. Check the [documentation](https://nextjs.org/docs)
2. Search existing [GitHub issues](https://github.com/vercel/next.js/issues)
3. Create a new issue with detailed information

## 🌟 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## Demo

- Demo video [click here](https://drive.google.com/file/d/1phZOq27gLyh4DU0OJSpUJmydznUxbhGm/view?usp=sharing)

---

**SkyRoute** - Your journey, our passion. ✈️
