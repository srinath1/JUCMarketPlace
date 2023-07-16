import React from "react";
import { Button, message, Table } from "antd";
// import ProductForm from "./ProductForm";
import { useDispatch, useSelector } from "react-redux";
import { GetAllUsers, UpdateUserStatus } from "../../apicalls/users";
import { SetLoader } from "../../redux/loadersSlice";
import moment from "moment";

const Users = () => {
  const [users, setUsers] = React.useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetAllUsers(null);

      dispatch(SetLoader(false));
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));

      message.error(error.message);
    }
  };
  const onStatusUpdate = async (id, status) => {
    try {
      dispatch(SetLoader(true));
      const response = await UpdateUserStatus(id, status);
      dispatch(SetLoader(false));
      if (response.success) {
        getData();
      } else {
        throw new Error(response.message);
        message.error(response.message);
      }
    } catch (err) {
      dispatch(SetLoader(false));
      message.error(err.message);
    }
  };
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },

    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "role",
      dataIndex: "role",
      render: (text, record) => {
        return record.role.toUpperCase();
      },
    },

    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text, record) => {
        return moment(record.createdAt).format("DD/MM/YYYY hh:mm A");
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text, record) => {
        return record.status.toUpperCase();
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        const { status, _id } = record;

        return (
          <div className="flex gap-5">
            {status === "active" && (
              <span
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "blocked")}
              >
                Block
              </span>
            )}
            {status === "blocked" && (
              <span
                className="underline cursor-pointer"
                onClick={() => onStatusUpdate(_id, "active")}
              >
                Unblock
              </span>
            )}
          </div>
        );
      },
    },
  ];
  React.useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <div className="flex justify-end"></div>
      {users && <Table columns={columns} dataSource={users} />}
    </div>
  );
};

export default Users;
