# Quiz System Requirements - InteractiBIO

## 📋 Project Overview
Develop an engaging quiz game system where teachers can create interactive biology quizzes and students can access them via class codes. The system will use Supabase for database management and authentication.

## 🔐 Authentication System

### Teachers:
- **Registration**: Email/password + social logins (Google, etc.)
- **Profile**: Teacher name only
- **Access**: Full dashboard to create and manage quizzes

### Students:
- **Access Method**: Enter class code only (no registration required)
- **No persistent accounts**: Session-based access per quiz

## 🗄️ Database Structure

### Organization:
- **Per Subject**: Each teacher creates subjects that contain multiple quiz games
- **Quiz Games**: Multiple games per subject
- **Progress Tracking**: Track student scores and progress through each quiz level
- **Class Codes**: Auto-generated codes for each subject/quiz

### Data to Track:
- Teacher profiles (name)
- Subjects created by teachers
- Quiz games within each subject
- Student attempt history and scores
- Progressive level completion

## 🎮 Quiz Game System

### Game Types:
- *To be discussed later*

### Teacher Creation Features:
- **Image Upload**: Teachers can upload images for questions
- **Question Bank**: Library of reusable questions
- **Progressive Levels**: Teachers create multi-level quizzes where students progress level by level (no difficulty settings, just sequential progression)
- **No Templates**: Teachers create from scratch

### Student Experience:
- **Scoring**: Students see scores after completing each level
- **No Leaderboards**: Individual progress only
- **No Hints**: Students answer without assistance
- **Individual Play**: No real-time multiplayer features
- **Progressive Completion**: Must complete levels in order

## 🏫 Class Code System

### Code Management:
- **Auto-Generated**: System creates unique codes automatically
- **Validity**: Codes remain active until teacher terminates the subject
- **Access Scope**: Each code gives access to specific quiz/subject only
- **No Expiration**: Only manual termination by teacher

## 🎨 Design & UX

### Visual Design:
- **Theme**: Same colorful, modern style as current InteractiBIO website
- **Consistent Branding**: Maintain current gradient backgrounds and card-based layouts
- **Age-Appropriate**: Same theme for all age groups

### Gamification:
- **No Badges/Achievements**: Simple scoring system only
- **Clean Interface**: Focus on learning, not game mechanics

## 📱 Platform Compatibility

### Primary Platform:
- **Desktop/Laptop**: Main target for classroom use
- **Responsive Design**: Must work on tablets and mobile phones
- **Cross-Browser**: Compatible with major browsers

## 🛠️ Technical Stack

### Backend:
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth (email/password + social)
- **Storage**: Supabase Storage (for question images)

### Frontend:
- **Framework**: React.js (existing)
- **Styling**: CSS with existing theme
- **State Management**: React hooks

## 🔄 Development Approach

### Implementation Strategy:
- **Incremental Development**: One function at a time
- **User Approval**: Get approval for each to-do list item before starting
- **Testing**: Test each feature thoroughly before moving to next

## 📝 Notes

- Quiz game types will be discussed in detail later
- Focus on core functionality first
- Maintain existing website aesthetic
- Ensure easy hosting and deployment with Supabase integration 