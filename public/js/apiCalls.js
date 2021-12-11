const API_URL = "http://127.0.0.1:8000";

/* get data from database */
export const getDataFromDb = async (endpoint, auth = undefined) => {
  const url = `${API_URL}/${endpoint}`;
  const optionObj = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };
  if (auth) optionObj.headers.authorization = `Bearer ${auth}`;
  const res = await fetch(url, optionObj);
  const data = await res.json();
  return data;
};

/* Post data to database */
// const postDataToDb = async (endpoint, data, errMsg = null) => {
//   const url = `${API_URL}/${endpoint}`;
//   const optionObj = {
//     method: 'POST',
//     body: JSON.stringify(data),
//     headers: { 'Content-Type': 'application/json' },
//   };
//   try{
//     const res = await fetch(url, optionObj);
//     if(!res.ok) throw Error('Please Reload the app...');
//   } catch (err) {
//     errMsg = err.message
//   } finally {
//     return errMsg
//   }
// };

export const postDataToDb = async (endpoint, data, auth = undefined) => {
  const url = `${API_URL}/${endpoint}`;
  let optionObj = {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  };
  if (auth) optionObj.headers.authorization = `Bearer ${auth}`;
  console.log(optionObj);
  const res = await fetch(url, optionObj);
  const result = await res.json();
  return result;
};

/* Update Data in databse */
export const updateDataInDb = async (endpoint, data, auth = undefined) => {
  const url = `${API_URL}/${endpoint}`;
  const optionObj = {
    method: "PATCH",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  };
  if (auth) optionObj.headers.authorization = `Bearer ${auth}`;
  const response = await (await fetch(url, optionObj)).json();
  return response;
};

/* Replace Data in database */
export const replaceDataInDb = async (endpoint, data, auth = undefined) => {
  const url = `${API_URL}/${endpoint}`;
  const optionObj = {
    method: "PUT",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  };
  if (auth) optionObj.headers.authorization = `Bearer ${auth}`;
  await fetch(url, optionObj);
};

/* Delete data from db */
export const deleteDataFromDb = async (endpoint, data, auth = undefined) => {
  const url = `${API_URL}/${endpoint}`;
  const optionObj = {
    method: "DELETE",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  };
  if (auth) optionObj.headers.authorization = `Bearer ${auth}`;
  await fetch(url, optionObj);
};
