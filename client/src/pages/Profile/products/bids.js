import React, { useEffect } from "react";
import { message, Modal, Table } from "antd";
import { useDispatch } from "react-redux";
import { GetAllBids } from "../../../apicalls/products";
import { SetLoader } from "../../../redux/loadersSlice";
import moment from "moment";
import Divider from "../../../components/Divider";

const Bids = ({ showBidsModal, setShowBidsModal, selectedProduct }) => {
  const [bidsData, setBidsData] = React.useState([]);
  const dispatch = useDispatch();
  console.log("Bids Data", bidsData);
  useEffect(() => {
    if (selectedProduct) getData();
  }, [selectedProduct]);
  const getData = async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetAllBids({
        product: selectedProduct._id,
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
      title: "Name",
      dataIndex: "name",
      render: (text, record) => {
        return record.buyer.name;
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
    {
      title: "Contact Details",
      dataIndex: "contactDetails",
      render: (text, record) => {
        return (
          <div>
            <p>Phone:{record.mobile}</p>
            <p>Email:{record.buyer.email}</p>
          </div>
        );
      },
    },
  ];

  return (
    <Modal
      title="Bids"
      open={showBidsModal}
      onCancel={() => setShowBidsModal(false)}
      centered
      width={1200}
      footer={null}
    >
      <div className="flex gap-3 flex-col">
        <Divider />
        <h1 className="text-xl text-primary">
          Product Name:{selectedProduct.name}
        </h1>
        <Table columns={Cols} dataSource={bidsData} />
      </div>
    </Modal>
  );
};

export default Bids;
