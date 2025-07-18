import React, { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { getTeacherStudents, getStudentAnalytics, removeStudentFromSubject, resetStudentProgress, createStudentProgressSubscription, getStudentDetailedProgress } from '../lib/supabase';
import { getTeacherSubjects } from '../lib/supabase';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { usePerformance } from '../App';
import './StudentMonitoring.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faRotateLeft, faTrash } from '@fortawesome/free-solid-svg-icons';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TIME_FILTERS = [
  { label: 'All Time', value: 'all' },
  { label: 'Last 7 Days', value: '7days' },
  { label: 'Last 30 Days', value: '30days' },
  { label: 'Semester', value: 'semester' },
];

// Memoized filter components
const SubjectFilter = memo(({ subjects, subjectFilter, onFilterChange }) => (
  <div className="subject-filter">
    <label>Subject: </label>
    <select value={subjectFilter} onChange={onFilterChange}>
      <option value="all">All Subjects</option>
      {subjects.map(sub => (
        <option key={sub.id} value={sub.id}>{sub.title}</option>
      ))}
    </select>
  </div>
));

const TimeFilter = memo(({ timeFilter, onFilterChange }) => (
  <div className="time-filter">
    <label>Time Period: </label>
    <select value={timeFilter} onChange={onFilterChange}>
      {TIME_FILTERS.map(f => (
        <option key={f.value} value={f.value}>{f.label}</option>
      ))}
    </select>
  </div>
));

const DateRangeFilter = memo(({ dateRange, onDateRangeChange }) => (
  <div className="date-range-filter">
    <label>Date Range: </label>
    <DatePicker
      selectsRange
      startDate={dateRange[0]}
      endDate={dateRange[1]}
      onChange={onDateRangeChange}
      isClearable={true}
      placeholderText="Select range"
      maxDate={new Date()}
    />
  </div>
));

// Memoized table row component
const StudentTableRow = memo(({ 
  enrollment, 
  analytics, 
  actionLoading, 
  onRemove, 
  onReset, 
  onViewDetails 
}) => {
  const student = enrollment.students;
  const subject = enrollment.subjects;
  const studentStats = analytics[student?.id] || {};
  
  if (!student || !subject) return null;

  return (
    <tr key={`${student.id}-${subject.id}`} className="student-row-modern">
      <td><strong>{student.full_name}</strong></td>
      <td><span className="student-email">{student.email}</span></td>
      <td><span className="topic-badge">{subject.title}</span></td>
      <td>{new Date(enrollment.enrolled_at).toLocaleDateString()}</td>
      <td><span className="attempts-badge">{studentStats.totalAttempts || 0}</span></td>
      <td><span className="score-badge avg">{
  studentStats.recentAttempts && studentStats.recentAttempts.length > 0
    ? (studentStats.recentAttempts[0].score || 0)
    : 0
}</span></td>
      <td><span className="score-badge best">{studentStats.bestScore || 0}</span></td>
      <td><span className="time-badge">{studentStats.totalTimeSpent ? Math.floor(studentStats.totalTimeSpent / 60) + 'm' : '0m'}</span></td>
      <td>
        <div className="action-buttons-modern">
          <button 
            className="icon-btn details"
            title="View Details"
            onClick={() => onViewDetails(student, subject)}
            disabled={actionLoading[`${student.id}-${subject.id}-details`]}
          >
            <FontAwesomeIcon icon={faEye} />
          </button>
          <button 
            className="icon-btn reset"
            title="Reset Progress"
            onClick={() => onReset(student.id, subject.id)}
            disabled={actionLoading[`${student.id}-${subject.id}-reset`]}
          >
            <FontAwesomeIcon icon={faRotateLeft} />
          </button>
          <button 
            className="icon-btn remove"
            title="Remove"
            onClick={() => onRemove(student.id, subject.id)}
            disabled={actionLoading[`${student.id}-${subject.id}`]}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      </td>
    </tr>
  );
});

// Memoized details modal component
const DetailsModal = memo(({ 
  isOpen, 
  student, 
  subject, 
  attempts, 
  stats, 
  loading, 
  onClose, 
  dateRange 
}) => {
  const [startDate, endDate] = dateRange;
  
  const filteredAttempts = useMemo(() => {
    if (!startDate || !endDate) return attempts;
    return attempts.filter(a => {
      if (!a.completed_at) return false;
      const date = new Date(a.completed_at);
      return date >= startDate && date <= endDate;
    });
  }, [attempts, startDate, endDate]);

  const chartData = useMemo(() => {
    if (!filteredAttempts.length) return null;
    
    const sortedAttempts = [...filteredAttempts].sort((a, b) => 
      new Date(a.completed_at) - new Date(b.completed_at)
    );
    
    return {
      labels: sortedAttempts.map((_, index) => `Attempt ${index + 1}`),
      datasets: [{
        label: 'Score',
        data: sortedAttempts.map(a => a.score || 0),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    };
  }, [filteredAttempts]);

  if (!isOpen) return null;

  return (
    <div className="monitoring-modal-overlay" onClick={onClose}>
      <div className="monitoring-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Student Details</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        {loading ? (
          <div className="monitoring-loading">Loading details...</div>
        ) : (
          <>
            <div className="modal-student-info">
              <div><strong>Name:</strong> {student.full_name}</div>
              <div><strong>Email:</strong> {student.email}</div>
              <div><strong>Subject:</strong> {subject.title}</div>
            </div>
            <div className="modal-summary-stats">
              <div>
                <strong>Total Attempts</strong>
                <span>{filteredAttempts.length}</span>
              </div>
              <div>
                <strong>Average Score</strong>
                <span>{filteredAttempts.length > 0 ? Math.round(filteredAttempts.reduce((sum, a) => sum + (a.score || 0), 0) / filteredAttempts.length) : 0}</span>
              </div>
              <div>
                <strong>Best Score</strong>
                <span>{filteredAttempts.length > 0 ? Math.max(...filteredAttempts.map(a => a.score || 0)) : 0}</span>
              </div>
              <div>
                <strong>Total Time</strong>
                <span>{filteredAttempts.reduce((sum, a) => sum + (a.time_spent || 0), 0)} sec</span>
              </div>
            </div>
            
            {chartData && (
              <div className="chart-container">
                <h4>Score Progression</h4>
                <Bar 
                  data={chartData}
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100
                      }
                    }
                  }}
                />
              </div>
            )}
            
            <div className="attempts-list">
              <h4>Recent Attempts</h4>
              <div className="attempts-table">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Score</th>
                      <th>Time Spent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttempts.slice(0, 10).map((attempt, index) => (
                      <tr key={index}>
                        <td>{new Date(attempt.completed_at).toLocaleDateString()}</td>
                        <td>{attempt.score || 0}</td>
                        <td>{attempt.time_spent || 0}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

const StudentMonitoring = memo(({ teacherId }) => {
  const { trackComponentRender, trackApiCall } = usePerformance();
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeFilter, setTimeFilter] = useState('all');
  const [analytics, setAnalytics] = useState({});
  const [actionLoading, setActionLoading] = useState({});
  const [detailsModal, setDetailsModal] = useState({ open: false, student: null, subject: null, attempts: [], stats: {} });
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [dateRange, setDateRange] = useState([null, null]);

  // Track component render
  useEffect(() => {
    trackComponentRender('StudentMonitoring');
  }, [trackComponentRender]);

  // Fetch teacher's subjects for the filter dropdown
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!teacherId) return;
      const startTime = performance.now();
      const { data, error } = await getTeacherSubjects(teacherId);
      const duration = performance.now() - startTime;
      trackApiCall('getTeacherSubjects', duration);
      
      if (!error) setSubjects(data || []);
    };
    fetchSubjects();
  }, [teacherId, trackApiCall]);

  // Load students and their analytics
  const loadStudents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const startTime = performance.now();
      const { data, error } = await getTeacherStudents(teacherId);
      const duration = performance.now() - startTime;
      trackApiCall('getTeacherStudents', duration);
      
      if (error) throw error;
      setStudents(data || []);
      
      // Load analytics for each student
      const analyticsObj = {};
      const analyticsStartTime = performance.now();
      await Promise.all(
        (data || []).map(async (enrollment) => {
          const studentId = enrollment.students?.id;
          if (!studentId) return;
          const { data: stats } = await getStudentAnalytics(studentId, timeFilter);
          analyticsObj[studentId] = stats;
        })
      );
      const analyticsDuration = performance.now() - analyticsStartTime;
      trackApiCall('getStudentAnalytics', analyticsDuration);
      
      setAnalytics(analyticsObj);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [teacherId, timeFilter, trackApiCall]);

  useEffect(() => {
    if (teacherId) {
      loadStudents();
    }
  }, [teacherId, loadStudents]);

  // Real-time updates
  useEffect(() => {
    if (!teacherId) return;
    const subscription = createStudentProgressSubscription(teacherId, () => {
      loadStudents();
    });
    return () => {
      subscription.unsubscribeAll();
    };
  }, [teacherId, loadStudents]);

  // Remove student from subject
  const handleRemove = useCallback(async (studentId, subjectId) => {
    if (!window.confirm('Are you sure you want to remove this student from the subject? This will also delete all their progress for this subject.')) return;
    setActionLoading((prev) => ({ ...prev, [studentId + subjectId]: true }));
    await removeStudentFromSubject(studentId, subjectId);
    setActionLoading((prev) => ({ ...prev, [studentId + subjectId]: false }));
    loadStudents();
  }, [loadStudents]);

  // Reset student progress
  const handleReset = useCallback(async (studentId, subjectId) => {
    if (!window.confirm('Are you sure you want to reset this student\'s progress for this subject?')) return;
    setActionLoading((prev) => ({ ...prev, [studentId + subjectId + 'reset']: true }));
    await resetStudentProgress(studentId, subjectId);
    setActionLoading((prev) => ({ ...prev, [studentId + subjectId + 'reset']: false }));
    loadStudents();
  }, [loadStudents]);

  // View details modal
  const handleViewDetails = useCallback(async (student, subject) => {
    setDetailsLoading(true);
    setDetailsModal({ open: true, student, subject, attempts: [], stats: {} });
    
    const startTime = performance.now();
    const { data: attempts, error } = await getStudentDetailedProgress(student.id, subject.id);
    const duration = performance.now() - startTime;
    trackApiCall('getStudentDetailedProgress', duration);
    
    // Calculate summary stats
    let stats = { totalAttempts: 0, averageScore: 0, bestScore: 0, totalTimeSpent: 0 };
    if (attempts && attempts.length > 0) {
      stats.totalAttempts = attempts.length;
      stats.averageScore = Math.round(attempts.reduce((sum, a) => sum + (a.score || 0), 0) / attempts.length);
      stats.bestScore = Math.max(...attempts.map(a => a.score || 0));
      stats.totalTimeSpent = attempts.reduce((sum, a) => sum + (a.time_spent || 0), 0);
    }
    setDetailsModal({ open: true, student, subject, attempts: attempts || [], stats });
    setDetailsLoading(false);
  }, [trackApiCall]);

  const closeDetailsModal = useCallback(() => {
    setDetailsModal({ open: false, student: null, subject: null, attempts: [], stats: {} });
  }, []);

  // Memoized filtered students
  const filteredStudents = useMemo(() => {
    return subjectFilter === 'all'
      ? students
      : students.filter(enrollment => enrollment.subjects && enrollment.subjects.id === subjectFilter);
  }, [students, subjectFilter]);

  // Memoized filter handlers
  const handleSubjectFilterChange = useCallback((e) => {
    setSubjectFilter(e.target.value);
  }, []);

  const handleTimeFilterChange = useCallback((e) => {
    setTimeFilter(e.target.value);
  }, []);

  const handleDateRangeChange = useCallback((update) => {
    setDateRange(update);
  }, []);

  return (
    <div className="student-monitoring-section">
      <div className="monitoring-header">
        <h2>Student Monitoring</h2>
        <div className="monitoring-filters">
          <SubjectFilter 
            subjects={subjects}
            subjectFilter={subjectFilter}
            onFilterChange={handleSubjectFilterChange}
          />
          <TimeFilter 
            timeFilter={timeFilter}
            onFilterChange={handleTimeFilterChange}
          />
          <DateRangeFilter 
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
          />
        </div>
      </div>
      {loading ? (
        <div className="monitoring-loading">Loading students...</div>
      ) : error ? (
        <div className="monitoring-error">{error}</div>
      ) : (
        <div className="students-table-wrapper">
          <table className="students-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Topic</th>
                <th>Enrolled At</th>
                <th>Attempts</th>
                <th>First Score Attempt</th>
                <th>Best Score</th>
                <th>Time Spent</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map(enrollment => (
                <StudentTableRow
                  key={`${enrollment.students?.id}-${enrollment.subjects?.id}`}
                  enrollment={enrollment}
                  analytics={analytics}
                  actionLoading={actionLoading}
                  onRemove={handleRemove}
                  onReset={handleReset}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <DetailsModal
        isOpen={detailsModal.open}
        student={detailsModal.student}
        subject={detailsModal.subject}
        attempts={detailsModal.attempts}
        stats={detailsModal.stats}
        loading={detailsLoading}
        onClose={closeDetailsModal}
        dateRange={dateRange}
      />
    </div>
  );
});

StudentMonitoring.displayName = 'StudentMonitoring';

export default StudentMonitoring; 