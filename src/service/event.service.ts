import axios from 'axios';

const API_URL = "http://localhost:8081/api/"

const aGetEventsById = async (userId: string) => {
    const response = await axios.get(API_URL + "event/" + userId + "/event"); // quitar el 2do event luego
    return response.data;
}

const aCreateEvent = async (event: FormData) => {
    const response = await axios.post(API_URL + "event", event);
    return response.data;
}

const aAllEvents = async () => {
    const response = await axios.get(API_URL + "users/" + "event");
    return response.data;
}
const EventsService = {
    aGetEventsById,
    aCreateEvent,
    aAllEvents
}
export default EventsService;