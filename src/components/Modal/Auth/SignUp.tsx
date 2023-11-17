import { Input, Button, Flex } from "@chakra-ui/react";
import React from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";
import { auth } from "../../../firebase/devclientApp";


type SignUpProps = {

};

const Login: React.FC<SignUpProps> = () => {
    const setAuthModalState = useSetRecoilState(authModalState);
    const [loginForm, setLoginForm] = React.useState({
        email:"",
        password:"",    

    });

    const onSubmit = () => {};

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        //setLoginForm({...loginForm, [e.target.name]: e.target.value});
        setLoginForm(prev => ({...prev, [event.target.name]: event.target.value}));
    };

    const [createUserWithEmailAndPassword, _, loading, authError] =
    useCreateUserWithEmailAndPassword(auth);


    return (
        <form onSubmit={onSubmit}>
            <Input type="email" placeholder="email" name="email" mb={2} onChange={onChange}/>
            <Input type="password" placeholder="password" name="password" onChange={onChange}  />
            <Button type="submit" width="100%" height="36px" mt={2} mb={2}>Log In</Button>
            <Flex width="100%" justify="space-between">
                <Button variant="link" color="blue.400" onClick={() => console.log("forgot password")}>Forgot Password?</Button>
                <Button variant="link" color="blue.400" onClick={() => setAuthModalState((prev) => ({
                    ...prev,
                    view: "signup",
                
                }))}>Sign Up</Button>

            </Flex>
        </form> 
    )
};

export default Login;