import axios from 'axios';

const API_URL = 'http://localhost:5000/api/consultations';

export const getConsultations = () => axios.get(API_URL);
export const createConsultation = (consultation) => axios.post(API_URL, consultation);