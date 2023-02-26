import Container from 'react-bootstrap/Container';
import StockList from './StockList';
import { useContext,useCallback, useEffect } from "react";
import useGetStock from './hooks/useGetStock';
import usePostBasket from './hooks/usePostBasket';
import {basketContext, loginContext} from './App';
import Title from './Title';

const StockMain = () => {
  const { allStock }  = useGetStock();
  const postBuy = usePostBasket();

  const {basket, setBasket} = useContext(basketContext);
  const { login } = useContext(loginContext);

  const doPost  = (stockId,name,numberOf,description) => {
    const handleSubmitResponse = (result) => {
        console.log("result is "+JSON.stringify(result));
        setBasket(result);
  	};
  	const basketId = basket.basketId;

    postBuy(handleSubmitResponse,login.userId,basketId, stockId,name,numberOf,description);
  };

  return (
<>
    <Container >
      <Title>Items available</Title>
    </Container>
    <Container>

    <StockList allStock={allStock} buyItem={doPost} />
    </Container>
</>
  );
};

export default StockMain;
