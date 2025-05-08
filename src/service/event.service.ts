import axios from 'axios';

const API_URL = "http://localhost:8081/api/";

const aAuthLogin = async (userId: string, password: string) => {
    const response = await axios.post(API_URL + "auth/login", {
        username: userId,
        password: password
    });
    return response.data;
};

const aGetEventsById = async (token: string, userId: string) => {
    const response = await axios.get(`${API_URL}event/${userId}/event`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const aCreateEvent = async (token: string, event: FormData) => {
    const response = await axios.post(`${API_URL}event`, event, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const aAllEvents = async (token: string) => {
    const response = await axios.get(`${API_URL}users/event`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const EventsService = {
    aAuthLogin,
    aGetEventsById,
    aCreateEvent,
    aAllEvents,
};

export default EventsService;