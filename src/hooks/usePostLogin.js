import { getCookie } from '../App';

const usePostLogin = (name,password) => {

    const doLogin = (name,password,callBack) => {

		const csrftoken = getCookie('csrftoken');
	    let data={"name":name , "password":password};

        fetch('/shop/login' , {
                headers: {
      			'Accept': 'application/json',
      			'Content-Type': 'application/json',
				'X-CSRFToken': csrftoken
    		},
		    body: JSON.stringify(data), method: "post" })
         	.then((response) => {
				if ( response.status == 201 ) {
					return response.json();
				}
				return {'error':response.statusText};
			})
         	.then((data) => {
         	    //setLogin(data);
		        callBack(data);
         	})
         	.catch((err) => {
            	console.log(err.message);
         	    const fatal = {"error":err.message}
         	    //setLogin(fatal);
		        callBack(fatal);
         	});
    } ;

    const postLogin = (name,password,callBack) => {
	    doLogin(name,password,callBack);
    }

    return doLogin;
};

export default usePostLogin;