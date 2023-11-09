import React, {useContext} from 'react';
import {UserContext} from '../../../contexts/UserContext';

/*
const getAttendanceColorClass = (attendance: number): string => {
	if (attendance >= 90) {
		return 'bg-metropoliaTrendGreen';
	} else if (attendance >= 50) {
		return 'bg-metropoliaMainOrange';
	} else {
		return 'bg-metropoliaSupportRed';
	}
};
*/
const StudentProfile: React.FC = () => {
	const {user} = useContext(UserContext);

	// Error handling
	if (!user) {
		return <div>No user data available.</div>;
	}

	//const attendanceColorClass = getAttendanceColorClass(attendance);
	console.log(user + 'user');
	return (
		<div className="flex flex-col items-center justify-center h-1/2 p-10 bg-gray-100 font-sans">
			<h1 className="text-xl sm:text-4xl font-bold mb-8 mt-5">Student Profile</h1>
			<div className="text-md sm:text-xl mb-4">
				<p className="mb-5">
					<strong>Name:</strong> <span className="profileStat">{user.username}</span>
				</p>
				<p className="mb-5">
					<strong>Email:</strong> <span className="profileStat">{user.email}</span>
				</p>
			</div>
		</div>
	);
};

export default StudentProfile;
