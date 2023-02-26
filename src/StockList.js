import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import useGetStock from './hooks/useGetStock';
import {basketContext} from './App';
import { useContext,useCallback,useState } from "react";

const StockList = ( { allStock , buyItem } ) => {

  return(
 	<Container >
			<Row className="mt-3 p-2 tableHeader">
				<Col sm={2}></Col>
				<Col sm={2}>name</Col> 
				<Col sm={2}>in stock</Col> 
				<Col sm={4}>description</Col>
			</Row>
    			{ allStock.map( (s) =>
			        <Row className="p-2 rowlist" key={s.stockId}>
				        <Col sm={2}>
					        <button className="btn btn-primary btn-sm" onClick={  () => buyItem(s.stockId,s.name,1,s.description ) } >Buy</button>
				        </Col>
				        <Col sm={2}>{s.name}</Col>
				        <Col sm={2}>{s.numberOf}</Col>
				        <Col sm={4}>{s.description}</Col>
			        </Row>
			) }
   	</Container>
  ) ;

};

export default StockList;

