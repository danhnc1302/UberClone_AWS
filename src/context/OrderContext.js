import { createContext, useContext, useState, useEffect } from "react";
import { DataStore } from "aws-amplify";
import { Order, OrderDish, Basket, Dish } from "../models";
import { useAuthContext } from "./AuthContext";
import { useBasketContext } from "./BasketContext";

const OrderContext = createContext({});

const OrderContextProvider = ({ children }) => {
    const { dbUser } = useAuthContext();
    const { restaurant, totalPrice, basketDishes, basket } = useBasketContext();

    const [orders, setOrders] = useState([]);
    useEffect(() => {
        DataStore.query(Order, (o) => o.userID("eq", dbUser.id)).then(setOrders);
    }, [dbUser]);

    const createOrder = async () => {

        const newOrder = await DataStore.save(
            new Order({
                userID: dbUser.id,
                Restaurant: restaurant,
                status: "NEW",
                total: totalPrice,
            })
        );

        await Promise.all(
            basketDishes.map((basketDish) => {
                const dishInstance = new Dish({
                    id: basketDish.Dish.id,
                    name: basketDish.Dish.name,
                    image: basketDish.Dish.image,
                    description: basketDish.Dish.description,
                    price: basketDish.Dish.price,
                    restaurantID: basketDish.Dish.restaurantID
                });
                return DataStore.save(
                    new OrderDish({
                        quantity: basketDish.quantity,
                        orderID: newOrder.id,
                        Dish: dishInstance,
                    })
                )
            }
            )
        )

        // delete basket
        await DataStore.delete(basket);

        setOrders([...orders, newOrder]);

        return newOrder;
    };



    const getOrder = async (id) => {
        const order = await DataStore.query(Order, id);
        const orderDishes = await DataStore.query(OrderDish, (od) =>
            od.orderID("eq", id)
        );

        return { ...order, dishes: orderDishes };
    };

    return (
        <OrderContext.Provider value={{ createOrder, orders, getOrder }}>
            {children}
        </OrderContext.Provider>
    );
};

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext);