import { render, screen } from '@testing-library/react';

import React from "react";
import { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import App from './App';

/*
test('renders learn react link', () => {
  render(<App />);
  const stockElement1 = screen.getByText(/this item will fail to checkout/i);
  expect(stockElement1).toBeInTheDocument();
});
*/

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders user data", async () => {
  const fakeStock = {"stock":[
      {"stockId":3,"name":"failitem","numberOf":10,"description":"this item will fail to checkout"},
      {"stockId":1,"name":"soap","numberOf":100,"description":"bar of soap"},
      {"stockId":2,"name":"towel","numberOf":10,"description":"some towels"}]};

  jest.spyOn(global, "fetch").mockImplementation(() =>    Promise.resolve({      json: () => Promise.resolve(fakeStock)    })  );

  // Use the asynchronous version of act to apply resolved promises
  await act(async () => {
    render(<App />, container);
  });
  const stockElement1 = screen.getByText(/this item will fail to checkout/i);
  const stockElement2 = screen.getByText(/bar of soap/i);
  const stockElement3 = screen.getByText(/some towels/i);
  expect(stockElement1).toBeInTheDocument();
  expect(stockElement2).toBeInTheDocument();
  expect(stockElement3).toBeInTheDocument();

  // remove the mock to ensure tests are completely isolated  
  global.fetch.mockRestore();
});