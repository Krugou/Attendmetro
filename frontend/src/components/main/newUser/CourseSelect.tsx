import React from 'react';

interface Course {
  courseid: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  code: string;
  studentgroup_name: string;
  topic_names: string;
  // Include other properties of course here
}

interface CourseSelectProps {
  courses: Course[];
  selectedCourse: number | null;
  onChange: (value: number) => void;
}

const CourseSelect: React.FC<CourseSelectProps> = ({
  courses,
  selectedCourse,
  onChange,
}) => {
  return (
    <label className='block mt-4'>
      <span className='font-bold text-gray-700'>Course</span>
      <select
        required
        value={selectedCourse || ''}
        onChange={(e) => onChange(Number(e.target.value))}
        className='w-full px-3 py-2 mt-1 mb-3 leading-tight text-gray-700 border shadow appearance-none cursor-pointer rounded-3xl focus:outline-none focus:shadow-outline'>
        <option value='null'>Select a course</option>
        {courses.map((course) => (
          <option key={course.courseid} value={course.courseid}>
            {course.name + '|' + course.code}
          </option>
        ))}
      </select>
    </label>
  );
};

export default CourseSelect;
