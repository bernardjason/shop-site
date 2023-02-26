/* eslint-disable testing-library/no-unnecessary-act */
import { render, screen } from '@testing-library/react';

import React from "react";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import LoginForm from './LoginForm';
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
    render(<App menuPicked={navValues.login} />, container);
  });
  const name = screen.getByText(/Name/i);
  expect(name).toBeInTheDocument();
  const password = screen.getByText(/Password/i);
  expect(password).toBeInTheDocument();

});

it("posts user data", async () => {

  const fakeLogin = {
      "userId": "1234hello",
      "userName": "helloWorld",
   };


  jest.spyOn(global, "fetch").mockImplementation((request) =>    {
    submitPress=submitPress+1;
    return Promise.resolve(
      {      
        status:201    ,
        json: () => Promise.resolve(fakeLogin)
      }
    ) ;
  }
  );

  await act(async () => {
    render(<App menuPicked={navValues.login} />, container);
  });

  await act(async () => {
    const username = screen.getByTestId('username');
    const password= screen.getByTestId('password');
    userEvent.type(username, 'hello');
    userEvent.type(password, 'world');
  });


  await act(async () => {
    const submitButton = screen.getByText(/Submit/i);
    fireEvent.click(submitButton);
  });

  expect(submitPress).toBeGreaterThan(0);

  const success = screen.getByText(/logged in/i);
  expect(success).toBeInTheDocument();

  global.fetch.mockRestore();
});