import React, {useState, useEffect} from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { store } from "./src/store";
import Router from "./src/navigation/Router";
import '@azure/core-asynciterator-polyfill'

import { Amplify } from 'aws-amplify'
import awsmobile from './src/aws-exports'
import { withAuthenticator } from "aws-amplify-react-native";
import AuthContextProvider  from "./src/context/AuthContext";
import BasketContextProvider from "./src/context/BasketContext"
import OrderContextProvider from "./src/context/OrderContext"

Amplify.configure(awsmobile)

const App = () => {
   
  return (
    <Provider store={store}>
      <AuthContextProvider>
        <BasketContextProvider>
          <OrderContextProvider>
            <NavigationContainer>
                <Router></Router>
            </NavigationContainer>
          </OrderContextProvider>
        </BasketContextProvider>
      </AuthContextProvider>
    </Provider>
  );
}

export default withAuthenticator(App);

