import createPool from '../config/createPool.js';
import ServerSettingsModel from '../models/serversettingsmodel.js';

const pool = createPool('ADMIN');
/**
 * AdminController interface represents the structure of the admin controller.
 */
interface AdminController {
	/**
	 * Gets the server settings.
	 *
	 * @returns {Promise<any>} A promise that resolves to the server settings.
	 */
	getServerSettings: () => Promise<any>;
	/**
	 * Updates the server settings.
	 *
	 * @param {any} speedofhash - The speed of hash.
	 * @param {any} leewayspeed - The leeway speed.
	 * @param {any} timeouttime - The timeout time.
	 * @param {any} attendancethreshold - The attendance threshold.
	 * @returns {Promise<any>} A promise that resolves when the server settings have been updated.
	 */
	updateServerSettings: (
		speedofhash: any,
		leewayspeed: any,
		timeouttime: any,
		attendancethreshold: any,
	) => Promise<any>;
}
/**
 * adminController is an object that implements the AdminController interface.
 * It provides methods to get and update the server settings.
 *
 * @type {AdminController}
 */
const adminController: AdminController = {
	async getServerSettings() {
		try {
			const serverSettings = await ServerSettingsModel.getServerSettings(pool);
			return serverSettings; // use the serverSettings variable
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
	async updateServerSettings(
		speedofhash,
		leewayspeed,
		timeouttime,
		attendancethreshold,
	) {
		try {
			await ServerSettingsModel.updateServerSettings(
				pool,
				speedofhash,
				leewayspeed,
				timeouttime,
				attendancethreshold,
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	},
};

export default adminController;
