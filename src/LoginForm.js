import { useState, useContext } from 'react';
import usePostLogin from './hooks/usePostLogin';
import { basketContext, loginContext } from './App';
import Title from './Title';
import usePostBasket from './hooks/usePostBasket';
import { Container, Row ,Col } from 'react-bootstrap';

const LoginForm = () => {

	const { login, setLogin ,setCookie } = useContext(loginContext);
	const { basket, setBasket } = useContext(basketContext);
	const postLogin = usePostLogin();
	const postBasket = usePostBasket();

	const [message, setMessage] = useState({ "ok": false, "status": "", "text": "" });
	const [name, setName] = useState('');
	const [password, setPassword] = useState('');

	const handleName = (e) => {
		setName(e.target.value);
	};

	const handlePassword = (e) => {
		setPassword(e.target.value);
	};




	const handleSubmit = (e) => {
		// ******* disable default as this usually caused page reload *********
		e.preventDefault();
		const handleSubmitResponse = (result) => {
			if ("userId" in result) {
				console.log("login result " + JSON.stringify(result));
				setLogin(result);
				setCookie(result);
				setMessage({ "ok": true, "status": "success", "text": "logged in" });
				setBasket((basket) => (
						{
							...basket,
							...{ "userId": login.userId }
						}
					)
				);
				postBasket((data) => { 
					console.log("basket updated with user id "+ JSON.stringify(data));
					setBasket(data)
				}, result.userId,basket.basketId);
			} else {
				setMessage({ "ok": false, "status": "error", "text": result.error });
			}
		};
		postLogin(name, password, handleSubmitResponse);
	}

	const statusMessage = () => {
		return (
			<p className="loginStatus">{message.status} <span style={message.ok ? { color: "green" } : { color: "red" }}>{message.text}</span></p>

		);

	};

	return (
		<Container>

		<div className="form">
			<div>
				<Title>Logon</Title>
			</div>



			<form>
				<Row className='loginRow'>
					<Col sm={1}>
					<label className='label' >Name</label>
					</Col>
					<Col sm={5}>
					<input onChange={handleName} className="input loginBox"
						value={name} type="text" 
						data-testid="username"/>
					</Col>
				</Row>
				<Row className="loginRow">
					<Col sm={1}>
					<label  className='label'>Password</label>
					</Col>
					<Col sm={5}>
					<input onChange={handlePassword} className="input loginBox"
						value={password} type="password" 
						data-testid="password"/>
					</Col>
				</Row>
				<Row className='loginRow'>
					<Col sm={1}>
					</Col>

					<Col sm={1} className="loginButton" >
					{
						login.userId == null &&
						<button className="btn btn-primary btn-sm" onClick={handleSubmit} type="submit" data-testid="submit"> Submit </button>


					}
					</Col>
					<Col sm={10}>
					</Col>
				</Row>
				<Row>
				<div className="loginStatus">
					{statusMessage()}
				</div>
				</Row>


			</form>
		</div>
		</Container>
	);
}

export default LoginForm;