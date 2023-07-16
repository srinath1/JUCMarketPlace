import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { GetProducts } from "../../apicalls/products";
import { SetLoader } from "../../redux/loadersSlice";
import { message } from "antd";
import Divider from "../../components/Divider";
import { useNavigate } from "react-router-dom";
import Filters from "./Filters";
import moment from "moment";

const Home = () => {
  const { user } = useSelector((state) => state.users);
  const [products, setProducts] = React.useState([]);
  const [filters, setFilters] = React.useState({
    status: "approved",
    category: [],
    age: [],
  });
  const [showFilters, setShowFilters] = React.useState(true);
  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(SetLoader(false));
      const response = await GetProducts(filters);
      dispatch(SetLoader(false));
      if (response.success) {
        setProducts(response.data);
        message.success(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error(error.message);
    }
  };
  React.useEffect(() => {
    getData();
  }, []);
  React.useEffect(() => {
    console.log("Filters_categories", filters);
    getData();
  }, [filters]);
  const navigate = useNavigate();
  return (
    <div className="flex gap-5">
      {showFilters && (
        <Filters
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          filters={filters}
          setFilters={setFilters}
        />
      )}
      <div className="flex flex-col gap-5 w-full">
        <div className="flex gap-5 items-center">
          {!showFilters && (
            <i
              className="ri-equalizer-line text-xl cursor-pointer"
              onClick={() => setShowFilters(!showFilters)}
            ></i>
          )}
          <input
            type="text"
            placeholder="Search Products  here..."
            className="border border-gray-300 rounded border-solid px-2 py-1 h-14 w-full"
          />
        </div>
        <div
          className={`
        grid gap-5 ${showFilters ? "grid-cols-4" : "grid-cols-5"}
      `}
        >
          {products?.map((product) => {
            return (
              <div className="border border-gray-300 rounded border-solid  flex flex-col gap-1 pb-2 cursor-pointer">
                <img
                  src={product.images[0]}
                  className="w-full h-52 p-2 rounded-md "
                  alt="image1"
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                />
                <div className="p-2 flex flex-col">
                  <h1 className="text-lg font-semibold">{product.name}</h1>
                  {/* <h1 className="text-sm ">{product.description}</h1> */}
                  <p className="text-sm">
                    {product.age} {product.age === 1 ? "Year Old" : "Years Old"}
                  </p>
                  <Divider />

                  <span className="text-xl font-semibold text-green-700 ">
                    $ {product.price}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
