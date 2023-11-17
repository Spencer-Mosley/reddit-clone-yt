import { Input, Button, Flex, Text } from "@chakra-ui/react";
import React, {useState} from "react";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";
import { auth } from "../../../firebase/devclientApp";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { FIREBASE_ERRORS } from "../../../firebase/errurs";
import { sendPasswordResetEmail } from "firebase/auth";

type LoginProps = {

};

const Login: React.FC<LoginProps> = () => {
    const setAuthModalState = useSetRecoilState(authModalState);
    const [loginForm, setLoginForm] = React.useState({
        email:"",
        password:"",    
    });

    const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        signInWithEmailAndPassword(loginForm.email, loginForm.password);
    };

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLoginForm(prev => ({...prev, [event.target.name]: event.target.value}));
    };

   

    return (
        <form onSubmit={onSubmit}>
            <Input type="email" placeholder="email" name="email" mb={2} onChange={onChange}/>
            <Input type="password" placeholder="password" name="password" onChange={onChange}  />
            <Button type="button" width="100%" height="36px" mt={2} mb={2} onClick={() => setAuthModalState((prev) => ({...prev, view: "resetPassword"}))}>Forgot Password?</Button>
            <Button type="submit" width="100%" height="36px" mt={2} mb={2}>Log In</Button>
            <Text>{FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}</Text>



        </form> 
    )
};

export default Login;