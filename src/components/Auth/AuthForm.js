import {useContext, useRef, useState} from 'react';
import {useHistory} from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import {FIREBASE_API_KEY} from '../../utils/firebase';

import classes from './AuthForm.module.css';

const AuthForm = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [isLoading, setIsLoading] = useState(false);
	const emailInputRef = useRef();
	const pwdInputRef = useRef();
	const history = useHistory();

	const authCtx = useContext(AuthContext);

	const switchAuthModeHandler = () => {
		setIsLogin((prevState) => !prevState);
	};

	const submitHandler = (event) => {
		setIsLoading(true);
		event.preventDefault();

		const enteredEmail = emailInputRef.current.value;
		const enteredPassword = pwdInputRef.current.value;
		let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
		if (isLogin) {
			url =
				'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';
		}
		fetch(url + FIREBASE_API_KEY, {
			method: 'POST',
			body: JSON.stringify({
				email: enteredEmail,
				password: enteredPassword,
				returnSecureToken: true,
			}),
		})
			.then((res) => {
				setIsLoading(false);
				if (res.ok) {
					return res.json();
				} else {
					return res.json().then((data) => {
						let errorMessage = 'Create Account Fail';
						if (data && data.error && data.error.message) {
							errorMessage = data.error.message;
						}
						throw new Error(errorMessage);
					});
				}
			})
			.then((data) => {
				const expirationTime = new Date(
					new Date().getTime() + +data.expiresIn * 1000
				);
				console.log(expirationTime);
				authCtx.login(data.idToken, expirationTime.toISOString());
				history.replace('./');
			})
			.catch((err) => {
				alert(err.message);
			});
	};

	return (
		<section className={classes.auth}>
			<h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
			<form onSubmit={submitHandler}>
				<div className={classes.control}>
					<label htmlFor="email">Your Email</label>
					<input type="email" id="email" ref={emailInputRef} required />
				</div>
				<div className={classes.control}>
					<label htmlFor="password">Your Password</label>
					<input type="password" id="password" ref={pwdInputRef} required />
				</div>
				<div className={classes.actions}>
					{!isLoading && (
						<button>{isLogin ? 'Login' : 'Create Account'}</button>
					)}
					{isLoading && <p> Sending request ...</p>}

					<button
						type="button"
						className={classes.toggle}
						onClick={switchAuthModeHandler}>
						{isLogin ? 'Create new account' : 'Login with existing account'}
					</button>
				</div>
			</form>
		</section>
	);
};

export default AuthForm;
