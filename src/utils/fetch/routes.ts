import * as http from '.';

//POST
export const sendPusher = (payload: Object) => http.post('pusher/', payload);

//GET
export const getAccounts = () => http.get('customer/');

//PUT
export const updateAccounts = (payload: any) =>
  http.put(`customer/${payload?.id}/`, payload);

//UPLOAD
export const uploadImage = (payload: any) => http.upload(payload);
export const uploadAudio = (payload: any) => http.audioUpload(payload);
