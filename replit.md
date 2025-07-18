# Kideuss Optimizer - Windows PC Optimization Tool

## Overview

This is a full-stack web application for Windows PC optimization, built with React (frontend) and Express (backend). The application provides a user-friendly interface for executing system optimization scripts with real-time monitoring and feedback. It features a modern dark theme UI with comprehensive system metrics tracking and script execution capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints for script execution and system monitoring
- **Script Execution**: Child process execution for Windows optimization scripts (.bat, .reg, .exe files)
- **Error Handling**: Centralized error handling middleware
- **Development**: Hot reload with Vite integration in development mode

## Key Components

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL support
- **Database**: Configured for Neon Database (serverless PostgreSQL)
- **Schema**: Defined in shared/schema.ts with optimization logs and system metrics tables
- **Storage Abstraction**: IStorage interface with in-memory implementation for development

### UI Components
- **Dashboard**: Main interface with system stats, optimization cards, and activity log
- **System Stats**: Real-time CPU, memory, network, and optimization score monitoring
- **Optimization Cards**: Categorized script execution with batch operations
- **Modals**: Loading states and result feedback for user interactions
- **Sidebar**: Navigation and branding elements

### Script Management
- **Categories**: Safety, FPS boost, system optimization, network optimization
- **Execution**: Individual script execution and batch processing
- **File Types**: Support for .bat, .reg, and .exe files
- **Safety Features**: System restore point creation before optimization

## Data Flow

1. **User Interaction**: User selects optimization scripts through the React frontend
2. **API Request**: Frontend sends POST requests to `/api/scripts/execute` endpoint
3. **Script Execution**: Backend locates and executes Windows scripts using child processes
4. **Logging**: Execution results are stored in optimization logs table
5. **Real-time Updates**: Frontend polls for system metrics and recent activity
6. **User Feedback**: Results displayed through modals and activity log components

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React with extensive Radix UI component library
- **Styling**: Tailwind CSS with class-variance-authority for component variants
- **Data Fetching**: TanStack Query for caching and synchronization
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for time formatting

### Backend Dependencies
- **Database**: Drizzle ORM with Neon Database serverless PostgreSQL
- **Validation**: Zod for runtime type checking and schema validation
- **Process Management**: Node.js child_process for script execution
- **Session Management**: PostgreSQL session store with connect-pg-simple

### Development Tools
- **Build System**: Vite with React plugin and TypeScript support
- **Development Enhancements**: Replit-specific plugins for error handling and cartography
- **Code Quality**: TypeScript strict mode with comprehensive type checking

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React application to `dist/public` directory
- **Backend**: esbuild bundles Express server with external packages to `dist` directory
- **Assets**: Static files and scripts stored in `attached_assets` directory

### Production Configuration
- **Server**: Express serves both API endpoints and static frontend files
- **Environment**: Production mode with optimized builds and error handling
- **Database**: PostgreSQL connection via DATABASE_URL environment variable

### Development Workflow
- **Hot Reload**: Vite development server with HMR for React components
- **API Proxy**: Development server proxies API requests to Express backend
- **Script Execution**: Cross-platform compatibility considerations for Windows script execution

### Security Considerations
- **Script Validation**: File extension and path validation before execution
- **Error Isolation**: Proper error handling to prevent system crashes
- **User Safety**: System restore point creation before applying optimizations
- **Input Sanitization**: Zod schema validation for all API inputs