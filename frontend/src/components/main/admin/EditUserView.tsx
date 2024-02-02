import React, {useEffect, useState} from 'react';
import apihooks from '../../../hooks/ApiHooks';
/**
 * Represents a user in the system.
 */
interface User {
	userid: string;
	username: string | null;
	email: string;
	staff: number;
	first_name: string;
	last_name: string;
	created_at: string;
	studentnumber: number;
	studentgroupid: number;
	roleid: number;
	GDPR: number;
	role: string;
}
/**
 * Represents the props for the `EditUserView` component.
 */
interface EditUserViewProps {
	user: User;
	onSave: (user: User) => void;
}
/**
 * Represents a student group in the system.
 */
interface StudentGroup {
	studentgroupid: number;
	group_name: string;
	// include other properties if they exist
}
/**
 * Represents a role in the system.
 */
interface Role {
	roleid: number;
	name: string;
	// include other properties if they exist
}
/**
 * The EditUserView component allows the user to edit a user's details.
 * @param {EditUserViewProps} props - The props.
 */
const EditUserView: React.FC<EditUserViewProps> = ({user, onSave}) => {
	// State for the edited user, roles, student groups, and whether the student number is taken
	const [editedUser, setEditedUser] = useState(user);
	const [roles, setRoles] = useState<Role[]>([]);
	const [studentGroups, setStudentGroups] = useState<StudentGroup[]>([]);
	const [isStudentNumberTaken, setIsStudentNumberTaken] = useState(false);
	const [isStudentEmailTaken, setIsStudentEmailTaken] = useState(false);
	// State for the original student number and timeout ID
	const [originalStudentEmail] = useState(user.email);
	const [originalStudentNumber] = useState(user.studentnumber);
	const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
	const [isSaveButtonDisabled, setSaveButtonDisabled] = useState(false);

	/**
	 * Handles changes to the input fields.
	 * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} event - The change event.
	 */
	const handleInputChange = (
		event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		let value = event.target.value;
		if (event.target.name === 'studentnumber') {
			value = isNaN(parseInt(value, 10)) ? '' : parseInt(value, 10).toString();
		}
		setEditedUser({
			...editedUser,
			[event.target.name]: value,
		});
	};

	/**
	 * Handles the click event of the save button.
	 */
	const handleSaveClick = () => {
		onSave(editedUser);
	};
	// Fetch all roles when the component mounts
	useEffect(() => {
		const getRoles = async () => {
			// Get token from local storage
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('No token available');
			}
			const fetchedRoles = await apihooks.fetchAllRoles(token);

			setRoles(fetchedRoles);
		};

		getRoles();
	}, []);

	useEffect(() => {
		setSaveButtonDisabled(isStudentNumberTaken || isStudentEmailTaken);
	}, [isStudentNumberTaken, isStudentEmailTaken]);

	// Check if the student number exists when it changes
	useEffect(() => {


		const checkStudentNumber = async () => {
			// Get token from local storage
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('No token available');
			}
			// Only check if the student number has changed from the original
			if (editedUser.studentnumber !== originalStudentNumber) {
				const response = await apihooks.checkStudentNumberExists(
					editedUser.studentnumber.toString(),
					token,
				);

				if (response.exists) {
					setIsStudentNumberTaken(true);
				} else {
					setIsStudentNumberTaken(false);
				}
			}
			console.log(
				'checkStudentNumber ' +
					editedUser.studentnumber +
					' ' +
					originalStudentNumber,
			);
			if (Number(editedUser.studentnumber) === Number(originalStudentNumber)) {
				setIsStudentNumberTaken(false);
			}
		};

		if (editedUser.studentnumber) {
			// If there is a previous timeout, clear it
			if (timeoutId) {
				clearTimeout(timeoutId);
			}

			// Start a new timeout
			const newTimeoutId = setTimeout(() => {
				checkStudentNumber();
			}, 500); // 500ms delay

			// Save the timeout ID so it can be cleared if the student number changes
			setTimeoutId(newTimeoutId);
		}

		const checkStudentEmail = async () => {
			// Get token from local storage
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('No token available');
			}
			// Only check if the student number has changed from the original
			if (editedUser.email !== originalStudentEmail) {
				const response = await apihooks.checkStudentEmailExists(
					editedUser.email,
					token,
				);

				if (response.exists) {
					setIsStudentEmailTaken(true);
				} else {
					setIsStudentEmailTaken(false);
				}
			}
			console.log(
				'checkStudentEmail ' +
				editedUser.email +
				' ' +
				originalStudentEmail,
			);
			if (editedUser.email === originalStudentEmail) {
				setIsStudentEmailTaken(false);
			}
		};

		if (editedUser.email) {
			// If there is a previous timeout, clear it
			if (timeoutId) {
				clearTimeout(timeoutId);
			}

			// Start a new timeout
			const newTimeoutId = setTimeout(() => {
				checkStudentEmail();
			}, 500); // 500ms delay

			// Save the timeout ID so it can be cleared if the student number changes
			setTimeoutId(newTimeoutId);
		}

	}, [editedUser.studentnumber, editedUser.email, originalStudentNumber, originalStudentEmail]);

	// Fetch all student groups when the component mounts
	useEffect(() => {
		const getStudentGroups = async () => {
			// Get token from local storage
			const token: string | null = localStorage.getItem('userToken');
			if (!token) {
				throw new Error('No token available');
			}
			const fetchedStudentGroups = await apihooks.fetchStudentGroups(token);

			setStudentGroups(fetchedStudentGroups);
		};
		getStudentGroups();
	}, []);

	/**
	 * Renders the component.
	 */
	return (
		<div className="flex w-fit flex-col justify-center items-center">
			<h1 className="text-2xl p-3 bg-white rounded-lg font-bold mb-4">
				Edit User {editedUser.userid}
			</h1>
			<div className="w-full bg-white p-5 rounded-lg">
				{editedUser.created_at && (
					<div>
						<span className="text-gray-700 font-bold">Created At</span>
						<p className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline">
							{new Date(editedUser.created_at).toISOString().substring(0, 16)}
						</p>
					</div>
				)}
				{editedUser.last_name && (
					<label className="block mt-4">
						<span className="text-gray-700 font-bold">Last Name</span>
						<input
							required={!!editedUser.last_name}
							type="text"
							name="last_name"
							value={editedUser.last_name}
							onChange={handleInputChange}
							className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
						/>
					</label>
				)}
				{editedUser.first_name && (
					<label className="block mt-4">
						<span className="text-gray-700 font-bold">First Name</span>
						<input
							required={!!editedUser.first_name}
							type="text"
							name="first_name"
							value={editedUser.first_name}
							onChange={handleInputChange}
							className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
						/>
					</label>
				)}

				{editedUser.email !== undefined &&
					editedUser.email !== null && (
					<label className="block mt-4">
						<span className="text-gray-700 font-bold">Email</span>
						<input
							required={!!editedUser.email}
							type="email"
							name="email"
							value={editedUser.email}
							onChange={handleInputChange}
							className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
						/>
						{isStudentEmailTaken && (
							<span className="text-red-500">Student email taken</span>
						)}
					</label>
				)}
				{editedUser.username && (
					<label className="block mt-4">
						<span className="text-gray-700 font-bold">Username</span>
						<input
							required={!!editedUser.username}
							type="text"
							name="username"
							value={editedUser.username}
							onChange={handleInputChange}
							className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
						/>
					</label>
				)}
				{roles.length > 0 && (
					<label className="block mt-4">
						<span className="text-gray-700 font-bold">Role</span>
						<select
							required={!!editedUser.roleid}
							name="roleid"
							value={editedUser.roleid}
							onChange={handleInputChange}
							className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
						>
							{roles.map(role => (
								<option key={role.roleid} value={role.roleid}>
									{role.name}
								</option>
							))}
						</select>
					</label>
				)}

				{editedUser.GDPR !== undefined && (
					<label className="block mt-4">
						<span className="text-gray-700 font-bold">GDPR</span>
						<select
							required={editedUser.GDPR !== undefined}
							name="GDPR"
							value={editedUser.GDPR}
							onChange={handleInputChange}
							className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
						>
							<option value={0}>Not Accepted</option>
							<option value={1}>Accepted</option>
						</select>
					</label>
				)}

				{editedUser.studentnumber !== undefined &&
					editedUser.studentnumber !== null && (
						<label className="block mt-4">
							<span className="text-gray-700 font-bold">Student Number</span>
							<input
								type="number"
								name="studentnumber"
								value={editedUser.studentnumber}
								onChange={handleInputChange}
								className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
							/>
							{isStudentNumberTaken && (
								<span className="text-red-500">Student number taken</span>
							)}
						</label>
					)}

				{editedUser.studentgroupid !== undefined &&
					editedUser.studentgroupid !== null && (
						<label className="block mt-4">
							<span className="text-gray-700 font-bold">Student Group</span>
							<select
								required={!!editedUser.studentgroupid}
								name="studentgroupid"
								value={editedUser.studentgroupid}
								onChange={handleInputChange}
								className="shadow appearance-none border rounded-3xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
							>
								{studentGroups.map(studentGroup => (
									<option
										key={studentGroup.studentgroupid}
										value={studentGroup.studentgroupid}
									>
										{studentGroup.group_name}
									</option>
								))}
							</select>
						</label>
					)}
				<div className="text-center">
					<button
						onClick={handleSaveClick}
						disabled={isSaveButtonDisabled}
						className={`mt-4 px-4 w-[10em] py-2 ${
							isSaveButtonDisabled
								? 'bg-gray-500'
								: 'bg-metropoliaTrendGreen hover:bg-green-600 transition'
						} text-white rounded-md`}
					>
						Save
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditUserView;
