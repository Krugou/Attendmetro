import React from 'react';
/**
 * SuccessAlertProps interface represents the structure of the SuccessAlert props.
 * It includes properties for the success alert message and a function to close the alert.
 */
interface SuccessAlertProps {
	successAlert: string;
	onClose: () => void;
}
/**
 * SuccessAlert component.
 * This component is responsible for displaying a success alert message.
 * It uses the successAlert and onClose props to determine the message and what happens when the alert is closed.
 * The alert is displayed in a modal that is centered on the screen.
 * The modal contains a title, the success message, and a close button.
 * The visibility of the modal is controlled by the successAlert prop.
 * If the successAlert prop is truthy, the modal is displayed; otherwise, it is hidden.
 *
 * @param {SuccessAlertProps} props The props that define the success alert message and the close function.
 * @returns {JSX.Element} The rendered SuccessAlert component.
 */
const SuccessAlert: React.FC<SuccessAlertProps> = ({successAlert, onClose}) => {
	return (
		<div
			className={`fixed inset-0 flex items-center justify-center ${
				successAlert ? 'block' : 'hidden'
			}`}
		>
			<div className="modal-container mx-auto p-4 mt-10 rounded-lg bg-green-100 shadow-lg w-96">
				<h2 className="text-xl text-green-600 font-bold mb-4">Success</h2>
				<div className="mb-4">
					{successAlert && <p className="text-green-700">{successAlert}</p>}
				</div>
				<div className="flex justify-end">
					<button
						onClick={onClose}
						className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded"
					>
						Close
					</button>
				</div>
			</div>
		</div>
	);
};

export default SuccessAlert;
