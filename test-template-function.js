require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client using environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testTemplateFunction() {
  console.log('Testing template function...');
  console.log('Supabase URL:', supabaseUrl);
  
  try {
    // First, let's get a real teacher ID from the database
    const { data: teachers, error: teachersError } = await supabase
      .from('teachers')
      .select('id')
      .limit(1);
    
    if (teachersError) {
      console.error('Error fetching teachers:', teachersError);
      return;
    }
    
    if (teachers.length === 0) {
      console.log('No teachers found in database. Please create a teacher account first.');
      return;
    }
    
    const realTeacherId = teachers[0].id;
    console.log('Using real teacher ID:', realTeacherId);
    
    // First, let's check if we have the Cell Division subject
    const { data: subjects, error: subjectsError } = await supabase
      .from('subjects')
      .select('*')
      .eq('title', 'Cell Division');
    
    if (subjectsError) {
      console.error('Error fetching subjects:', subjectsError);
      return;
    }
    
    console.log('Found Cell Division subjects:', subjects);
    
    if (subjects.length === 0) {
      console.log('No Cell Division subject found. Please ensure the template exists.');
      return;
    }
    
    // Get the first Cell Division subject (should be the template)
    const templateSubject = subjects[0];
    console.log('Template subject ID:', templateSubject.id);
    
    console.log(`Testing copy_template_for_teacher function with teacher ID: ${realTeacherId}`);
    
    const { data, error } = await supabase.rpc('copy_cell_division_template_for_teacher', {
      new_teacher_id: realTeacherId
    });
    
    if (error) {
      console.error('Error calling template function:', error);
      return;
    }
    
    console.log('Template function executed successfully!');
    console.log('Result:', data);
    
    // Verify the copy was created
    const { data: newSubjects, error: newSubjectsError } = await supabase
      .from('subjects')
      .select('*')
      .eq('teacher_id', realTeacherId)
      .eq('title', 'Cell Division');
    
    if (newSubjectsError) {
      console.error('Error fetching new subjects:', newSubjectsError);
      return;
    }
    
    console.log('New Cell Division subjects for test teacher:', newSubjects);
    
    if (newSubjects.length > 0) {
      console.log('✅ SUCCESS: Template was copied successfully!');
      console.log('New subject ID:', newSubjects[0].id);
      console.log('Class code:', newSubjects[0].class_code);
    } else {
      console.log('❌ FAILED: No new subject was created');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testTemplateFunction(); 