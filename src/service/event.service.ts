import axios from 'axios';

const API_URL = "http://localhost:8081/api/";

const aAuthLogin = async (username: string, password: string) => {
    const response = await axios.post(API_URL + "auth/login", {
        username: username,
        password: password
    });

    if (response.data.accessToken) {
        localStorage.setItem("authToken", response.data.accessToken);
        localStorage.setItem("userId", response.data.id);
        localStorage.setItem("username", response.data.username)
    } else {
        alert("Error en autenticación");
    }
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
const aGetEventsByEventId = async (token: string, userId: string) => {
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

const aGetUsers = async (token: string) => {
    const response = await axios.get(`${API_URL}users`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
}

const aDeleteEvent = async (token: string, eventId: string) => {
    try {
        const response = await axios.delete(`${API_URL}event/${eventId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting event:", error);
        throw error;
    }
};
const aRegisterUser = async (userRequestDto: { username: string; email: string; password: string }) => {
    try {
        const response = await axios.post(`${API_URL}users`, userRequestDto, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return response.data;

    } catch (error: any) {
        console.error("error:", error);
        throw error.response?.data || { message: "Error." };
    }
};
const aResetPassword = async (email: string) => {

    const response = await axios.post(`${API_URL}users/reset-password`, {
        email: email
    }, {
        headers: {
            "Content-Type": "application/json",

        },
    });
    return response.data;


};
const EventsService = {
    aAuthLogin,
    aGetEventsById,
    aCreateEvent,
    aAllEvents,
    aGetUsers,
    aDeleteEvent,
    aGetEventsByEventId,
    aRegisterUser,
    aResetPassword
};

export default EventsService;