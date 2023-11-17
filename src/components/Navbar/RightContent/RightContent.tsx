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

const RightContent: React.FC<RightContentProps> = ({user}) => {
  return (
    <>
    <Flex justify='center' align='center'>
      {user ? <Icons/> : <AuthButtons />}
      <UserMenu user={user}/>


    </Flex>

        </>
  );
};

export default RightContent;