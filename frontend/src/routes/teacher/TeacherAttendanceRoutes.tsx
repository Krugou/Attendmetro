import React from 'react';
import { Route, Routes } from 'react-router-dom';
import TeacherAttendanceRoom from '../../views/main/teacher/Attendance/TeacherAttendanceRoom.tsx';
import TeacherCreateAttendance from '../../views/main/teacher/Attendance/TeacherCreateAttendance.tsx';

const TeacherAttendanceRoutes: React.FC = () => {
    return (
        <Routes>
            <Route path='createclass' element={<TeacherCreateAttendance />} />
            <Route path=':classid' element={<TeacherAttendanceRoom />} />
        </Routes>
    );
};

export default TeacherAttendanceRoutes;
