# Receipt API Frontend Application

## Overview

This is a React-based frontend application for querying and displaying receipt data. The application provides a search interface for users to look up receipts by reference code and displays the results in a thermal receipt format. It communicates directly with a Google Apps Script API to fetch receipt information including seller details, buyer details, and itemized lists with withholding tax calculations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**React SPA with TypeScript**: The application is built as a Single Page Application using React 18 with TypeScript for type safety. It uses Vite as the build tool and development server, providing fast hot reload and modern JavaScript features.

**Component-Based Design**: The UI follows a component-based architecture using shadcn/ui components built on top of Radix UI primitives. This provides accessible, customizable components with consistent styling through Tailwind CSS.

**Client-Side Routing**: Uses Wouter for lightweight client-side routing, handling navigation between the search page and receipt display page.

**State Management**: Implements React Query (TanStack Query) for server state management, providing caching, background updates, and error handling for API calls. Local component state is managed with React hooks.

### Data Layer

**Schema Validation**: Uses Zod schemas for runtime type validation of API responses and form inputs. This ensures data integrity and provides clear error messages for invalid data.

**Direct API Integration**: The frontend communicates directly with the Google Apps Script API, bypassing the backend for receipt data. This simplifies the architecture but couples the frontend to the external API.

**Form Handling**: Implements React Hook Form with Zod validation for user input handling, providing real-time validation and error display.

### Styling and UI

**Tailwind CSS**: Uses Tailwind CSS for utility-first styling with CSS custom properties for theme consistency. The design system includes both light and dark mode support.

**Design System**: Implements a comprehensive design system using shadcn/ui components, ensuring visual consistency across the application. Components are customizable through CSS variables and class variance authority.

**Responsive Design**: Mobile-first responsive design ensures the application works well on all device sizes, particularly important for a receipt viewing application.

### Backend Architecture

**Express.js Server**: Minimal Express.js server primarily serves the React application and provides a health check endpoint. The actual receipt data processing is handled by the external Google Apps Script API.

**Static File Serving**: In production, the server serves the built React application as static files. In development, it integrates with Vite for hot module replacement.

**Development Setup**: Uses tsx for TypeScript execution in development and esbuild for production builds, providing fast compilation and startup times.

### Build and Deployment

**Vite Build System**: Uses Vite for fast development builds and optimized production bundles. The build process generates static assets that can be served by the Express server.

**TypeScript Configuration**: Configured with strict TypeScript settings for type safety, including path mapping for clean imports and proper module resolution.

**Development Experience**: Includes Replit-specific plugins for runtime error handling and code mapping when running in the Replit environment.

## External Dependencies

### Core Framework Dependencies
- **React 18**: Frontend framework for building the user interface
- **TypeScript**: Type safety and developer experience
- **Vite**: Build tool and development server
- **Express.js**: Backend server for serving the application

### UI and Styling
- **shadcn/ui + Radix UI**: Comprehensive component library built on accessible primitives
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography

### Data Management
- **TanStack React Query**: Server state management, caching, and synchronization
- **React Hook Form**: Form handling and validation
- **Zod**: Runtime schema validation and type inference

### External API
- **Google Apps Script API**: Receipt data storage and retrieval system
  - Base URL: Google Apps Script web app endpoint
  - Authentication: Token-based authentication
  - Data Structure: Two-sheet system (Info and Item sheets) in Google Sheets

### Development Tools
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **@replit/vite-plugin-cartographer**: Code mapping for Replit environment
- **PostCSS + Autoprefixer**: CSS processing and vendor prefixing

### Utility Libraries
- **class-variance-authority**: Component variant management
- **clsx**: Conditional className utility
- **date-fns**: Date formatting and manipulation
- **wouter**: Lightweight client-side routing