import CircularProgress from '@mui/material/CircularProgress';
import React, {useContext, useEffect, useState} from 'react';
import Card from '../../../components/main/cards/Card';
import WelcomeModal from '../../../components/main/modals/WelcomeModal';
import MainViewTitle from '../../../components/main/titles/MainViewTitle';
import {UserContext} from '../../../contexts/UserContext';
import apihooks from '../../../hooks/ApiHooks';

const MainView: React.FC = () => {
	const {user} = useContext(UserContext);
	const [courses, setCourses] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	useEffect(() => {
		const fetchCourses = async () => {
			setIsLoading(true);
			if (user) {
				// Get token from local storage
				const token: string | null = localStorage.getItem('userToken');
				if (!token) {
					throw new Error('No token available');
				}
				// Fetch courses by instructor email
				const fetchedCourses = await apihooks.getAllCoursesByInstructorEmail(
					user.email,
					token,
				);
				setCourses(fetchedCourses);
			}
			setIsLoading(false);
		};
		fetchCourses();
	}, [user]);

	return (
		<>
			<MainViewTitle role={'Teacher'} />
			{isLoading ? (
				<div className="flex justify-center items-center">
					<CircularProgress />
				</div>
			) : (
				<>
					<div className="flex flex-col md:flex-row flex-wrap p-5 justify-center items-center gap-4">
						{courses.length === 0 && (
							<div>
								<div className="animate-bounce p-2 rounded-md bg-metropoliaMainOrange gap-1 flex md:flex-row flex-col items-center">
									<p className="text-center text-white text-lg">Start Here!</p>
									<div className="w-4 h-4 border-t-2 border-r-2 transform md:rotate-45 rotate-135 border-white"></div>
								</div>
							</div>
						)}
						<Card
							path="/teacher/courses/create"
							title="Create new Course"
							description="Create a new course for your students"
						/>

						{courses.length >= 0 && (
							<Card
								path="/teacher/helpvideos"
								title="Instructions"
								description="See instructions for all available tasks"
							/>
						)}

						{courses.length > 0 && (
							<>
								<Card
									path="/teacher/students"
									title="Manage Students"
									description="Manage your students details"
								/>

								<Card
									path="/teacher/courses/"
									title="Your Courses"
									description="View all of your courses"
								/>

								<Card
									path="/teacher/attendance/createlecture"
									title="Create new Lecture"
									description="Open attendance gathering"
								/>
								<Card
									path="/teacher/courses/stats"
									title="Show Attendances stats"
									description="Open attendance stats page"
								/>
							</>
						)}
					</div>
					<WelcomeModal />
				</>
			)}
		</>
	);
};

export default MainView;
