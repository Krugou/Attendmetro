import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

import CircularProgress from '@mui/material/CircularProgress';
import React, {useContext, useEffect, useState} from 'react';
import {toast} from 'react-toastify';
import {UserContext} from '../../../../contexts/UserContext';
import apiHooks from '../../../../hooks/ApiHooks';
interface Lecture {
  lectureid: number;
  start_date: string;
  attended: number;
  notattended: number;
  teacheremail: string;
  timeofday: string;
  coursename: string;
  state: string;
  topicname: string;
  coursecode: string;
  courseid: string;
  actualStudentCount: number;
}

const TeacherLectures: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {user} = useContext(UserContext);
  const [sortOrder] = useState<'asc' | 'desc'>('desc');

  const getLectures = async () => {
    const token: string | null = localStorage.getItem('userToken');
    if (!token) {
      toast.error('No token available');
      setIsLoading(false);
      return;
    }
    if (user) {
      try {
        const result = await apiHooks.fetchTeacherOwnLectures(
          user.userid.toString(),
          token,
        );
        const sortedLectures = result.sort((a, b) => {
          return sortOrder === 'asc'
            ? a.lectureid - b.lectureid
            : b.lectureid - a.lectureid;
        });
        setLectures(sortedLectures);
        setIsLoading(false);
      } catch (error) {
        const message = (error as Error).message;
        toast.error('Failed to fetch lectures: ' + message);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      getLectures();
    }
  }, [user]);

  if (isLoading) {
    return <CircularProgress />;
  }
  // Calculate total lectures count
  const totalLectures = lectures.length;

  // Calculate ratio of lectures attendance
  const totalAttended = lectures.reduce(
    (sum, lecture) => sum + lecture.attended,
    0,
  );
  const totalNotAttended = lectures.reduce(
    (sum, lecture) => sum + lecture.notattended,
    0,
  );
  const attendanceRatio =
    totalLectures > 0
      ? (totalAttended / (totalAttended + totalNotAttended)) * 100
      : 0;

  return (
    <div className='relative w-full p-5 bg-white rounded-lg xl:w-fit'>
      <h1 className='mb-4 text-2xl font-bold'>
        These are your saved lecture stats. Please review them carefully for any
        inaccuracies. If you find any errors, kindly report them to admins using
        the feedback option in the main view. Thank you!
      </h1>
      <h2 className='mb-2 text-xl'>
        Total Lectures: {totalLectures} | Attendance Ratio:{' '}
        {attendanceRatio.toFixed(2)}%
      </h2>

      <div className='mt-4 mb-4 space-x-2'></div>
      <TableContainer
        className={`relative bg-gray-100 overflow-auto h-[384px]
				}`}>
        <Table className='table-auto'>
          <TableHead className='sticky top-0 z-10 bg-white border-t-2 border-black'>
            <TableRow>
              <TableCell>Lecture ID</TableCell>
              <TableCell>Course name</TableCell>
              <TableCell>Course code</TableCell>
              <TableCell>Topic name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>am/pm</TableCell>
              <TableCell>Attendance</TableCell>
              <TableCell>Total Attendance</TableCell>
              <TableCell>Students with this topic</TableCell>
              <TableCell>Ratio(%)</TableCell>
              <TableCell>State</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {lectures.length > 0 ? (
              lectures.map((lecture) => (
                <TableRow
                  key={lecture.lectureid}
                  className={`hover:bg-gray-200 ${
                    lecture.attended === 0 ? 'bg-red-200' : ''
                  }`}>
                  <TableCell>{lecture.lectureid}</TableCell>
                  <TableCell>{lecture.coursename}</TableCell>
                  <TableCell>{lecture.coursecode}</TableCell>
                  <TableCell>{lecture.topicname}</TableCell>
                  <TableCell>
                    {new Date(lecture.start_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{lecture.timeofday}</TableCell>

                  <TableCell
                    title={`Total attendance gathered: ${
                      lecture.attended + lecture.notattended
                    }`}>
                    <span className='text-metropoliaTrendGreen'>
                      {lecture.attended}
                    </span>
                    /
                    <span className='text-metropoliaSupportRed'>
                      {lecture.notattended}
                    </span>
                  </TableCell>
                  <TableCell>
                    {lecture.attended + lecture.notattended}
                  </TableCell>
                  <TableCell>{lecture.actualStudentCount}</TableCell>
                  <TableCell>
                    {Math.round(
                      (lecture.attended /
                        (lecture.attended + lecture.notattended)) *
                        100,
                    )}{' '}
                    %
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        lecture.state === 'open' &&
                        new Date(lecture.start_date).getTime() <
                          Date.now() - 24 * 60 * 60 * 1000
                          ? 'text-metropoliaSupportRed'
                          : 'text-metropoliaTrendGreen'
                      }>
                      {lecture.state}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} align='center'>
                  {'No data available'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TeacherLectures;
