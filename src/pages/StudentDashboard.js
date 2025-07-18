import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getCurrentUser, 
  getStudentByUserId, 
  signOut, 
  getSubjectByClassCode,
  getStudentProgress,
  getStudentOverallStats,
  enrollStudentInClass,
  getStudentEnrollments,
  isStudentEnrolledInClass
} from '../lib/supabase';
import './StudentDashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Logo from '../components/Logo';
import { 
  faMicroscope, 
  faHandWave, 
  faSignOutAlt, 
  faClock, 
  faStar, 
  faBullseye, 
  faBookOpen, 
  faArrowTrendUp, 
  faChalkboardTeacher, 
  faGamepad,
  faPlus,
  faCalendar,
  faHandPaper
} from '@fortawesome/free-solid-svg-icons';

const StudentDashboard = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progressData, setProgressData] = useState([]);
  const [overallStats, setOverallStats] = useState(null);
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [classCode, setClassCode] = useState('');
  const [joiningClass, setJoiningClass] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [joinSuccess, setJoinSuccess] = useState('');
  const navigate = useNavigate();

  const loadUserData = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        navigate('/student/auth');
        return;
      }
      
      const { data: studentData } = await getStudentByUserId(currentUser.id);
      if (!studentData) {
        navigate('/student/auth');
        return;
      }
      
      setStudent(studentData);
      
      // Load progress data and overall stats
      const [progressResult, statsResult] = await Promise.all([
        getStudentProgress(studentData.id),
        getStudentOverallStats(studentData.id)
      ]);
      
      setProgressData(progressResult.data || []);
      setOverallStats(statsResult.data || {});
      
      // Load enrolled classes
      const { data: enrollments } = await getStudentEnrollments(studentData.id);
      if (enrollments) {
        setEnrolledClasses(enrollments);
      }

    } catch (error) {
      console.error('Error loading user data:', error);
      navigate('/student/auth');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleJoinClass = async (e) => {
    e.preventDefault();
    if (!classCode.trim()) return;

    setJoiningClass(true);
    setJoinError('');
    setJoinSuccess('');

    try {
      const { data: subject, error } = await getSubjectByClassCode(classCode);
      if (error || !subject) {
        setJoinError('Invalid class code. Please check and try again.');
        setJoiningClass(false);
        return;
      }

      // Check if already enrolled
      const { data: existingEnrollment } = await isStudentEnrolledInClass(student.id, subject.id);
      if (existingEnrollment) {
        setJoinError('You are already enrolled in this class.');
        setJoiningClass(false);
        return;
      }

      // Enroll the student in the class
      const { data: enrollment, error: enrollError } = await enrollStudentInClass(student.id, subject.id);
      if (enrollError) {
        setJoinError('Failed to join class. Please try again.');
        setJoiningClass(false);
        return;
      }

      setJoinSuccess(`Successfully joined class: ${subject.title}`);
      setClassCode('');
      
      // Refresh enrolled classes
      const { data: enrollments } = await getStudentEnrollments(student.id);
      if (enrollments) {
        setEnrolledClasses(enrollments);
      }

      // Navigate to the subject with student info after a short delay
      setTimeout(() => {
        navigate(`/quiz/${subject.id}`, { 
          state: { 
            studentName: student.full_name, 
            subject,
            studentId: student.id
          } 
        });
      }, 1500);

    } catch (error) {
      setJoinError('Something went wrong. Please try again.');
    } finally {
      setJoiningClass(false);
    }
  };

  const formatTimeSpent = (seconds) => {
    if (!seconds) return '0m';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getUniqueSubjects = () => {
    const subjectMap = new Map();
    
    // Add enrolled classes first
    enrolledClasses.forEach(enrollment => {
      if (enrollment.subjects) {
        const subjectKey = enrollment.subjects.class_code;
        subjectMap.set(subjectKey, {
          ...enrollment.subjects,
          id: enrollment.subject_id,
          enrolledAt: enrollment.enrolled_at,
          totalAttempts: 0,
          bestScore: 0,
          lastAttempt: null
        });
      }
    });
    
    // Add progress data to enrolled classes
    progressData.forEach(progress => {
      if (progress.subjects) {
        const subjectKey = progress.subjects.class_code;
        if (subjectMap.has(subjectKey)) {
          const existing = subjectMap.get(subjectKey);
          existing.totalAttempts++;
          existing.bestScore = Math.max(existing.bestScore, progress.score);
          if (!existing.lastAttempt || new Date(progress.completed_at) > new Date(existing.lastAttempt)) {
            existing.lastAttempt = progress.completed_at;
          }
        } else {
          // This handles old progress data for classes no longer enrolled
          subjectMap.set(subjectKey, {
            ...progress.subjects,
            id: progress.subject_id,
            lastAttempt: progress.completed_at,
            totalAttempts: 1,
            bestScore: progress.score
          });
        }
      }
    });
    
    return Array.from(subjectMap.values());
  };

  if (loading) {
    return <div className="dashboard-loading">Loading your dashboard...</div>;
  }

  if (!student) {
    return <div className="dashboard-error">Error loading student data</div>;
  }

  const uniqueSubjects = getUniqueSubjects();

  return (
    <div className="student-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-content">
            <div className="header-left">
              <Logo size="large" />
              <div className="welcome-text">
                <h1>
                  <FontAwesomeIcon icon={faMicroscope} className="header-icon" />
                  Welcome back, {student.full_name.split(' ')[0]}! 
                  <FontAwesomeIcon  className="wave-icon" />
                </h1>
                <p>Ready to continue your biology learning journey?</p>
              </div>
            </div>
            <div className="header-actions">
              <button onClick={handleSignOut} className="btn-logout">
                <FontAwesomeIcon icon={faSignOutAlt} /> Sign Out
              </button>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faBullseye} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{overallStats.totalAttempts || 0}</div>
              <div className="stat-label">Total Attempts</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faStar} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{overallStats.averageScore || 0}</div>
              <div className="stat-label">Average Score</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faClock} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{formatTimeSpent(overallStats.totalTimeSpent)}</div>
              <div className="stat-label">Time Spent</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faBookOpen} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{uniqueSubjects.length}</div>
              <div className="stat-label">Classes Joined</div>
            </div>
          </div>
        </div>

        {/* Join Class & Recent Activity Row */}
        <div className="dashboard-row">
          <div className="dashboard-col dashboard-col-main">
            {/* Join Class Section */}
            <div className="join-class-section">
              <div className="section-header">
                <FontAwesomeIcon icon={faPlus} className="section-icon" />
                <div>
                  <h2>Join a New Class</h2>
                  <p>Enter your teacher's class code to access new quizzes</p>
                </div>
              </div>
              <form onSubmit={handleJoinClass} className="join-class-form">
                <input
                  type="text"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                  placeholder="Enter class code (e.g., ABC123)"
                  required
                  className="class-code-input"
                />
                <button type="submit" disabled={joiningClass} className="btn-join">
                  Join Class
                </button>
              </form>
              {joinError && <div className="error-message">{joinError}</div>}
              {joinSuccess && <div className="success-message">{joinSuccess}</div>}
            </div>
            {/* My Classes Section */}
            {uniqueSubjects.length > 0 && (
              <div className="my-classes-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faChalkboardTeacher} className="section-icon" />
                  <div>
                    <h2>My Classes</h2>
                    <p>Click on any class to continue playing quizzes</p>
                  </div>
                </div>
                <div className="classes-grid">
                  {uniqueSubjects.map((subject) => (
                    <div 
                      key={subject.class_code} 
                      className="class-card"
                      onClick={() => navigate(`/quiz/${subject.id}`, { 
                        state: { 
                          studentName: student.full_name, 
                          subject,
                          studentId: student.id
                        } 
                      })}
                    >
                      <div className="class-header">
                        <FontAwesomeIcon icon={faMicroscope} className="class-icon" />
                        <div className="class-info">
                          <h3>{subject.title}</h3>
                          <span className="class-code">Code: {subject.class_code}</span>
                        </div>
                      </div>
                      <div className="class-stats">
                        <div className="class-stat">
                          <span className="stat-value">{subject.totalAttempts}</span>
                          <span className="stat-name">Attempts</span>
                        </div>
                        <div className="class-stat">
                          <span className="stat-value best-score">{subject.bestScore || 0}</span>
                          <span className="stat-name">Best Score</span>
                        </div>
                      </div>
                      <div className="class-footer">
                        <FontAwesomeIcon icon={faCalendar} className="footer-icon" />
                        <span className="last-attempt">
                          Last played: {subject.lastAttempt 
                            ? new Date(subject.lastAttempt).toLocaleDateString()
                            : new Date(subject.enrolledAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="dashboard-col dashboard-col-side">
            {/* Recent Activity */}
            {progressData.length > 0 && (
              <div className="recent-activity-section">
                <div className="section-header">
                  <FontAwesomeIcon icon={faArrowTrendUp} className="section-icon" />
                  <div>
                    <h2>Recent Activity</h2>
                    <p>Your latest quiz attempts</p>
                  </div>
                </div>
                <div className="activity-list">
                  {progressData.slice(0, 5).map((progress) => (
                    <div key={progress.id} className="activity-item">
                      <div className="activity-icon">
                        <FontAwesomeIcon icon={faGamepad} />
                      </div>
                      <div className="activity-content">
                        <div className="activity-title">Quiz Attempt</div>
                        <div className="activity-details">
                          <span>Score: {progress.score}</span>
                          <span>•</span>
                          <span>{formatTimeSpent(progress.time_spent)}</span>
                        </div>
                      </div>
                      <div className="activity-date">
                        {new Date(progress.completed_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Empty State */}
        {uniqueSubjects.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No Classes Yet</h3>
            <p>Enter a class code above to join your first biology quiz!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard; 