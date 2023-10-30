import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useRegisterSW } from 'virtual:pwa-register/react';
import postLogin from './hooks/ApiHooks.ts';
import Footer from './views/Footer.tsx';
import Header from './views/Header.tsx';
import Login from './views/main/Login.tsx';
import StartView from './views/main/StartView.tsx';
import AdminMainView from './views/main/admin/AdminMainView.tsx';
import CounselorMainView from './views/main/counselor/CounselorMainView.tsx';
import StudentAttendance from './views/main/student/StudentAttendance.tsx';
import StudentMainView from './views/main/student/StudentMainView.tsx';
import StudentProfile from './views/main/student/StudentProfile.tsx';
import TeacherCourseDetail from './views/main/teacher/Courses/TeacherCourseDetail.tsx';
import TeacherCourseModify from './views/main/teacher/Courses/TeacherCourseModify.tsx';
import TeacherCourses from './views/main/teacher/Courses/TeacherCourses.tsx';
import TeacherCreateCourse from './views/main/teacher/Courses/TeacherCreateCourse.tsx';
import TeacherStudentDetail from './views/main/teacher/Students/TeacherStudentDetail.tsx';
import TeacherStudentModify from './views/main/teacher/Students/TeacherStudentModify.tsx';
import TeacherStudentsView from './views/main/teacher/Students/TeacherStudentsView.tsx';
import TeacherMainView from './views/main/teacher/TeacherMainView.tsx';

const intervalMS = 60 * 60 * 1000;

const App = () => {
  // Define a function to handle the login action
  const handleLogin = async (
    userType: string,
    username: string,
    password: string
  ) => {
    alert('login');
    console.log(userType, username, password);
    const inputs = { username, password };
    console.log('asdasdasdasd');
    const data = await postLogin(inputs);

    console.log(data);
  };

  useRegisterSW({
    onRegistered(r) {
      if (r) {
        console.log('Service worker registered successfully');
        setInterval(() => {
          r.update();
        }, intervalMS);
      } else {
        console.log('Service worker registration failed');
      }
    },
  });

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Header title='Attendance App' />
      <main>
        <Routes>
          <Route
            path='/'
            element={<StartView />}
          />
          <Route
            path='student/*'
            element={
              <Routes>
                <Route
                  path='login'
                  element={
                    <Login
                      userType='Student'
                      onLogin={async (username, password) =>
                        await handleLogin('Student', username, password)
                      }
                    />
                  }
                />
                <Route
                  path='mainview'
                  element={<StudentMainView />}
                />
                <Route path='profile' element={<StudentProfile />} />
                <Route path='attendance' element={<StudentAttendance />} />
              </Routes>
            }
          />
          <Route
            path='admin/*'
            element={
              <Routes>
                {' '}
                <Route
                  path='login'
                  element={
                    <Login
                      userType='Admin'
                      onLogin={(username, password) =>
                        handleLogin('Admin', username, password)
                      }
                    />
                  }
                />
                <Route
                  path='mainview'
                  element={<AdminMainView />}
                />{' '}
              </Routes>
            }
          />
          <Route
            path='counselor/*'
            element={
              <Routes>
                <Route
                  path='login'
                  element={
                    <Login
                      userType='Counselor'
                      onLogin={(username, password) =>
                        handleLogin('Counselor', username, password)
                      }
                    />
                  }
                />
                <Route
                  path='mainview'
                  element={<CounselorMainView />}
                />
              </Routes>
            }
          />

          <Route
            path='teacher/*'
            element={
              <Routes>
                <Route
                  path='login'
                  element={
                    <Login
                      userType='Teacher'
                      onLogin={(username, password) =>
                        handleLogin('Teacher', username, password)
                      }
                    />
                  }
                />
                <Route
                  path='mainview'
                  element={<TeacherMainView />}
                />
                <Route
                  path='courses/*'
                  element={
                    <Routes>
                      <Route
                        path='/'
                        element={<TeacherCourses />}
                      />
                      <Route
                        path='createcourse'
                        element={<TeacherCreateCourse />}
                      />
                      <Route
                        path=':id'
                        element={<TeacherCourseDetail />}
                      />
                      <Route
                        path=':id/modify'
                        element={<TeacherCourseModify />}
                      />
                    </Routes>
                  }
                />
                <Route
                  path='students/*'
                  element={
                    <Routes>
                      <Route
                        path='/'
                        element={<TeacherStudentsView />}
                      />
                      <Route
                        path=':id'
                        element={<TeacherStudentDetail />}
                      />
                      <Route
                        path=':id/modify'
                        element={<TeacherStudentModify />}
                      />
                    </Routes>
                  }
                />
              </Routes>
            }
          />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;