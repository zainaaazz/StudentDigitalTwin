# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend Commands
```bash
cd backend
npm run dev       # Start development server with hot reload
npm run build     # Compile TypeScript to dist/
npm run start     # Run compiled production build
npm run test      # Run Jest tests
npm run test:watch # Run tests in watch mode
npm run db:seed   # Seed database with sample data
```

### Frontend Commands
```bash
cd frontend
npm start         # Start React development server
npm run build     # Build for production
npm test          # Run Jest tests
```

### Docker Commands
```bash
docker-compose up    # Start all services (MongoDB, backend, frontend)
docker-compose down  # Stop all services
```

## Project Architecture

### Core Structure
This is a Student Digital Twin (SDT) Interaction Data Simulator with:

- **Backend**: Node.js/Express/TypeScript API server with MongoDB
- **Frontend**: React/TypeScript dashboard with Material-UI
- **Shared Types**: Common TypeScript interfaces in `/shared/types.ts`
- **Docker**: Multi-container setup with MongoDB, backend, and frontend

### Key Components

#### Backend Architecture (`backend/src/`)
- **SimulationEngine** (`services/SimulationEngine.ts`): Core simulation logic generating realistic student interactions
- **Models** (`models/`): Mongoose schemas for Student, Session, Interaction, EngagementMetrics
- **Routes** (`routes/`): API endpoints for simulation control and SDT integration
- **Controllers** (`controllers/`): Request handlers for simulation and SDT operations
- **Database** (`database/connection.ts`): MongoDB connection management

#### Frontend Architecture (`frontend/src/`)
- **Dashboard** (`components/Dashboard.tsx`): Main overview with statistics and system status
- **SimulationControl** (`components/SimulationControl.tsx`): Interface for starting/configuring simulations
- **StudentMonitor** (`components/StudentMonitor.tsx`): Individual student tracking and risk assessment
- **NetworkAnalysis** (`components/NetworkAnalysis.tsx`): Social network visualization and metrics
- **StudentLookup** (`components/StudentLookup.tsx`): Student search and dashboard access interface
- **StudentDashboard** (`components/StudentDashboard.tsx`): Individual student detailed dashboard with engagement metrics, trends, and statistics
- **StudentDashboardWrapper** (`components/StudentDashboardWrapper.tsx`): Wrapper component for student dashboard routing
- **InteractionTimeline** (`components/InteractionTimeline.tsx`): Detailed timeline view of student interactions with filtering and pagination
- **InteractionTimelineWrapper** (`components/InteractionTimelineWrapper.tsx`): Wrapper component for interaction timeline routing

### Data Flow
1. Frontend triggers simulation via `/api/simulate/session`
2. SimulationEngine generates student profiles and interaction events
3. Network metrics calculated from interactions (centrality, clustering, density)
4. Engagement metrics computed per student (risk scores, trends)
5. Results stored in MongoDB and displayed in real-time dashboard
6. Individual student dashboards fetch comprehensive data via `/api/sdt/student/{id}/dashboard`
7. Interaction timelines provide detailed historical data with filtering and pagination

### Individual Student Dashboard Features
- **Student Profile Overview**: Academic level, major, GPA, risk level, personality type
- **Real-time Metrics**: Weekly engagement, network centrality, participation trends
- **Engagement Analytics**: Interactive charts showing engagement and collaboration trends over time
- **Interaction Statistics**: Total interactions, average duration, top partners, session counts
- **Interaction Type Distribution**: Visual breakdown of discussion, collaboration, social, and help-seeking interactions
- **Navigation Links**: Seamless navigation to detailed interaction timeline
- **Responsive Design**: Mobile-friendly Material-UI components with proper theming

### Core Simulation Algorithm
- **Personality-based interactions**: Extroverts/introverts have different interaction probabilities
- **Context-sensitive**: Different session types (lecture/lab/group-work) affect interaction patterns
- **Academic correlation**: Students with similar GPA more likely to interact
- **Risk assessment**: Combines GPA, participation, and social isolation metrics

### TypeScript Path Aliases
Both frontend and backend use path aliases:
- `@/*` maps to `src/*`
- `@/shared/*` maps to `../shared/*`

### Environment Configuration
- Backend: `.env` with MongoDB URI, JWT secrets, CORS settings
- Frontend: `.env` with API base URL and WebSocket URL
- Docker: Uses production-ready environment variables

### Database Collections
MongoDB collections: `students`, `sessions`, `interactions`, `engagement_metrics`

### API Endpoints
- `POST /api/simulate/session`: Generate new simulation
- `GET /api/sessions/{id}`: Retrieve session data
- `GET /api/students/{id}/engagement/{sessionId}`: Get student metrics
- `GET /api/sdt/student/{studentId}/dashboard`: Get comprehensive student dashboard data
- `GET /api/sdt/student/{studentId}/interactions`: Get detailed interaction timeline with filtering
- WebSocket at root for real-time updates

### Testing
- Backend: Jest with ts-jest for TypeScript support
- Frontend: Jest with React Testing Library (via Create React App)

### Key Development Notes
- Uses strict TypeScript configuration
- MongoDB connection managed through dedicated service
- WebSocket integration for real-time simulation updates
- Material-UI theming with custom color palette
- Docker multi-stage builds for production deployment