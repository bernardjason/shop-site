import Container from 'react-bootstrap/Container';
import BasketList from './BasketList';
import CheckoutForm from './CheckoutForm';
import Title from './Title';

const CheckoutMain = () => {

  return (
    <>
        <Container >
          <Title>Checkout</Title>
         <CheckoutForm />
        </Container>
        <Container>
          <BasketList enableDelete={false} />
        </Container>
    </>
  );
};

export default CheckoutMain;
