'use strict';

//const baseUrl = 'https://jaksec.northeurope.cloudapp.azure.com/backend/';
const baseUrl = 'http://localhost:3002/';


const doFetch = async (url: string, options: RequestInit) => {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok) {
    const message = data.error ? `${data.error}` : data.message;
    throw new Error(message || response.statusText);
  }

  return data;
};
interface LoginInputs {
  username: string;
  password: string;
}
const postLogin = async (inputs: LoginInputs) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: inputs.username,
      password: inputs.password,
    }),
  };

  return await doFetch(baseUrl + 'users', options);
};
interface CreateCourseInputs {
  courseName: string;
  courseCode: string;
  studentGroup: string;
  file: File;
}

const createCourse = async (inputs: CreateCourseInputs) => {
  const { courseName, courseCode, studentGroup, file } = inputs;

  const formData = new FormData();
  formData.append('courseName', courseName);
  formData.append('courseCode', courseCode);
  formData.append('studentGroup', studentGroup);
  formData.append('file', file);

  const options: RequestInit = {
    method: 'POST',
    body: formData,
  };

  const url = `${baseUrl}courses/create`; // append the endpoint to the baseUrl
  return doFetch(url, options);
};
interface CourseCheckInputs {
  codes: string;
  studentGroups: string;
}
const checkIfCourseExists = async (inputs: CourseCheckInputs) => {
  const { codes, studentGroups } = inputs;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      codes: codes,
      studentGroups: studentGroups,
    }),
  };
  const url = `${baseUrl}courses/check`;
  return await doFetch(url, options);
};


const apiHooks = {
  postLogin,
  createCourse,
  checkIfCourseExists,
};
export default apiHooks;
