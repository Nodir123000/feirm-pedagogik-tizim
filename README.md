# FEIRM Pedagogik Tizim

Flexible Educational Individual Reflective Module - Pedagogical System

## Overview

FEIRM is a modern educational platform designed to support personalized learning trajectories, competency-based assessment, and reflective learning practices. The system integrates with Base44 backend for data management.

## Features

- 🎓 **Student Management** - Track student progress, competencies, and learning trajectories
- 📚 **Learning Modules** - Multilingual course content (Uzbek Latin, Uzbek Cyrillic, Russian)
- 🎮 **Simulations** - Industry-relevant scenarios for practical skill development
- 📊 **Assessment System** - Competency-based evaluations with detailed feedback
- 💭 **Reflections** - Student self-assessment and reflective learning tools
- 🗺️ **Learning Trajectories** - AI-powered personalized learning paths
- 👨‍🏫 **Facilitator Tools** - Instructor dashboard and student monitoring
- 📈 **Analytics** - MPMS monitoring and progress tracking

## Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Recharts
- **Backend**: Base44 API
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The application will be available at `http://localhost:3000`

## Project Structure

```text
FEIRM Pedagogik tizim/
├── entities/          # Base44 API entity modules
│   ├── Student.js
│   ├── LearningModule.js
│   ├── Assessment.js
│   └── ...
├── src/
│   ├── components/    # Reusable UI components
│   ├── pages/         # Page components
│   ├── lib/           # Utility functions
│   ├── hooks/         # Custom React hooks
│   ├── App.jsx        # Main app component
│   └── main.jsx       # Entry point
└── package.json
```

## API Configuration

The system uses Base44 API for backend operations. All entity modules are located in the `entities/` folder and include full CRUD operations.

**API Endpoint**: `https://app.base44.com/api/apps/697db3b64fe8b128f9743887/entities/`

## Available Pages

- `/` - Dashboard with system overview
- `/students` - Student management
- `/modules` - Learning modules catalog
- `/simulations` - Simulation scenarios
- `/portfolio` - Student portfolios
- `/reflections` - Student reflections
- `/trajectories` - Learning trajectories
- `/facilitators` - Facilitator management
- `/monitoring` - MPMS monitoring panel
- `/sbcm` - SBCM integration
- `/content-generator` - AI content generator

## Development

```bash
# Run linter
npm run lint

# Format code
npm run format
```

## License

Proprietary - FEIRM Pedagogik Tizim

## Support

For technical support or questions, please contact the development team.
