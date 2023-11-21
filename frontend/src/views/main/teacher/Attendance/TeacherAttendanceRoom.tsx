import React, {useEffect, useState} from 'react';
import QRCode from 'react-qr-code';
import {useParams} from 'react-router-dom';
import io, {Socket} from 'socket.io-client';
import Attendees from '../../../../components/main/course/attendance/Attendees';
import CourseStudents from '../../../../components/main/course/attendance/CourseStudents';
import apiHooks from '../../../../hooks/ApiHooks';
import BackgroundContainer from "../../../../components/main/background/BackgroundContainer";
const AttendanceRoom: React.FC = () => {
	const {lectureid} = useParams<{lectureid: string}>();
	const [socket, setSocket] = useState<Socket | null>(null);
	const [arrayOfStudents, setArrayOfStudents] = useState<string[]>([]);
	const [courseStudents, setCourseStudents] = useState<Student[]>([]);
	const [serverMessage, setServerMessage] = useState('');

	interface Student {
		studentnumber: string;
		first_name: string;
		last_name: string;
		userid: number;
	}
	const [hashValue, setHashValue] = useState('');
	const handleLectureFinished = () => {
		const dateToday = new Date().toISOString().slice(0, 19).replace('T', ' ');
		const studentnumbers = courseStudents.map(student => student.studentnumber);
		if (lectureid) {
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('No token available');
			}
			apiHooks.finishLecture(dateToday, studentnumbers, lectureid, token);
		}
	};
	useEffect(() => {
		if (!socket) {
			const socketURL =
				import.meta.env.MODE === 'development' ? 'http://localhost:3002' : '/';
			const socketPath =
				import.meta.env.MODE === 'development' ? '' : '/api/socket.io';

			const newSocket = io(socketURL, {
				path: socketPath,
				transports: ['websocket'],
			});
			setSocket(newSocket);
			newSocket.on('connect', () => {
				console.log('Socket connected');
			});

			newSocket.emit('createAttendanceCollection', lectureid);

			newSocket.on('getallstudentsinlecture', courseStudents => {
				setCourseStudents(courseStudents);
			});
			newSocket.on('updatecoursestudents', courseStudents => {
				console.log(
					'🚀 ~ file: TeacherAttendanceRoom.tsx:54 ~ useEffect ~ courseStudents:',
					courseStudents,
				);
				setCourseStudents(courseStudents);
			});
			newSocket.on(
				'updateAttendanceCollectionData',
				(
					hash,
					changeTime,
					lectureid,
					servertime,
					arrayOfStudents,
					courseStudents,
				) => {
					setHashValue(hash + '/' + lectureid);
					setArrayOfStudents(arrayOfStudents);
					setServerMessage(
						' change time: ' +
							changeTime +
							' lectureid: ' +
							lectureid +
							' server time: ' +
							servertime,
					);
					setCourseStudents(courseStudents);
				},
			);
			newSocket.on('disconnect', () => {
				console.log('Disconnected from the server');
			});
		}
	}, [lectureid]);

	useEffect(() => {
		return () => {
			// Disconnect the socket when the component unmounts
			if (socket) {
				socket.disconnect();
			}
		};
	}, [socket]);

	return (
		<BackgroundContainer>
		<div className="flex flex-col w-full xl:w-4/5 2xl:w-3/4 h-full p-5 bg-gray-100">
			<div className="flex flex-col-reverse sm:flex-row justify-between items-start">
				<div className="flex sm:flex-row items-center flex-col-reverse w-full ">
					<QRCode
						size={256}
						value={hashValue}
						viewBox={`0 0 256 256`}
						className="md:w-[32em] w-full h-full"
					/>

					<Attendees arrayOfStudents={arrayOfStudents} />
				</div>
				<h2 className="text-2xl">
					<label className="text-metropoliaTrendGreen">{arrayOfStudents.length}</label>/<label className="text-metropoliaSupportRed">{courseStudents.length}</label>
				</h2>
			</div>
			<button
				onClick={handleLectureFinished}
				className="bg-metropoliaMainOrange sm:w-fit w-full mt-5 p-5 hover:bg-metropoliaSecondaryOrange text-white font-bold py-2 px-4 rounded"
			>
				Finish Lecture
			</button>
			<CourseStudents coursestudents={courseStudents} />
			<div className="flex flex-col ">
				<div className="h-auto mx-auto max-w-10 w-full">{serverMessage}</div>
			</div>
		</div>
		</BackgroundContainer>
	);
};

export default AttendanceRoom;
