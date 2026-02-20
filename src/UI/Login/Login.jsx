import { Fragment, useRef, useState, useEffect } from 'react';

import { FaEnvelope, FaLock, FaEyeSlash, FaEye } from "react-icons/fa6";

import { Layout, Outer, Footer} from "../../components";

import { useSelector } from 'react-redux';

import { Link } from "react-router-dom";

const Login = ({setCurrentUser}) => {
	const userRef = useRef();
	const errRef = useRef();

	// const navigate = useNavigate();
	// const location = useLocation();
	// const from = location.state?.from?.pathname || '/';

	const [ userInput, setUserInput ] = useState({
		email: '',
		password: ''
	})

	const [ inputError, setInputError ] = useState({
		email: '',
		password: ''
	})

	const [ showPassword, setShowPassword ] = useState(false);
	const [ errMsg, setErrMsg ] = useState('');

	const { translations } = useSelector((state) => state.lang);

	useEffect(() => {
		userRef.current.focus();
	}, []);

	useEffect(() => {
		setErrMsg('');
		setInputError({
			email: '',
			password: ''
		})
	}, [ userInput.email, userInput.password ])

	const handleEmailChange = (e) => {
		setUserInput((prevState) => {
			return {...prevState,
			email: e.target.value}
		})
	}

	const handlePasswordChange = (e) => {
		setUserInput((prevState) => {
			return {...prevState,
			password: e.target.value}
		})
	}

	const togglePasswordVisibility = () => {
		setShowPassword((prevState) => !prevState);
	}

	const handleSubmit = async (e) => {
		e.preventDefault();

		// console.log(userInput);

    	if (!userInput.email || !userInput.password) {
    		setInputError((prevState) => {
	    		return {
	    			...prevState,
	    			email: userInput.email === '' ? true : false,
	    			password: userInput.password === '' ? true : false
	    		}
	    	});
    		return;
    	}

    	else {
    		setUserInput({
    			email: '',
    			password: ''
    		})
    	}

    	// else {
	    // 	try {
		// 		const response = await axiosInstance.post('/api/v1/auth/login',
	    // 			{
		// 			    email: userInput.email,
		// 			    password: userInput.password,
		// 			},
		// 			{
		// 			    headers: {
		// 			      'Content-Type': 'application/json', // Send data as JSON
		// 			    },
		// 			    withCredentials: true,
		// 			}
	    // 		);

	    // 		// console.log(JSON.stringify(response.data));

	    // 		if (response.data && response.data.isSuccess) {
	    // 			setUserInput({
	    // 				email: '',
	    // 				password: ''
	    // 			})

	    // 			setCurrentUser({
		// 			  email: userInput.email,
		// 			  token: response.data.token
		// 			});

	    // 			navigate(from, { replace: true });
	    // 		}

	    // 		else {
	    // 			setErrMsg("Login Failed...");
	    // 		}
	    // 	}

	    // 	catch (error) {
	    // 		// console.log(error?.response.data);
	    // 		if (!error?.response) {
	    // 			setErrMsg("Failed to Login In. Try Again...");
	    // 		}
	    // 		else if (error.response.data?.statusCode === 400 && !error.response.data?.isSuccess) {
	    // 			setErrMsg(error.response?.data.message);
	    // 		}

	    // 		else if (error.response.data?.statusCode === 401) {
	    // 			setErrMsg(error.response?.data.message)
	    // 		}

	    // 		else {
	    // 			setErrMsg("Login Failed...");
	    // 		}

	    // 		errRef.current.focus();
	    // 	}
	    // }
	}

	return (
		<Layout>
			<Outer className="min-h-full mt-15 md:mt-16">
				<div className="text-black sm:col-span-3 border-0"></div>
				<div className="text-black sm:col-span-6 bg-gray-50 dark:bg-black flex flex-col justify-start p-6 md:py-0 lg:py-0 border-0 rounded">
					{errMsg && (<p 
						ref={errRef} 
						className="sm:text-xl lg:text-4xl sm:mt-5 md:mt-15 lg:mt-20 p-2 text-center border-2 border-red-500 mb-4 text-red-400"
						aria-live="assertive"
						>
							{errMsg}
						</p>)
					}

					<p className={`text-2xl sm:text-2xl md:text-4xl text-black dark:text-white uppercase text-center font-medium pt-3 md:pt-10 pb-5 ${errMsg === '' && 'sm:mt-1 md:mt-2 lg:mt-3'}`}>
						{translations.login_h1}
					</p>
					
					<p className="text-xl text-black dark:text-white text-center font-medium mb-8">
						{translations.login_h2}
						<Link to="/register" className="text-lg text-red-500 ml-2">{translations.login_h3}</Link>
					</p>

					<form className="w-full flex flex-col space-y-4" onSubmit={handleSubmit}>
						<div className="mb-8">
						  <div className="relative">
						    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
						      <FaEnvelope />
						    </span>
						    <input
						      type="email"
						      id="email"
						      ref={userRef}
						      autoComplete="off"
						      className={`w-full px-10 py-2 rounded shadow-md bg-white dark:bg-transparent dark:border-2 dark:border-white dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputError.email ? 'border-2 border-red-500 focus:ring-0' : ''}`}
						      placeholder={translations.login_h6}
						      aria-describedby="emailHelp"
						      value={userInput.email}
						      onChange={handleEmailChange}
						    />
						  </div>
						  {inputError.email && (
					          <p className="text-red-500 text-sm mt-2">Please enter a valid email.</p>
					        )}
						</div>

						<div className="mb-8">
						  <div className="relative">
						    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
						      <FaLock />
						    </span>
						    <input
						      type={showPassword ? 'text' : 'password'}
						      id="password"
						      className={`w-full px-10 py-2 rounded shadow-md bg-white dark:bg-transparent dark:border-2 dark:border-white dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${inputError.password ? 'border-2 border-red-500 focus:ring-0' : ''}`}
						      placeholder={translations.login_h7}
						      value={userInput.password}
						      onChange={handlePasswordChange}
						    />
						    <span
					          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 cursor-pointer"
					          onClick={togglePasswordVisibility}
					        >
					          { showPassword ? <FaEyeSlash /> : <FaEye /> }
					        </span>
						  </div>
						  {inputError.password && (
					          <p className="text-red-500 text-sm mt-2">Your password must contain between 8 and 24 characters.</p>
					        )}
						</div>

						<div className="mb-8 text-gray-500 text-end hover:text-black dark:text-white dark:hover:text-gray-600 transition-colors">
							<a href="#">{translations.login_h4}</a>
						</div>

						<div className="mb-5 w-full flex justify-end">
							<button type="submit" className="bg-black dark:bg-transparent dark:border-2 dark:border-white dark:text-white w-full text-white px-6 py-3 flex justify-center items-center rounded-full hover:bg-blue-600 dark:hover:bg-gray-600 transition-colors">
								{translations.login_h5}
							</button>
						</div>
					</form>
				</div>
				<div className="text-black sm:col-span-3 border-0"></div>

				<div className="text-black sm:col-span-3 mb-5 border-0"></div>
				<div className="text-black sm:col-span-6 mb-5 border-0">
					<Footer />
				</div>
				<div className="text-black sm:col-span-3 mb-5 border-0"></div>
			</Outer>
		</Layout>
	);
};

export default Login;

// const mapDispatchToProps = dispatch => ({
// 	setCurrentUser: user => dispatch(setCurrentUser(user))
// })

// export default connect(null, mapDispatchToProps)(Login);
