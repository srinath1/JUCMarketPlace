import React, { useEffect, useState } from "react";
import { Button, Form, Input, message } from "antd";
import { Link } from "react-router-dom";
import Divider from "../../components/Divider";
import { LoginUser } from "../../apicalls/users";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";

const rules = [
  {
    required: true,
    message: "required",
  },
];

const Login = () => {
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.loaders);
  console.log(loading);
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    console.log("values", values);
    try {
      dispatch(SetLoader(true));

      const response = await LoginUser(values);
      dispatch(SetLoader(false));

      console.log("res", response);
      if (response.success) {
        message.success(response.success);
        localStorage.setItem("token", response.data);
        window.location.href = "/";
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      message.error(err.message);
      dispatch(SetLoader(false));
    }
  };
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);
  return (
    <div className="h-screen bg-primary flex justify-center items-center">
      <div className="bg-white p-5 rounded w-[450px]">
        <div className="text-primary text-2xl">
          JUC MARKET PLACE~{" "}
          <span className="text-grey-300 text-2xl">Login</span>
        </div>
        <Divider />
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Email" name="email" rules={rules}>
            <Input placeholder="Enter Email" />
          </Form.Item>
          <Form.Item label="Password" name="password" rules={rules}>
            <Input placeholder="Password" type="password" />
          </Form.Item>
          <Button type="primary" htmlType="Submit" block className="mt-2">
            Login
          </Button>
          <div className="mt-5  text-center">
            <span className="text-gray-500">
              Dont have an account ?{" "}
              <Link to="/register" className="text-primary">
                Register
              </Link>
            </span>
          </div>{" "}
        </Form>
      </div>
    </div>
  );
};

export default Login;
