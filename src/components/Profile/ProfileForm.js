import {useContext, useRef} from 'react';
import AuthContext from '../../store/auth-context';
import {FIREBASE_API_KEY} from '../../utils/firebase';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
	const newPwdEntered = useRef();
	const authCtx = useContext(AuthContext);

	const changePwdHandler = (event) => {
		event.preventDefault();
		const enteredNewPassword = newPwdEntered.current.value;
		fetch(
			'https://identitytoolkit.googleapis.com/v1/accounts:update?key=' +
				FIREBASE_API_KEY,
			{
				method: 'POST',
				body: JSON.stringify({
					idToken: authCtx.token,
					password: enteredNewPassword,
					returnSecureToken: true,
				}),
			}
		).then((res) => {
			if (!res.ok) {
				console.log(res);
			}
		});
	};
	return (
		<form className={classes.form} onSubmit={changePwdHandler}>
			<div className={classes.control}>
				<label htmlFor="new-password">New Password</label>
				<input
					type="password"
					id="new-password"
					minLength="7"
					ref={newPwdEntered}
				/>
			</div>
			<div className={classes.action}>
				<button>Change Password</button>
			</div>
		</form>
	);
};

export default ProfileForm;
