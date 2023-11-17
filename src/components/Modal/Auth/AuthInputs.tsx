import React from "react";
import { useRecoilValue } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";
import { Flex } from "@chakra-ui/react";
//import LoginInputs from './LoginInputs'; // import the components
//import SignupInputs from './SignupInputs';
//import ResetPasswordInputs from './ResetPasswordInputs';
import Login from "./Login";

type AuthInputsProps = {
};

const AuthInputs: React.FC<AuthInputsProps> = () => {
    const modalState = useRecoilValue(authModalState);
    return (
        <Flex 
        direction="column"
        align="center"
        width = "100%"
        mt = {4}
        >
            {modalState.view === "login" && <Login />}
            {/*
            {modalState.view === "signup" && <Signup/>}
    */}
        </Flex>
    )
};

export default AuthInputs;