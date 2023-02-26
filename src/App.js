import React, { useCallback, useState ,useEffect} from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import ShopNavBar from './ShopNavBar';
import navValues from './NavValues';
import ComponentPicker from './ComponentPicker';
import emptyBasket from './helper/GlobalValues';
import {notLoggedIn} from './helper/GlobalValues';


const navigationContext = React.createContext(navValues.shop);
const loginContext = React.createContext();
const basketContext = React.createContext();

const getCookie = (name) => {
    let cookieValue = null;

    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();

            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));

                break;
            }
        }
    }

    return cookieValue;
};

const App = ({ menuPicked = navValues.shop , testingBasket = emptyBasket , testingLogin= notLoggedIn }) => {

  useEffect(() => {
      const getCookied = async () => {
       const cookie = getCookie("shopping");
        try{
          const loginInfo = JSON.parse(decodeURI(cookie));
          if ( loginInfo != null ) {
            setLogin(loginInfo);
          }
        } catch (e) {
            console.log("no cookie found");
        }
       };  
       getCookied();
      }, []);


  const setCookie = (loginInfo) => {
    const asString = JSON.stringify(loginInfo);
    if ( asString !== undefined && asString.indexOf(";") !== -1 ) {
      throw new Error("log info has a semi colon [ "+asString);
    }
    console.log("setCookie loginInfo is "+asString);
    const store = "shopping="+encodeURI(asString)+ ";max-age=300; SameSite=None; Secure";
    document.cookie = store;
  };

  const navigate = useCallback(
    (navTo) => setNav({ current: navTo, navigate }),
    []
  );

  const [nav, setNav] = useState({ current: menuPicked, navigate });
  const [login, setLogin] = useState( testingLogin );
  const [basket, setBasket] = useState( testingBasket );
  return(

	<basketContext.Provider value={ {basket , setBasket} }>
		<loginContext.Provider value= { {login,setLogin, setCookie} } >
			<navigationContext.Provider value={nav}>
				<ShopNavBar login={login} />
        			<ComponentPicker currentNavLocation={nav.current} />
        		</navigationContext.Provider>
        	</loginContext.Provider>
        </basketContext.Provider>

  )

};

export {navigationContext,loginContext,basketContext,getCookie};
export default App;
