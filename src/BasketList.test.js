/* eslint-disable testing-library/no-unnecessary-act */
import { render, screen } from '@testing-library/react';

import React from "react";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import App from './App';
import navValues from './NavValues';
import {fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event'

let submitPress=0;

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders user data", async () => {
  await act(async () => {
    render(<App menuPicked={navValues.basket} />, container);
  });
  const name = screen.getByText(/empty basket/i);
  expect(name).toBeInTheDocument();

});

it("posts user data", async () => {

  const testBasket = {"basketId":2,"message":null,"userId":2,
    "items":[
      {"stockId":3,"name":"greeting","numberOf":1,"description":"hello","key":4},
      {"stockId":1,"name":"soap","numberOf":1,"description":"bar of soap","key":5}]};
  await act(async () => {
    render(<App menuPicked={navValues.basket} testingBasket={ testBasket } />, container);
  });


  const soap = screen.getByText(/bar of soap/i);
  expect(soap).toBeInTheDocument();
  const hello = screen.getByText(/hello/i);
  expect(hello).toBeInTheDocument();
  const mustLogin = screen.getByText(/you must logon, your basket is not persisted on backend/i);
  expect(mustLogin).toBeInTheDocument();

});

it("logged in so checkout", async () => {
  const fakeLogin = {
      "userId": "1234hello",
      "userName": "helloWorld",
   };

  const testBasket = {"basketId":2,"message":null,"userId":2,
    "items":[
      {"stockId":3,"name":"greeting","numberOf":1,"description":"earth","key":4},
      {"stockId":1,"name":"soap","numberOf":1,"description":"bar of soap","key":5}]};

  await act(async () => {
    render(<App menuPicked={navValues.basket} testingBasket={ testBasket } testingLogin = { fakeLogin} />, container);
  });


  const soap = screen.getByText(/bar of soap/i);
  expect(soap).toBeInTheDocument();
  const hello = screen.getByText(/earth/i);
  expect(hello).toBeInTheDocument();

  //global.fetch.mockRestore();
});