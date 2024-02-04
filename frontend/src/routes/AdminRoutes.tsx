import React from 'react';
import {Route, Routes} from 'react-router-dom';
import AdminFeedback from '../views/main/admin/AdminFeedback.tsx';
import AdminMainView from '../views/main/admin/AdminMainView.tsx';
import AdminNewUser from '../views/main/admin/AdminNewUser.tsx';
import AdminProfile from '../views/main/admin/AdminProfile.tsx';
import AdminStats from '../views/main/admin/AdminStats.tsx';
import AdminCoursesRoutes from './admin/AdminCourseRoutes';
import AdminLecturesRoutes from './admin/AdminLectureRoutes.tsx';
import AdminSettingsRoutes from './admin/AdminSettingsRoutes.tsx';
import AdminUserRoutes from './admin/AdminUserRoutes';
import Team from '../views/main/Team.tsx';
/**
 * AdminRoutes component.
 * This component is responsible for defining the routes for the admin section of the application.
 * It includes routes for the main view, courses, users, profile, help videos, settings, and statistics.
 * Each route is associated with a specific component that will be rendered when the route is accessed.
 * The '*' route is a catch-all route that will render the AdminMainView component if no other routes match.
 *
 * @returns {JSX.Element} The rendered AdminRoutes component.
 */
const AdminRoutes = () => {
	return (
		<Routes>
			<Route path="mainview" element={<AdminMainView />} />
			<Route path="courses/*" element={<AdminCoursesRoutes />} />
			<Route path="users/*" element={<AdminUserRoutes />} />
			<Route path="profile" element={<AdminProfile />} />
			<Route path="settings/*" element={<AdminSettingsRoutes />} />
			<Route path="*" element={<AdminMainView />} />
			<Route path="stats" element={<AdminStats />} />
			<Route path="team" element={<Team />} />

			<Route path="lectures/*" element={<AdminLecturesRoutes />} />
			<Route path="newuser" element={<AdminNewUser />} />
			<Route path="feedback" element={<AdminFeedback />} />
		</Routes>
	);
};

export default AdminRoutes;
