import React, { useEffect } from "react";
import { message, Modal, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../../redux/loadersSlice";
import moment from "moment";
import { GetAllBids } from "../../../apicalls/products";

const Bids = () => {
  const [bidsData, setBidsData] = React.useState([]);
  const dispatch = useDispatch();
  console.log("Bids Data", bidsData);
  const { user } = useSelector((state) => state.users);
  console.log("Bida Data", bidsData);
  useEffect(() => {
    getData();
  }, []);
  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetAllBids({
        buyer: user._id,
      });
      dispatch(SetLoader(false));
      if (response.success) {
        setBidsData(response.data);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };
  const Cols = [
    {
      title: "Product",
      dataIndex: "product",
      render: (text, record) => {
        console.log("UBText", text);
        console.log("UBProducts", record);
        return record.product.name;
      },
    },
    {
      title: "Seller Name",
      dataIndex: "name",
      render: (text, record) => {
        return record.seller.name;
      },
    },
    // {
    //   title: "Bids Placed On",
    //   dataIndex: "createdAt",
    //   render: (text, record) => {
    //     console.log("text", text);
    //     console.log("record", record);
    //     return moment(text).format("MMMM Do YYYY,h:mm a");
    //   },
    // },

    {
      title: "Offered Price",
      dataIndex: "product123",
      render: (text, record) => {
        return record.product.price;
      },
    },
    {
      title: "Bid Amount",
      dataIndex: "bidAmount",
    },
    {
      title: "Bid Date",
      dataIndex: "createdAt",
      render: (text, record) => {
        console.log("Text", text);
        return moment(text).format("MMMM Do YYYY,h:mm a");
      },
    },
    {
      title: "Message",
      dataIndex: "message",
    },
  ];

  return (
    <div className="flex gap-3 flex-col">
      <Table columns={Cols} dataSource={bidsData} />
    </div>
  );
};

export default Bids;
