import React, { useState, useEffect, useMemo } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import ItemBasket from '../components/ItemBasket';
import { useDispatch, useSelector } from 'react-redux';
import basketSlice from '../store/basketSlice'
import WaitIndicator from '../components/WaitIndicator';
import { DataStore } from 'aws-amplify';
import { Dish, Restaurant, Order, OrderDish, BasketDish } from '../models';
import { useBasketContext } from '../context/BasketContext';
import { useAuthContext } from '../context/AuthContext';
import { useOrderContext } from '../context/OrderContext';


const BasketScreen = () => {
    const { dbUser } = useAuthContext();
    const navigation = useNavigation()
    const route = useRoute()

    const {
        restaurant,
        basketDishes,
        totalPrice
    } = useBasketContext()

    const {
        createOrder
    } = useOrderContext()

    const handleOrder = async () => {
        await createOrder()
        navigation.navigate('HomeScreen')
    }
    const handleBack = () => {
        navigation.pop()
    }

    if (!restaurant) {
        return <WaitIndicator />
    }
    return (
        <View style={styles.container}>
            <View>
                <TouchableOpacity onPress={handleBack}>
                    <Ionicons name="arrow-back" size={30} color="black" style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.name}>{restaurant.name}</Text>
                <Text style={styles.yourItems}>Your Items</Text>
                <FlatList
                    data={basketDishes}
                    renderItem={({ item }) => <ItemBasket item={item} s/>}
                />
                <View style={styles.line}></View>
                <View style={styles.row}>
                    <Text>Subtotal</Text>
                    <Text>${(parseFloat(totalPrice) - parseFloat(restaurant.deliveryFee)).toFixed(2)}</Text>
                </View>
                <View style={styles.row}>
                    <Text>Total</Text>
                    <Text>${totalPrice.toFixed(2)}</Text>
                </View>
            </View>
            <TouchableOpacity onPress={handleOrder}>
                <View style={styles.addToBasketBtn}>
                    <Text style={styles.text}>Order</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 18,
        paddingVertical: 50,
        justifyContent: 'space-between'
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        marginVertical: 14,
    },
    addToBasketBtn: {
        paddingVertical: 18,
        paddingHorizontal: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    text: {
        color: 'white',
        fontWeight: '400',
        fontSize: 14
    },
    line: {
        width: '100%',
        height: 2,
        marginVertical: 16,
        backgroundColor: '#DDDDDD',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    yourItems: {
        marginBottom: 14,
        fontSize: 16,
        fontWeight: 'bold'
    }
})

export default BasketScreen;