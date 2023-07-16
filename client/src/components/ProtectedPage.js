import React, { useEffect, useState } from "react";
import { message, Badge, Avatar } from "antd";
import { GetCurrentUser } from "../apicalls/users";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../redux/loadersSlice";
import { SetUser } from "../redux/usersSlice";
import Notifications from "./Notifications";
import {
  GetAllNotifications,
  ReadAllNotifications,
} from "../apicalls/notifications";

const ProtectedPage = ({ children }) => {
  const navigate = useNavigate();
  const [notifications = [], setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { loading } = useSelector((state) => state.loaders);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  console.log("SN", showNotifications);
  const getNotifications = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetAllNotifications();
      console.log("Noti_Resp", response);
      dispatch(SetLoader(false));
      if (response.success) {
        setNotifications(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      dispatch(SetLoader(false));
      message.error(err.message);
    }
  };
  const readNotifications = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await ReadAllNotifications();
      dispatch(SetLoader(false));
      if (response.success) {
        getNotifications();
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      dispatch(SetLoader(false));
      message.error(err.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      validateToken();
      getNotifications();
    } else {
      message.error("Please login to continue");
      navigate("/login");
    }
  }, []);
  const validateToken = async () => {
    try {
      dispatch(SetLoader(true));

      const response = await GetCurrentUser();
      dispatch(SetLoader(false));

      if (response.success) {
        dispatch(SetUser(response.data));
        dispatch(SetLoader(false));
      } else {
        navigate("/login");
        dispatch(SetLoader(false));
      }
    } catch (error) {
      dispatch(SetLoader(false));

      navigate("/login");

      message.error(error.message);
    }
  };
  return (
    user && (
      <div>
        <div className="flex justify-between items-center bg-primary p-5">
          <h1
            className="text-2xl text-white cursor-pointer"
            onClick={() => navigate("/")}
          >
            JUC MARKET PLACE
          </h1>
          <div className="bg-white py-2 px-5 rounded flex gap-1 items-center">
            {/* <i className="ri-shield-user-line text-lg"></i> */}
            <span
              className="underline cursor-pointer uppercase"
              onClick={() => {
                if (user.role === "user") {
                  navigate("/profile");
                } else {
                  navigate("/admin");
                }
              }}
            >
              {user.name}
            </span>
            <Badge
              onClick={() => {
                readNotifications();
                setShowNotifications(true);
              }}
              className="cursor-pointer"
              count={
                notifications?.filter((notification) => !notification.read)
                  .length
              }
            >
              <Avatar
                shape="circle"
                size="small"
                icon={<i className="ri-notification-3-line"></i>}
              />
            </Badge>
            <i
              className="ri-logout-box-r-line ml-10 cursor-pointer "
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            ></i>
          </div>
        </div>
        <div className="p-5">{children}</div>

        {
          <Notifications
            notifications={notifications}
            reloadNotifications={getNotifications}
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
          />
        }
      </div>
    )
  );
};

export default ProtectedPage;
