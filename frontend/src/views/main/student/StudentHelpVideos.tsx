import React from 'react';
import VideoDropdown from '../../../components/main/dropdown/VideoDropdown'; // Import the VideoDropdown component
/**
 * StudentHelpVideos component.
 * This component is responsible for rendering the help videos for students.
 * It uses the VideoDropdown component to display each video with a title.
 */
const StudentHelpVideos: React.FC = () => {
    return (
        <div className="w-full p-5">
            <h1 className="text-2xl font-bold p-3 bg-white w-fit m-auto rounded-lg mb-10 text-center">
                Student Help Videos
            </h1>
            <div className="space-y-6 flex flex-col">
                <VideoDropdown title="How do I create a course?" src="video-url-1.mp4" />
                <VideoDropdown
                    title="How do I create an attendance?"
                    src="video-url-2.mp4"
                />
                <VideoDropdown
                    title="How do I access attendance data on my course?"
                    src="video-url-2.mp4"
                />
                <VideoDropdown
                    title="How do I access my students details?"
                    src="video-url-2.mp4"
                />
                <VideoDropdown
                    title="How do I access and modify my course details?"
                    src="video-url-2.mp4"
                />
                <VideoDropdown
                    title="How do I access my students attendance?"
                    src="video-url-2.mp4"
                />
            </div>
        </div>
    );
};

export default StudentHelpVideos;
