import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure, Flex } from "@chakra-ui/react";
import React, { use, useEffect } from "react";
import { useRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalAtom";
import AuthInputs from "./AuthInputs";
import { auth } from "../../../firebase/devclientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import ResetPassword from "./ResetPassword";
import Login from "./Login";

const AuthModal: React.FC = () => {
  const [modalState, setModalState] = useRecoilState(authModalState);
  const [user, loading, error] = useAuthState(auth);

  const handleClose = () => {
  setModalState((prev) => ({
    ...prev,
    open: false,
  }));
  };

  const toggleView = () => {
    setModalState((prevState) => ({
      ...prevState,
      view: prevState.view === "login" ? "resetPassword" : "login",
    }));
  };

  useEffect(() => {
    if (user) {
      handleClose();
    }
  }, [user]);



  return (
    <>

      <Modal isOpen={modalState.open} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">
            {modalState.view === "login" && 'Login'}
            {modalState.view === "signup" && 'Sign Up'}
            {modalState.view === "resetPassword" && 'Reset Password'}



          </ModalHeader>
          <ModalCloseButton />
          <ModalBody 
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}
          pb={6}
          >

            <Flex 
            direction='column' 
            align="center"
            justify="center"
            w="70%"
            border="1px solid red"
            >

{modalState.view === "login"  ? <Login /> : <ResetPassword toggleView={toggleView} />}


             {/* <AuthInputs /> */}
              
            </Flex>


          </ModalBody>

         
        </ModalContent>
      </Modal>
    </>

    );
};

export default AuthModal;



