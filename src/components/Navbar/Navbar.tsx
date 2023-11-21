import React from 'react';
import { Flex, Image, Text} from '@chakra-ui/react';
import SearchInput from './Searchinput';
import RightContent from './RightContent/RightContent';
import AuthModal from '../Modal/Auth/AuthModal';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/devclientApp';

const Navbar: React.FC = () => {
    const [user, loading, error] = useAuthState(auth);
    return (
        <Flex bg="white" height="44px" padding="6px 12px">
            <Flex align="center">
                <Image src="/images/redditFace2.svg" height="30px" />
                <Image src="/images/redditText2.svg" height="46px" display={{ base: 'none', md: 'unset' }} />
            </Flex>
            {<SearchInput />}
            <Text>Subtenant dropdown</Text>
            <RightContent user = {user}/>
            <AuthModal />
        </Flex>
    );
};


export default Navbar;