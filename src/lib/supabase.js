import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR - Missing Supabase environment variables');
  throw new Error('Supabase environment variables are not configured. Please check your .env file or Vercel environment variables.');
}

// Validate URL format
if (!supabaseUrl.startsWith('https://') || !supabaseUrl.includes('.supabase.co')) {
  console.error('❌ ERROR - Invalid Supabase URL format:', supabaseUrl);
  throw new Error('Invalid Supabase URL format. URL should start with https:// and contain .supabase.co');
}

// Create and export the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Auth helper functions
export const signUp = async (email, password, fullName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName
      }
    }
  });
  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

// Database helper functions
export const insertTeacher = async (teacherData) => {
  const { data, error } = await supabase
    .from('teachers')
    .insert([teacherData])
    .select();
  return { data, error };
};

export const getTeacherByUserId = async (userId) => {
  const { data, error } = await supabase
    .from('teachers')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { data, error };
};

export const createSubject = async (subjectData) => {
  const { data, error } = await supabase
    .from('subjects')
    .insert([subjectData])
    .select();
  return { data, error };
};

export const updateSubject = async (subjectId, subjectData) => {
  const { data, error } = await supabase
    .from('subjects')
    .update(subjectData)
    .eq('id', subjectId)
    .select();
  return { data, error };
};

export const getTeacherSubjects = async (teacherId) => {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('teacher_id', teacherId)
    .eq('is_active', true);
  return { data, error };
};

export const getSubjectByClassCode = async (classCode) => {
  const { data, error } = await supabase
    .from('subjects')
    .select('*')
    .eq('class_code', classCode)
    .eq('is_active', true)
    .single();
  return { data, error };
};

export const deleteSubject = async (subjectId) => {
  const { data, error } = await supabase
    .from('subjects')
    .delete()
    .eq('id', subjectId);
  return { data, error };
};

// Image upload helper
export const uploadImage = async (file, bucket = 'question-images') => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    return { data: null, error };
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return { data: { path: filePath, publicUrl }, error: null };
};

// Puzzle game helper functions
export const createPuzzleGame = async (puzzleGameData) => {
  const { data, error } = await supabase
    .from('puzzle_games')
    .insert([puzzleGameData])
    .select();
  
  return { data, error };
};

export const getPuzzleGamesBySubject = async (subjectId) => {
  const { data, error } = await supabase
    .from('puzzle_games')
    .select('*')
    .eq('subject_id', subjectId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const updatePuzzleGame = async (gameId, gameData) => {
  const { data, error } = await supabase
    .from('puzzle_games')
    .update(gameData)
    .eq('id', gameId)
    .select();
  
  return { data, error };
};

export const deletePuzzleGame = async (gameId) => {
  const { data, error } = await supabase
    .from('puzzle_games')
    .delete()
    .eq('id', gameId);
  
  return { data, error };
}; 

// Student authentication functions
export const signUpStudent = async (email, password, fullName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        user_type: 'student'
      }
    }
  });
  return { data, error };
};

export const signInStudent = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

export const insertStudent = async (studentData) => {
  const { data, error } = await supabase
    .from('students')
    .insert([studentData])
    .select();
  return { data, error };
};

export const getStudentByUserId = async (userId) => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { data, error };
};

export const getStudentProgress = async (studentId) => {
  const { data, error } = await supabase
    .from('student_progress')
    .select(`
      *,
      subjects(title, class_code),
      quiz_games(title),
      quiz_levels(title, level_number),
      puzzle_games(title, game_type)
    `)
    .eq('student_id', studentId)
    .order('completed_at', { ascending: false });
  return { data, error };
};

export const getStudentProgressBySubject = async (studentId, subjectId) => {
  const { data, error } = await supabase
    .from('student_progress')
    .select(`
      *,
      quiz_games(title),
      quiz_levels(title, level_number),
      puzzle_games(title, game_type)
    `)
    .eq('student_id', studentId)
    .eq('subject_id', subjectId)
    .order('completed_at', { ascending: false });
  return { data, error };
};

export const saveStudentProgress = async (progressData) => {
  const { data, error } = await supabase
    .from('student_progress')
    .insert([progressData])
    .select();
  return { data, error };
};

export const saveStudentAnswer = async (answerData) => {
  const { data, error } = await supabase
    .from('student_answers')
    .insert([answerData])
    .select();
  return { data, error };
};

// Get student's overall statistics
export const getStudentOverallStats = async (studentId) => {
  const { data, error } = await supabase
    .from('student_progress')
    .select('score, time_spent, completed_at')
    .eq('student_id', studentId);
  
  if (error) return { data: null, error };
  
  const totalAttempts = data.length;
  const totalScore = data.reduce((sum, attempt) => sum + attempt.score, 0);
  const totalTimeSpent = data.reduce((sum, attempt) => sum + (attempt.time_spent || 0), 0);
  const averageScore = totalAttempts > 0 ? Math.round(totalScore / totalAttempts) : 0;
  
  return { 
    data: {
      totalAttempts,
      totalScore,
      averageScore,
      totalTimeSpent,
      recentAttempts: data.slice(0, 5) // Last 5 attempts
    }, 
    error: null 
  };
}; 

// Student enrollment functions
export const enrollStudentInClass = async (studentId, subjectId) => {
  const { data, error } = await supabase
    .from('student_enrollments')
    .insert([{ student_id: studentId, subject_id: subjectId }])
    .select();
  return { data, error };
};

export const getStudentEnrollments = async (studentId) => {
  const { data, error } = await supabase
    .from('student_enrollments')
    .select(`
      *,
      subjects(id, title, class_code, teacher_id)
    `)
    .eq('student_id', studentId)
    .order('enrolled_at', { ascending: false });
  return { data, error };
};

export const isStudentEnrolledInClass = async (studentId, subjectId) => {
  const { data, error } = await supabase
    .from('student_enrollments')
    .select('id')
    .eq('student_id', studentId)
    .eq('subject_id', subjectId)
    .single();
  return { data, error };
};

// ===== STUDENT MONITORING FUNCTIONS =====

// Get all students enrolled in teacher's subjects with detailed progress
export const getTeacherStudents = async (teacherId) => {
  console.log('getTeacherStudents called with teacherId:', teacherId);
  
  // First, let's get the teacher's subjects to debug
  const { data: teacherSubjects, error: subjectsError } = await supabase
    .from('subjects')
    .select('id, title, class_code, teacher_id')
    .eq('teacher_id', teacherId);
  
  console.log('Teacher subjects:', teacherSubjects);
  console.log('Subjects error:', subjectsError);
  
  if (teacherSubjects && teacherSubjects.length > 0) {
    const subjectIds = teacherSubjects.map(s => s.id);
    console.log('Subject IDs for teacher:', subjectIds);
    
    // Get enrollments for these specific subjects
    const { data, error } = await supabase
      .from('student_enrollments')
      .select(`
        id,
        student_id,
        subject_id,
        enrolled_at,
        students!inner(
          id,
          full_name,
          email,
          created_at
        ),
        subjects!inner(
          id,
          title,
          class_code,
          teacher_id
        )
      `)
      .in('subject_id', subjectIds)
      .order('enrolled_at', { ascending: false });
    
    console.log('getTeacherStudents - Final result:', data);
    console.log('getTeacherStudents - Error:', error);
    
    return { data, error };
  } else {
    console.log('No subjects found for teacher:', teacherId);
    return { data: [], error: null };
  }
};

// Get detailed student progress for all subjects
export const getStudentDetailedProgress = async (studentId, subjectId = null) => {
  let query = supabase
    .from('student_progress')
    .select(`
      *,
      subjects(
        id,
        title,
        class_code,
        teacher_id
      ),
      puzzle_games(
        id,
        title,
        game_type,
        difficulty
      ),
      quiz_games(
        id,
        title
      ),
      quiz_levels(
        id,
        title,
        level_number
      )
    `)
    .eq('student_id', studentId)
    .order('completed_at', { ascending: false });

  if (subjectId) {
    query = query.eq('subject_id', subjectId);
  }

  const { data, error } = await query;
  return { data, error };
};

// Get student analytics and statistics
export const getStudentAnalytics = async (studentId, timeFilter = 'all') => {
  let query = supabase
    .from('student_progress')
    .select('*')
    .eq('student_id', studentId);

  // Apply time filter
  if (timeFilter === '7days') {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    query = query.gte('completed_at', sevenDaysAgo.toISOString());
  } else if (timeFilter === '30days') {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    query = query.gte('completed_at', thirtyDaysAgo.toISOString());
  } else if (timeFilter === 'semester') {
    const semesterStart = new Date();
    semesterStart.setMonth(semesterStart.getMonth() - 6); // Last 6 months
    query = query.gte('completed_at', semesterStart.toISOString());
  }

  const { data, error } = await query;
  
  if (error) return { data: null, error };

  // Calculate analytics
  const totalAttempts = data.length;
  const totalScore = data.reduce((sum, attempt) => sum + (attempt.score || 0), 0);
  const totalTimeSpent = data.reduce((sum, attempt) => sum + (attempt.time_spent || 0), 0);
  const averageScore = totalAttempts > 0 ? Math.round(totalScore / totalAttempts) : 0;
  const bestScore = data.length > 0 ? Math.max(...data.map(attempt => attempt.score || 0)) : 0;
  const lastActivity = data.length > 0 ? data[0].completed_at : null;

  return {
    data: {
      totalAttempts,
      totalScore,
      averageScore,
      bestScore,
      totalTimeSpent,
      lastActivity,
      recentAttempts: data.slice(0, 10), // Last 10 attempts
      progressBySubject: data.reduce((acc, attempt) => {
        const subjectId = attempt.subject_id;
        if (!acc[subjectId]) {
          acc[subjectId] = {
            attempts: 0,
            totalScore: 0,
            bestScore: 0
          };
        }
        acc[subjectId].attempts++;
        acc[subjectId].totalScore += attempt.score || 0;
        acc[subjectId].bestScore = Math.max(acc[subjectId].bestScore, attempt.score || 0);
        return acc;
      }, {})
    },
    error: null
  };
};

// Remove student from a subject
export const removeStudentFromSubject = async (studentId, subjectId) => {
  // First delete all progress for this student in this subject
  const { error: progressError } = await supabase
    .from('student_progress')
    .delete()
    .eq('student_id', studentId)
    .eq('subject_id', subjectId);

  if (progressError) {
    return { data: null, error: progressError };
  }

  // Then delete the enrollment
  const { data, error } = await supabase
    .from('student_enrollments')
    .delete()
    .eq('student_id', studentId)
    .eq('subject_id', subjectId);

  return { data, error };
};

// Reset student progress for a specific subject
export const resetStudentProgress = async (studentId, subjectId) => {
  const { data, error } = await supabase
    .from('student_progress')
    .delete()
    .eq('student_id', studentId)
    .eq('subject_id', subjectId);

  return { data, error };
};

// Get real-time updates for student progress
export const subscribeToStudentProgress = (teacherId, callback) => {
  return supabase
    .channel('student_progress_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'student_progress',
        filter: `subject_id=in.(select id from subjects where teacher_id=eq.${teacherId})`
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
};

// Get student activity summary
export const getStudentActivitySummary = async (teacherId) => {
  const { data, error } = await supabase
    .from('student_progress')
    .select(`
      *,
      students(full_name, email),
      subjects(title, class_code)
    `)
    .eq('subjects.teacher_id', teacherId)
    .order('completed_at', { ascending: false })
    .limit(50); // Last 50 activities

  return { data, error };
};

// Real-time subscription manager
export class StudentProgressSubscription {
  constructor(teacherId) {
    this.teacherId = teacherId;
    this.subscription = null;
    this.callbacks = [];
  }

  // Subscribe to student progress changes
  subscribe(callback) {
    this.callbacks.push(callback);
    
    if (!this.subscription) {
      this.subscription = supabase
        .channel(`student_progress_${this.teacherId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'student_progress',
            filter: `subject_id=in.(select id from subjects where teacher_id=eq.${this.teacherId})`
          },
          (payload) => {
            console.log('Real-time update received:', payload);
            this.callbacks.forEach(cb => cb(payload));
          }
        )
        .on('error', (error) => {
          console.error('Subscription error:', error);
        })
        .subscribe((status) => {
          console.log('Subscription status:', status);
        });
    }
  }

  // Unsubscribe a specific callback
  unsubscribe(callback) {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
    
    // If no more callbacks, unsubscribe from the channel
    if (this.callbacks.length === 0 && this.subscription) {
      this.unsubscribeAll();
    }
  }

  // Unsubscribe all callbacks and close the channel
  unsubscribeAll() {
    if (this.subscription) {
      supabase.removeChannel(this.subscription);
      this.subscription = null;
    }
    this.callbacks = [];
  }

  // Get subscription status
  getStatus() {
    return this.subscription ? 'subscribed' : 'unsubscribed';
  }
}

// Helper function to create and manage subscription
export const createStudentProgressSubscription = (teacherId, callback) => {
  const subscription = new StudentProgressSubscription(teacherId);
  subscription.subscribe(callback);
  return subscription;
};

// Function to copy Cell Division template for new teachers
export const copyCellDivisionTemplateForTeacher = async (teacherId) => {
  const { data, error } = await supabase
    .rpc('copy_cell_division_template_for_teacher', {
      new_teacher_id: teacherId
    });
  return { data, error };
};

 