import { basketContext, loginContext } from '../App';
import { useContext } from "react";
import { getCookie } from '../App';

const usePostCheckout = () => {

    const { basket, setBasket } = useContext(basketContext);
    const {login  } = useContext(loginContext)

    // callback needed to set message as otherwise state updated after render so not visible until next render.
    const doPost = (payment, address, callBackToSetMessage) => {

		const csrftoken = getCookie('csrftoken');
        let url = "/shop/checkout";

        const payload = basket;
        payload.address = address;
        payload.payment = payment;
        payload.userId = login.userId;

        fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
				'X-CSRFToken': csrftoken
            },
            body: JSON.stringify(payload), method: "post"
        })
            .then((response) => {
                if (!response.ok) {
                    try {
                        const businessError = async () => {
                            const json = await response.json();
                            let current = basket;
                            current.message = "failed to checkout";
                            setBasket(current);
                            console.log("Basket now " + JSON.stringify(current));
                            callBackToSetMessage(false, "Error:" + json.message);
                        };
                        businessError();
                    } catch (e) {
                        throw new Error(e);
                    }
                    throw new Error(response.status + " " + response.statusText);
                }
                return response.json()
            })
            .then((data) => {
                setBasket(data);
                callBackToSetMessage(true, data.message, data.address);
                console.log('Success:', JSON.stringify(data));
            })
            .catch((error) => {
                console.log('Error:', error);
                callBackToSetMessage(false, error.message);
            });
        return;
    };
    return doPost;
};

export default usePostCheckout;
