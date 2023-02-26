import { useState,useContext} from 'react';
import usePostCheckout from './hooks/usePostCheckout';
import {basketContext} from './App';

const CheckoutForm = ()=> {

    const { basket } = useContext(basketContext);
    const postCheckout  = usePostCheckout();
    const [message,setMessage] = useState({"ok":false,"status":"","text":""});
    const [info,setInfo] = useState();
    const [payment,setPayment] = useState("credit");

    const [address, setAddress] = useState({"line1":"","line2":""} );


    const handlePayment = (e) => {
	    setPayment(e.target.value);
    };
    const handleAddressLine1 = (e) => {
		const updatedValue = {line1:e.target.value};
		
		setAddress( address => (
		{
			...address,
			...updatedValue
		}
		));

    };
    const handleAddressLine2 = (e) => {
		const updatedValue = {line2:e.target.value};
		setAddress( address => (
		{
			...address,
			...updatedValue
		}
		));
    };

    const statusMessage = () => {
        return (
            <>
                 <p >{message.status} <span style={message.ok ? {color:"green"} : {color:"red"}}>{message.text}</span></p>
            </>

        );
    };
    const handleSubmit = (e) => {
            // ******* disable default as this usually caused page reload *********
            e.preventDefault();
			setMessage( {"ok":true,"status":"","text":""} );
			if ( address.line1.length === 0 || address.line2.length === 0 ) {
				setMessage( {"ok":false,"status":"","text":"enter valid address"} );
			} else {
				setMessage( {"ok":true,"status":"","text":"processing..."} );
				const callBack = (isItOk,anyInfo,address) => {
					let dispatched =anyInfo;
					if ( address != null ) {
						dispatched = dispatched + ". Address "+address.line1+ ","+address.line2;
					}
					setMessage( {"ok":isItOk,"status":"","text":dispatched} );
					setInfo(anyInfo);
				};
				postCheckout(payment,address,callBack);
			}

        };

    return (
	    <div className="form">
	        <form>
	            <p>
		        <label className="label">Payment type</label>
	            <select value={payment} name="payment" onChange={handlePayment}>
                  <option value="credit">credit</option>
                  <option value="debit">debit</option>
                </select>
                </p>
	            <p>
		        <label className="label">Address line1</label>
		        <input onChange={handleAddressLine1} className="input"
		        value={address.line1} type="text" data-testid="addressLine1"/>
		        </p>
	            <p>
		        <label className="label">Address line2</label>
		        <input onChange={handleAddressLine2} className="input"
		        value={address.line2} type="text" data-testid="addressLine2"/>
		        </p>
		        <div>
		        {
		            Object.keys(basket.items).length > 0 && <button className="btn btn-primary btn-sm" onClick={ handleSubmit } data-testid="submit">Checkout now</button> 
					
		        }
		        {statusMessage()}
		        </div>
	        </form>

	    </div>
    );
}

export default CheckoutForm;