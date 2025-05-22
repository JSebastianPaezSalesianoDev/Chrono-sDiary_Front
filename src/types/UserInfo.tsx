import { useEffect, useState } from "react";
import EventsService from "../service/event.service";

export const useUserInfo = () => {
  const [userInfo, setUserInfo] = useState({
    token: localStorage.getItem("authToken"),
    userId: localStorage.getItem("userId"),
    username: localStorage.getItem("username")
  });

  const [userData, setUserData] = useState<any | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);

  const refreshUserInfo = () => {
    setUserInfo({
      token: localStorage.getItem("authToken"),
      userId: localStorage.getItem("userId"),
      username: localStorage.getItem("username")
    });
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (userInfo.token && userInfo.userId) {
        try {
          setLoadingRole(true);
          const data = await EventsService.aGetUserById(userInfo.token, userInfo.userId);
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserData(null);
        } finally {
          setLoadingRole(false);
        }
      } else {
        setUserData(null);
        setLoadingRole(false);
      }
    };

    fetchUserData();
  }, [userInfo.token, userInfo.userId]);

  const isAdmin = userData?.roles?.some((role: any) => role.name === "ADMIN") || false;

  return {
    userInfo,
    userData,
    isAdmin,
    loadingRole,
    refreshUserInfo
  };
};
