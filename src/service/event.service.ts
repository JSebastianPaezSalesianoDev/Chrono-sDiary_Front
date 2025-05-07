import axios from 'axios';

const API_URL = "http://localhost:8081/api/"

const aGetEventsById = async (userId: string /**jwt token o user */) => {
    const response = await axios.get(API_URL + "event/" + userId + "/event", {
       /*  headers: {
            
            'Authorization': `Bearer ${userId}` // jwt token o user

        } */
       auth: {
            username: `Alexis`, // userId o email
            password: '1234' //
            // password o token
        }
    }); // quitar el 2do event luego
    return response.data;
}
/* const aGetEventsById = async (token: string, userId: string) => {
    const response = await axios.get(API_URL + "event/" + userId + "/event", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }; */
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