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
  const checkoutOk= {
            "basketId": 1234,
            "message": "Dispatched",
            "address": {"line1":"hello80","line2":"AL1"},
            "items": []
        };

  jest.spyOn(global, "fetch").mockImplementation((request) =>    {
    submitPress=submitPress+1;
    return Promise.resolve(
      {      
        status:201    ,
        ok:true,
        json: () => Promise.resolve(checkoutOk)
      }
    ) ;
  }
  );

  const fakeLogin = {
      "userId": "1234hello",
      "userName": "helloWorld",
   };

  const testBasket = {"basketId":2,"message":null,"userId":2,
    "items":[
      {"stockId":3,"name":"greeting","numberOf":1,"description":"earth","key":4},
      {"stockId":1,"name":"soap","numberOf":1,"description":"bar of soap","key":5}]};

  await act(async () => {
    render(<App menuPicked={navValues.checkout} testingBasket={ testBasket } testingLogin = { fakeLogin} />, container);
  });


  const soap = screen.getByText(/bar of soap/i);
  expect(soap).toBeInTheDocument();
  const hello = screen.getByText(/earth/i);
  expect(hello).toBeInTheDocument();

  await act(async () => {
    const line1 = screen.getByTestId('addressLine1');
    const line2= screen.getByTestId('addressLine2');
    userEvent.type(line1, '80');
    userEvent.type(line2, 'AL1');
  });

  await act(async () => {
    const submitButton = screen.getByTestId("submit");
    fireEvent.click(submitButton);
  });

  const dispatched = screen.getByText(/Dispatched. Address hello80,AL1/i);
  expect(dispatched).toBeInTheDocument();

  global.fetch.mockRestore();
});