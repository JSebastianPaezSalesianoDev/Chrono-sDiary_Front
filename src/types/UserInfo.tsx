import React, { useEffect, useState } from "react";
import EventsService from "../service/event.service";

export const useUserInfo = () => {
    const [userInfo, setUserInfo] = useState({
        token: localStorage.getItem("authToken"),
        userId: localStorage.getItem("userId"),
        username: localStorage.getItem("username")
    });

    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        if (userInfo.token && userInfo.userId) {
            const fetchUserRole = async () => {
                try {
                    const role = await EventsService.aGetUserById(userInfo.token!, userInfo.userId!);
                    setUserRole(role);
                } catch (error) {
                    console.error("Error fetching user role:", error);
                }
            };
            fetchUserRole();
        }
    }, [userInfo.token, userInfo.userId]);

    return { userInfo, userRole };
};