import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import useDeleteFromBasket from './hooks/useDeleteFromBasket';
import useUpdateBasket from './hooks/useUpdateBasket';
import { basketContext ,loginContext} from './App';
import { useContext, useState } from "react";
import useGetBasket from './hooks/useGetBasket';

const BasketList = (enableDelete) => {
	const doDeleteFromBasket = useDeleteFromBasket();
	const doUpdateBasket = useUpdateBasket();
  	const { login } = useContext(loginContext);
	const [message,setMessage] = useState("empty basket");


	const doUpdate  = (stockId,name,numberOf,description,alterBy,key,userId) => {
		if (numberOf + alterBy  <= 0 ){
			doDeleteFromBasket(basket, setBasket, stockId, key,userId);
		} else {
			console.log("Do update "+stockId+" "+name+" "+numberOf+" "+alterBy);
    		const handleSubmitResponse = (result) => {
        		console.log("UPDATE result is "+JSON.stringify(result));
        		setBasket(result);
  			};
  			const basketId = basket.basketId;
    		doUpdateBasket(handleSubmitResponse,login.userId,basketId, stockId,name,alterBy,description);
		}
  	};

	const { basket, setBasket } = useContext(basketContext);

	// Only need this to handle browser refresh. Without that handled ok from browser
	useGetBasket(login.basketId,basket,login.userId,setMessage);

	if (basket.items.length > 0) {

		return (
			<Container >
				
				<Row className='mt-3 p-2 tableHeader' >
					{enableDelete.enableDelete == "true" && <Col sm={2}></Col>}
					<Col sm={2}>name</Col>
					<Col sm={3}>items</Col>
					<Col sm={4}>description</Col>
				</Row>
				{basket.items.map((s) =>
					<Row className='p-2 rowlist' key={s.key}>
						{enableDelete.enableDelete == "true" &&
							<Col sm={2}>
								<button className="btn btn-primary btn-sm" onClick={() => doDeleteFromBasket(basket, setBasket, s.stockId, s.key,login.userId)} >Delete</button>
							</Col>
						}
						<Col sm={2}>{s.name}</Col>
						<Col sm={3}> 
						    {enableDelete.enableDelete == "true" &&
								<button type="button" className="btn btn-light btn-sm"  
									onClick={  () => doUpdate(s.stockId,s.name,s.numberOf,s.description,-1 ,s.key,login.userId) }>-</button>
							}
							{s.numberOf} 
						    {enableDelete.enableDelete == "true" &&
								<button type="button" className="btn btn-light btn-sm"  
									onClick={  () => doUpdate(s.stockId,s.name,s.numberOf,s.description ,+1,s.key,login.userId) }>+</button>
							}
						</Col>
						<Col sm={4}>{s.description}</Col>
					</Row>
				)}
			</Container>
		);
	} else {
		return (
			<Container>
				<p className='emptybasket'>{message}</p>
			</Container>

		)
	}

};

export default BasketList;

