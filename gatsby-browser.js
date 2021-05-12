import React from 'react';
import { Provider } from 'react-redux';
import store from './src/Global/store';
import { Theme } from "./src/Global/theme";
import './src/Global/Global.css';

export const wrapRootElement = ({ element }) => {
  
  return <Provider store={store}><Theme>{element}</Theme></Provider>;
};