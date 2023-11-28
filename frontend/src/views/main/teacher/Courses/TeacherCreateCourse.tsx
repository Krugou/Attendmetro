import React from 'react';

import BackgroundContainer from '../../../../components/main/background/BackgroundContainer';
import GeneralLinkButton from '../../../../components/main/buttons/GeneralLinkButton';

const TeacherCreateCourse: React.FC = () => {
	return (
		<BackgroundContainer>
			<div className="w-full pt-10 pb-10">
				<h1 className="text-4xl text-center font-bold mb-8">Create Course</h1>
				<p className="text-center mb-4">Choose between routes</p>
				<div className="flex justify-center space-x-4">
					<GeneralLinkButton path="easy" text="Excel Mode" />
					<GeneralLinkButton path="custom" text="Custom Mode" />
				</div>
			</div>
		</BackgroundContainer>
	);
};

export default TeacherCreateCourse;
