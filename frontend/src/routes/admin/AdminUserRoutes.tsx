import React from 'react';
import {Route, Routes} from 'react-router-dom';
import AdminMainView from '../../views/main/admin/AdminMainView';
import AdminUsers from '../../views/main/admin/AdminUsers';
import AdminUserModify from '../../views/main/admin/Users/AdminUserModify';

const AdminUserRoutes: React.FC = () => {
	return (
		<Routes>
			<Route path="/" element={<AdminUsers />} />
			<Route path="/:userid/modify" element={<AdminUserModify />} />
			<Route path="*" element={<AdminMainView />} />
		</Routes>
	);
};

export default AdminUserRoutes;
