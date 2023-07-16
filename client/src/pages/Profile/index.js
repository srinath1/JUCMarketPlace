import React from "react";
import { Tabs } from "antd";
import Products from "./products";
import UserBids from "./UserBids";
import { useSelector } from "react-redux";
import moment from "moment";

const Profile = () => {
  const { user } = useSelector((state) => state.users);
  return (
    <div>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Products" key="1">
          <Products />
        </Tabs.TabPane>
        <Tabs.TabPane tab="My Bids" key="2">
          <UserBids />
        </Tabs.TabPane>
        <Tabs.TabPane tab="General" key="3">
          <div className="flex flex-col w-[24]">
            <span className="text-primary text-2xl flex justify-start">
              Name:<b className="text-2xl ml-5">{user.name}</b>
            </span>
            <span className="text-primary text-2xl flex justify-start ">
              Email:<b className="text-2xl ml-5">{user.email}</b>
            </span>
            <span className="text-primary text-2xl flex justify-start ">
              Profile Joined on:
              <b className="text-2xl ml-5">
                {moment(user.createdAt).format("MMM D,YYYY hh:ss A")}
              </b>
            </span>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Profile;
