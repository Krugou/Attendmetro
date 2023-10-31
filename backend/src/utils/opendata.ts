import { config } from 'dotenv';
import doFetch from './fetch.js';
config();


const CheckOpenDataReservations = async (code?: string, studentGroup?: string) => {

    const url = 'https://opendata.metropolia.fi/r1/reservations/search';
    const body = JSON.stringify({
        ...(code ? { realization: [code] } : {}),
        ...(studentGroup ? { studentGroup: [studentGroup] } : {}),
    });

    const options = {
        method: 'POST',
        headers: {
            Authorization: 'Basic ' + btoa(process.env.APIKEYMETROPOLIA || ''),
            'Content-Type': 'application/json',
        },
        body: body,
    };

    const response = await doFetch(url, options as any

    );

    if (!response.ok) {
        throw new Error(`Fetch request failed with status ${response.status}`);
    }

    const data = await response.json();

    return data;
};
const checkOpenDataRealization = async (code: string) => {
    console.log("🚀 ~ file: opendata.ts:36 ~ checkOpenDataRealization ~ code:", code);
    const url = 'https://opendata.metropolia.fi/r1/realization/search';
    const options = {
        method: 'POST',
        headers: {
            Authorization: 'Basic ' + btoa(process.env.APIKEYMETROPOLIA || ''),
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ codes: [code] }),
    };

    const response = await doFetch(url, options as any

    );
    console.log("🚀 ~ file: opendata.ts:55 ~ checkOpenDataRealization ~ response:", response);

    if (response.message === 'No results') {
        throw new Error(`Fetch request failed with status ${response.status}`);
    }

    const data = await response.json();

    return data;
};
const openData = {
    CheckOpenDataReservations,
    checkOpenDataRealization,
};
export default openData;