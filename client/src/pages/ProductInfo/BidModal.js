import { Modal, Form, Input, message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { PlaceNewBid } from "../../apicalls/products";
import { SetLoader } from "../../redux/loadersSlice";
import { AddNotification } from "../../apicalls/notifications";

const BidModal = ({ showBidModal, setShowBidModal, product, reloadData }) => {
  const rules = [{ required: true, message: "Required" }];
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const formRef = React.useRef(null);
  const onFinish = async (values) => {
    try {
      dispatch(SetLoader(true));
      const response = await PlaceNewBid({
        ...values,
        product: product._id,
        seller: product.seller._id,
        buyer: user._id,
      });
      if (response.success) {
        message.success("Bid placed Successfully");
        await AddNotification({
          title: "New Bid",
          message: `A new bid for the product:${product.name} by ${user.name} for $  ${values.bidAmount}`,
          user: product.seller._id,
          onClick: "/profile",
          read: false,
        });
        reloadData();
        setShowBidModal(false);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {}
  };
  return (
    <Modal
      onCancel={() => setShowBidModal(false)}
      open={showBidModal}
      centered
      width={600}
      onOk={() => formRef.current.submit()}
    >
      <div>
        <h1 className="text-2xl font-semibold text-orange-900 text-center mb-5">
          New Bid
        </h1>
        <Form layout="vertical" ref={formRef} onFinish={onFinish}>
          <Form.Item label="Bid Amount" name="bidAmount" rules={rules}>
            <Input />
          </Form.Item>

          <Form.Item label="Message" name="message" rules={rules}>
            <Input.TextArea />
          </Form.Item>

          <Form.Item label="Mobile" name="mobile" rules={rules}>
            <Input type="number" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default BidModal;
