import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from '@mui/material';

import CircularProgress from '@mui/material/CircularProgress';
import React, {useContext, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {UserContext} from '../../../contexts/UserContext';
import apiHooks from '../../../hooks/ApiHooks';
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
}

const AdminAllLectures: React.FC = () => {
	const [lectures, setLectures] = useState<Lecture[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [filterOpen, setFilterOpen] = useState(true);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedLecture, setSelectedLecture] = useState<string | null>(null);
	const [action, setAction] = useState<'close' | 'delete' | null>(null);
	const {user} = useContext(UserContext);
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
	const navigate = useNavigate();
	const [isExpanded, setIsExpanded] = useState(false);
	const [extraStats, setExtraStats] = useState(false);
	const getLectures = async () => {
		const token: string | null = localStorage.getItem('userToken');
		if (!token) {
			toast.error('No token available');
			setIsLoading(false);
			return false;
		}
		try {
			const result = await apiHooks.fetchAllLectures(token);
			if (!Array.isArray(result)) {
				toast.error('Expected an array from fetchAllLectures');
				setIsLoading(false);
				return false;
			}
			const sortedLectures = result.sort((a, b) => {
				return sortOrder === 'asc'
					? a.lectureid - b.lectureid
					: b.lectureid - a.lectureid;
			});
			setLectures(sortedLectures);
			setIsLoading(false);
			return true;
		} catch (error) {
			toast.error('Error fetching lectures');
			setIsLoading(false);
			return false;
		}
	};

	useEffect(() => {
		if (user) {
			setIsLoading(true);
			getLectures();

			const intervalId = setInterval(() => {
				getLectures();
			}, 120000); // calls getLectures every 120 seconds

			// clear interval on component unmount
			return () => clearInterval(intervalId);
		}
		return () => {};
	}, [user, sortOrder]);

	if (isLoading) {
		return <CircularProgress />;
	}

	const filteredLectures = filterOpen
		? lectures.filter(lecture => lecture.state === 'open')
		: lectures;

	const handleDialogOpen = (lectureid: string, action: 'close' | 'delete') => {
		setSelectedLecture(lectureid);
		setAction(action);
		setDialogOpen(true);
	};

	const handleDialogClose = () => {
		setSelectedLecture(null);
		setAction(null);
		setDialogOpen(false);
	};

	const handleConfirm = async () => {
		const token: string | null = localStorage.getItem('userToken');
		if (!token) {
			toast.error('No token available');
			return;
		}
		if (selectedLecture) {
			try {
				if (action === 'close') {
					await apiHooks.closeLectureByLectureId(selectedLecture, token);
					toast.success('Lecture closed successfully ' + selectedLecture);
				} else if (action === 'delete') {
					await apiHooks.deleteLectureByLectureId(selectedLecture, token);
					toast.success('Lecture deleted successfully ' + selectedLecture);
				}
				const result = await apiHooks.fetchAllLectures(token);
				const sortedLectures = result.sort((a, b) => {
					return sortOrder === 'asc'
						? a.lectureid - b.lectureid
						: b.lectureid - a.lectureid;
				});
				setLectures(sortedLectures);
			} catch (error) {
				toast.error('Failed to perform action: ' + (error as Error).message);
			}
		}
		handleDialogClose();
	};
	const toggleSortOrder = () => {
		setSortOrder(prevSortOrder => (prevSortOrder === 'asc' ? 'desc' : 'asc'));
	};
	const handleRowClick = (courseId: string, lectureId: string) => {
		navigate(`./${courseId}/${lectureId}`);
	};
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

	// Find lecture with highest attendance
	const highestAttendedLecture = lectures.reduce(
		(max, lecture) => (lecture.attended > max.attended ? lecture : max),
		lectures[0],
	);
	// Find lecture with highest not attended
	const highestNotAttendedLecture = lectures.reduce(
		(max, lecture) => (lecture.notattended > max.notattended ? lecture : max),
		lectures[0],
	);

	// Find lecture with lowest attendance
	const lowestAttendedLecture = lectures.reduce(
		(min, lecture) => (lecture.attended < min.attended ? lecture : min),
		lectures[0],
	);

	// Find lecture with lowest not attended

	const lowestNotAttendedLecture = lectures.reduce(
		(min, lecture) => (lecture.notattended < min.notattended ? lecture : min),
		lectures[0],
	);

	return (
		<div className="relative xl:w-fit w-full bg-white p-5 rounded-lg">
			<div className="space-x-2 mt-4 mb-4">
				<button
					onClick={() => setFilterOpen(!filterOpen)}
					className="bg-metropoliaMainOrange h-fit transition hover:hover:bg-metropoliaSecondaryOrange text-white font-bold sm:py-2 py-1 px-2 sm:px-4 rounded focus:outline-none focus:shadow-outline"
				>
					{filterOpen ? 'Show All Lectures' : 'Show Open Lectures Only'}
				</button>
				<button
					onClick={toggleSortOrder}
					className="bg-metropoliaMainOrange h-fit transition hover:hover:bg-metropoliaSecondaryOrange text-white font-bold sm:py-2 py-1 px-2 sm:px-4 rounded focus:outline-none focus:shadow-outline"
				>
					{sortOrder === 'asc' ? 'Sort by Newest' : 'Sort by Oldest'}
				</button>
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className="bg-metropoliaMainOrange h-fit transition hover:hover:bg-metropoliaSecondaryOrange text-white font-bold sm:py-2 py-1 px-2 sm:px-4 rounded focus:outline-none focus:shadow-outline"
				>
					{isExpanded ? 'Shrink Table' : 'Expand to full'}
				</button>
				{!filterOpen && (
					<button
						onClick={() => setExtraStats(!extraStats)}
						className="bg-metropoliaMainOrange h-fit transition hover:hover:bg-metropoliaSecondaryOrange text-white font-bold sm:py-2 py-1 px-2 sm:px-4 rounded focus:outline-none focus:shadow-outline"
					>
						{extraStats ? 'Hide Stats' : 'Show Stats'}
					</button>
				)}
			</div>
			{extraStats && (
				<>
					<h2 className="text-lg mb-2">
						Total Lectures: {totalLectures} | Attendance Ratio:{' '}
						{attendanceRatio.toFixed(2)}%
					</h2>

					{highestAttendedLecture && (
						<h2 className="text-md mb-2">
							Highest Attended: {highestAttendedLecture.attended} (Lecture ID:{' '}
							{highestAttendedLecture.lectureid}) | Lowest Attended:{' '}
							{lowestAttendedLecture.attended} (Lecture ID:{' '}
							{lowestAttendedLecture.lectureid})
						</h2>
					)}
					{highestNotAttendedLecture && (
						<h2 className="text-md mb-2">
							Highest Not Attended: {highestNotAttendedLecture.notattended} (Lecture
							ID: {highestNotAttendedLecture.lectureid}) | Lowest Not Attended:{' '}
							{lowestNotAttendedLecture.notattended} (Lecture ID:{' '}
							{lowestNotAttendedLecture.lectureid})
						</h2>
					)}
				</>
			)}

			<TableContainer
				className={`relative bg-gray-100 overflow-auto ${
					isExpanded ? 'h-screen' : 'h-[384px]'
				}`}
			>
				<Table className="table-auto">
					<TableHead className="sticky border-t-2 border-black top-0 bg-white z-10">
						<TableRow>
							<TableCell>Lecture ID</TableCell>

							<TableCell>Teacher Email</TableCell>
							<TableCell>Course name</TableCell>
							<TableCell>Course code</TableCell>
							<TableCell>Topic name</TableCell>
							<TableCell>Date</TableCell>
							<TableCell>am/pm</TableCell>
							<TableCell>Attendance</TableCell>
							<TableCell>Total</TableCell>
							<TableCell>Ratio(%)</TableCell>
							<TableCell>State</TableCell>
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredLectures.length > 0 ? (
							filteredLectures.map(lecture => (
								<TableRow
									key={lecture.lectureid}
									className={`hover:bg-gray-200 ${
										lecture.attended === 0 ? 'bg-red-200' : ''
									}`}
								>
									<TableCell>{lecture.lectureid}</TableCell>

									<TableCell>{lecture.teacheremail}</TableCell>
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
										}`}
									>
										<span className="text-metropoliaTrendGreen">{lecture.attended}</span>/
										<span className="text-metropoliaSupportRed">
											{lecture.notattended}
										</span>
									</TableCell>
									<TableCell>{lecture.attended + lecture.notattended}</TableCell>
									<TableCell>
										{Math.round(
											(lecture.attended / (lecture.attended + lecture.notattended)) * 100,
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
											}
										>
											{lecture.state}
										</span>
									</TableCell>
									<TableCell>
										<div className="flex gap-1">
											<button
												color="primary"
												onClick={() =>
													handleRowClick(lecture.courseid, lecture.lectureid.toString())
												}
												className="bg-metropoliaMainOrange h-fit transition hover:hover:bg-metropoliaSecondaryOrange text-white font-bold sm:py-2 py-1 px-2 sm:px-4 rounded focus:outline-none focus:shadow-outline"
											>
												Details
											</button>
											{lecture.state === 'open' && (
												<button
													color="success"
													onClick={() =>
														handleDialogOpen(lecture.lectureid.toString(), 'close')
													}
													className="bg-metropoliaTrendGreen h-fit transition hover:hover:bg-green-600 text-white font-bold sm:py-2 py-1 px-2 sm:px-4 rounded focus:outline-none focus:shadow-outline"
												>
													Close
												</button>
											)}
											{(lecture.state === 'open' || lecture.state === 'closed') && (
												<button
													color="error"
													onClick={() =>
														handleDialogOpen(lecture.lectureid.toString(), 'delete')
													}
													className="bg-metropoliaSupportRed h-fit transition hover:hover:bg-red-600 text-white font-bold sm:py-2 py-1 px-2 sm:px-4 rounded focus:outline-none focus:shadow-outline"
												>
													Delete
												</button>
											)}
										</div>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={10} align="center">
									{filterOpen ? 'No data available in open state' : 'No data available'}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<Dialog open={dialogOpen} onClose={handleDialogClose}>
				<DialogTitle>{`Are you sure you want to ${action} the lecture?`}</DialogTitle>
				<DialogContent>
					<DialogContentText>This action cannot be undone.</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogClose} color="primary">
						Cancel
					</Button>
					<Button onClick={handleConfirm} color="primary" autoFocus>
						Confirm
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default AdminAllLectures;
