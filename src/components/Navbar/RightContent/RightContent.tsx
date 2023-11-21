import React from "react";
import { Button, Flex } from "@chakra-ui/react";
import AuthButtons from "./AuthButtons";
import { useSetRecoilState } from "recoil";
import {signOut, User} from "firebase/auth";
import { auth } from "../../../firebase/devclientApp";
import Icons from "./Icons";
import UserMenu from "./UserMenu";

type RightContentProps = {
  user?: User| null;
};


// ...

const RightContent: React.FC<RightContentProps> = ({user}) => {
  const handleSignOut = () => {
    signOut(auth).catch((error) => {
      // An error happened.
    });
  };

  return (
    <>
      <Flex justify='center' align='center'>
        {user ? <>{user.email} <Button onClick={handleSignOut}>Logout</Button></> : <AuthButtons />}
      </Flex>
    </>
  );
};

export default RightContent;