# Taskly

A modern, full-stack task management application with AI-powered features to help teams organize and complete projects efficiently.

## ✨ Features

### Project Management
- **Kanban Board Interface** - Visualize your workflow with drag-and-drop task cards across different status columns (Urgent, Ongoing, Completed)
- **Project Dashboard** - Individual project views with comprehensive task tracking
- **Projects Overview** - Manage multiple projects from a centralized hub

### Task Organization
- **Smart Tagging System** - Categorize tasks with custom tags (Backend, Frontend, Testing, Design, Documentation, DevOps, Database)
- **Status Management** - Track task progress through customizable status workflows
- **Detailed Task Information** - Add names, titles, and descriptions to keep tasks clear and actionable

### AI-Powered Features
- **AI Task Generation** - Automatically generate comprehensive task lists based on project descriptions
- **AI Project Summaries** - Get intelligent insights, recommendations, and potential challenges for your projects
- **Smart Recommendations** - Receive actionable advice to improve project outcomes

### User Experience
- **Dark/Light Theme** - Toggle between themes for comfortable viewing in any environment
- **Responsive Design** - Seamlessly works across desktop, tablet, and mobile devices
- **Modern UI** - Built with shadcn/ui components for a polished, professional interface

### Collaboration & Export
- **Markdown Export** - Export project data and tasks in markdown format
- **User Authentication** - Secure login and signup system
- **Multi-user Support** - Team members can collaborate on shared projects

## 🛠️ Technology Stack

### Frontend
- **React** - Modern UI library
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **Prisma ORM** - Type-safe database client
- **PostgreSQL** - Relational database
- **JWT** - Secure authentication
- **bcrypt** - Password hashing

### AI Integration
- **Perplexity AI** - Advanced language model for task generation and insights

## 📁 Project Structure

```
taskly/
├── Frontend/
│   └── Taskly/
│       ├── src/
│       │   ├── components/    # React components
│       │   ├── auth/          # Authentication pages
│       │   ├── context/       # React context providers
│       │   └── hooks/         # Custom React hooks
│       └── public/            # Static assets
│
└── Backend/
    └── Taskly-Backend/
        ├── src/
        │   ├── Controllers/   # Business logic
        │   ├── Routes/        # API endpoints
        │   ├── middleware/    # Authentication & validation
        │   └── config/        # Database configuration
        └── prisma/            # Database schema & migrations
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- Perplexity API key (for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taskly
   ```

2. **Set up the Backend**
   ```bash
   cd Backend/Taskly-Backend
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the Backend directory with:
   - Database connection URL
   - JWT secret
   - Perplexity API key
   - Port configuration

4. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

5. **Set up the Frontend**
   ```bash
   cd Frontend/Taskly
   npm install
   ```

6. **Start the application**
   
   Backend:
   ```bash
   cd Backend/Taskly-Backend
   npm run dev
   ```
   
   Frontend:
   ```bash
   cd Frontend/Taskly
   npm run dev
   ```

## 📝 Usage

1. **Create an Account** - Sign up with your email and password
2. **Create a Project** - Add a new project with a name and description
3. **Add Tasks** - Manually add tasks or use AI to generate them automatically
4. **Organize** - Drag and drop tasks between status columns
5. **Tag & Categorize** - Apply tags to organize tasks by type
6. **Get AI Insights** - Generate AI-powered summaries for project guidance
7. **Export** - Download your project data in markdown format

## 🎨 Key Features in Detail

### AI Task Generation
Simply provide a project name and description, and let AI generate a comprehensive list of actionable tasks covering backend, frontend, testing, design, and documentation needs.

### Kanban Board
Intuitive drag-and-drop interface to move tasks between status columns. Visual overview of project progress at a glance.

### Smart Tagging
Organize tasks with predefined tags or create custom categories. Filter and search tasks by tags for quick access.

### Theme Customization
Switch between light and dark modes to match your preference and reduce eye strain during extended work sessions.

## 🔒 Security

- Passwords are securely hashed using bcrypt
- JWT-based authentication for protected routes
- Environment variables for sensitive configuration
- Input validation and sanitization

## 📄 License

This project is private and proprietary.

## 🤝 Contributing

This is a private project. Contributions are limited to authorized team members.

---

Built with ❤️ using modern web technologies
