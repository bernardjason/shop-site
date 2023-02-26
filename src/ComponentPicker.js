import navValues from "./NavValues";
import StockMain from './StockMain';
import LoginForm from './LoginForm';
import BasketMain from './BasketMain';
import CheckoutMain from './CheckoutMain';

const ComponentPicker = ({ currentNavLocation }) => {
  switch (currentNavLocation) {
    case navValues.shop:
      return <StockMain />;
    case navValues.login :
    case navValues.logout:
      return <LoginForm />;
    case navValues.basket:
      return <BasketMain />;
    case navValues.checkout:
      return <CheckoutMain />;
    default:
      return (
        <h3>
          No component for navigation value
          X{currentNavLocation}X found
        </h3>
      );
  }
};

export default ComponentPicker;

