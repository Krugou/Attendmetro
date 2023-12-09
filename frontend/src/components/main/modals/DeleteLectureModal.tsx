import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

interface lecture {
	teacher: string;
	start_date: string;
	timeofday: string;
}

interface DeleteLectureModalProps {
	open: boolean;
	onClose?: () => void;
	onDelete: () => void;
	onCloseLecture?: () => void;
	lecture?: lecture;
}

const DeleteLectureModal: React.FC<DeleteLectureModalProps> = ({
	open,
	onClose,
	onDelete,
	lecture,
	onCloseLecture,
}) => (
	<Dialog
		open={open}
		onClose={onClose}
		aria-labelledby="alert-dialog-title"
		aria-describedby="alert-dialog-description"
	>
		<DialogTitle id="alert-dialog-title">
			{'Deal with previous lecture first'}
		</DialogTitle>
		<DialogContent>
			<DialogContentText id="alert-dialog-description">
				{`There is already an open lecture for this course by ${
					lecture?.teacher
				} at ${
					lecture?.start_date
						? new Date(lecture?.start_date).toLocaleDateString()
						: ''
				} time of day:  ${
					lecture?.timeofday
				}.  Do you want to delete it or close it?`}
				<br />
				<br />
				{`Closing means counting the lecture's attendance and deleting means completely deleting it's attendance.`}
			</DialogContentText>
		</DialogContent>
		<DialogActions>
			<Button onClick={onDelete} autoFocus>
				Delete Previous
			</Button>
			<Button onClick={onCloseLecture} autoFocus>
				CLOSE Previous
			</Button>
		</DialogActions>
	</Dialog>
);

export default DeleteLectureModal;