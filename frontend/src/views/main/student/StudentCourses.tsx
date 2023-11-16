import React, {useEffect, useState, useContext} from 'react';
import {UserContext} from '../../../contexts/UserContext';
import apiHooks from '../../../hooks/ApiHooks';
import {useNavigate} from 'react-router-dom';
import ReportIcon from '@mui/icons-material/Report';
import Tooltip from '@mui/material/Tooltip';
const StudentCourses: React.FC = () => {
	interface Course {
		courseid: number;
		course_name: string;
		startDate: string;
		endDate: string;
		code: string;
		student_group: number | null;
		topic_names: string;
		instructor_name: string;
		usercourseid: number;
	}
	const [error, setError] = useState<string | null>(null);
	const {user} = useContext(UserContext);
	const [courses, setCourses] = useState<Course[]>([]);
	const navigate = useNavigate();
	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const token: string | null = localStorage.getItem('userToken');
				if (user && token !== null) {
					const data = await apiHooks.getAllCourseInfoByUserEmail(token);
					console.log(data, 'DATA');
					setCourses(data);
				}
			} catch (error) {
				setError('No Data Available');
			}
		};
		fetchCourses();
	}, [user]);

	/*
	const getAttendanceColorClass = (attendance: number) => {
		if (attendance >= 90) {
			return 'bg-metropoliaTrendGreen';
		} else if (attendance >= 50) {
			return 'bg-metropoliaMainOrange';
		} else {
			return 'bg-metropoliaSupportRed';
		}
	};
*/
	if (error) {
		return <div>Error: {error}</div>;
	}
	return (
		<div className="flex flex-col items-center justify-center h-1/2 p-8 bg-gray-100">
			<h1 className="text-2xl sm:text-4xl font-bold mb-8 text-center">
				Your Courses
			</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{courses.map(course => {
					const startDate = new Date(course.startDate).toLocaleDateString();
					const endDate = new Date(course.endDate);
					const endDateString = endDate.toLocaleDateString();
					const topics = course.topic_names.replace(/,/g, ', ');
					const isCourseEnded =
						endDate.setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

					return (
						<Tooltip placement="top" title={isCourseEnded ? 'Course has ended' : ''}>
							<div
								key={course.courseid}
								className={`p-6 bg-white shadow-md rounded-lg relative ${
									isCourseEnded ? 'opacity-50' : ''
								}`}
							>
								{isCourseEnded && (
									<div className="absolute top-2 right-2">
										<ReportIcon style={{color: 'red'}} />
									</div>
								)}
								<h2 className="text-2xl underline font-bold mb-2 text-black">
									{course.course_name + ' ' + course.code}
								</h2>
								<p className="mb-1">
									<strong>Topics:</strong> {topics}
								</p>
								<p className="mb-1">
									<strong>Start Date:</strong> {startDate}
								</p>
								<p className="mb-1">
									<strong>End Date:</strong> {endDateString}
								</p>
								<p className="mb-1">
									<strong>Course Instructors:</strong> {course.instructor_name}
								</p>
								<button
									className={`mt-4 font-bold py-2 px-4 rounded ${
										isCourseEnded
											? 'bg-metropoliaSupportRed hover:bg-red-900'
											: 'bg-metropoliaTrendGreen hover:bg-green-700'
									} text-white`}
									onClick={() =>
										navigate(`/student/courses/attendance/${course.usercourseid}`)
									}
								>
									View your attendance
								</button>
							</div>
						</Tooltip>
					);
				})}
			</div>
		</div>
	);
};

export default StudentCourses;
