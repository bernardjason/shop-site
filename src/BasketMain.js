import Container from 'react-bootstrap/Container';
import BasketList from './BasketList';
import {useContext} from 'react';
import navValues from "./NavValues";
import {basketContext, navigationContext} from './App';
import {loginContext} from './App';
import Title from './Title';

const BasketMain = () => {
  const {navigate} = useContext(navigationContext);
  const {login} = useContext(loginContext);
  const {basket} = useContext(basketContext);
  return (
    <>
        <Container >
          <Title>Shopping basket</Title>
         {
         login.userId != null ? basket.items.length > 0 && <button className="btn btn-primary btn-sm" onClick={ () => navigate(navValues.checkout)}>Checkout</button>:
         <p>you must logon, your basket is not persisted on backend</p>
         }
        </Container>
        <Container>
            <BasketList enableDelete="true" />
        </Container>
    </>
  );
};

export default BasketMain;
