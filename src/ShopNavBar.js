import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React , { useContext, } from "react";

import { loginContext, navigationContext } from "./App";
import {basketContext } from "./App";

import navValues from "./NavValues";
import emptyBasket, { notLoggedIn } from './helper/GlobalValues';


function ShopNavBar( currentLogin ) {
  const { navigate } = useContext(navigationContext);
  const { login , setLogin , setCookie } = useContext(loginContext);

  const { basket , setBasket} = useContext(basketContext);
  const basketLength = basket['items'] === undefined ? 0 : Object.keys( basket['items']  ).length  ;
  const enableBasket = (basketLength > 0 || (login != null && login.basketId != null && login.basketId.length > 0))  ? "enabled" : "disabled";

  const logout = () => {
    setLogin(notLoggedIn);
    setBasket(emptyBasket)
    navigate(navValues.shop);
    setCookie();
  }
 
  return (
      <Navbar className="navbar" bg="primary" variant="dark">
        <Container>
          <Navbar.Brand onClick={() => navigate(navValues.shop)}>Shopping</Navbar.Brand>
          <Nav className="me-auto">
            {
              login.userId  != null 
                        ?<Nav.Link onClick={() => logout()}>Logout</Nav.Link>
                        :<Nav.Link onClick={() => navigate(navValues.login)}>Login</Nav.Link>

            }
            <Nav.Link onClick={() => navigate(navValues.shop)}>Shop</Nav.Link>
            {
                 (basketLength > 0 || (login != null && login.basketId != null && login.basketId.length > 0 )) && <Nav.Link className={enableBasket} onClick={() => navigate(navValues.basket)}>Basket</Nav.Link>
            }
          </Nav>
          <Nav.Item className="ml-auto , navbarLogin">
            <Nav.Link onClick={() => navigate(navValues.login)}>{currentLogin.login.userName}</Nav.Link>
          </Nav.Item>
        </Container>

      </Navbar>

  );
}

export {navValues};
export default ShopNavBar;
