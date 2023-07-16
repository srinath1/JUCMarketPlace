import React from "react";
import { Modal, message } from "antd";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { DeleteNotification } from "../apicalls/notifications";
import { SetLoader } from "../redux/loadersSlice";
import { useDispatch } from "react-redux";
const Notifications = ({
  notifications,
  reloadNotifications,
  showNotifications,
  setShowNotifications,
}) => {
  console.log("Notifications", notifications);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const deleteNotification = async (id) => {
    try {
      dispatch(SetLoader(true));
      const response = await DeleteNotification(id);
      if (response.success) {
        dispatch(SetLoader(false));

        message.success(response.message);
        reloadNotifications();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoader(false));
    }
  };
  return (
    <Modal
      title="Notifications"
      open={showNotifications}
      onCancel={() => setShowNotifications(false)}
      footer={null}
      centered
      width={1000}
    >
      <div className="flex flex-col gap-2">
        {notifications.map((notification) => {
          return (
            <div
              className="flex flex-col   border border-solid p-2 border-gray-300 rounded cursor-pointer"
              key={notification._id}
            >
              <div className="flex justify-between items-center">
                <div
                  onClick={() => {
                    navigate(notification.onClick);
                    setShowNotifications(false);
                  }}
                >
                  <h1 className="text-gray-700 ">{notification.title}</h1>
                  <span className="text-gray-600">{notification.message}</span>
                  <h1 className="text-gray-500 text-sm">
                    {moment(notification.createdAt).fromNow()}
                  </h1>
                </div>
                <i
                  className="ri-delete-bin-line"
                  onClick={() => deleteNotification(notification._id)}
                ></i>
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default Notifications;
