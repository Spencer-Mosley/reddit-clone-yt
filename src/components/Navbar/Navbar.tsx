import React from 'react';
import { Flex, Image, Text, Spacer } from '@chakra-ui/react';
import SearchInput from './Searchinput'; // Assuming you have this component
import RightContent from './RightContent/RightContent';
import AuthModal from '../Modal/Auth/AuthModal'; // Assuming you have this component
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/devclientApp';

const Navbar: React.FC = () => {
    const [user, loading, error] = useAuthState(auth);

    return (
        <Flex bg="white" height="44px" padding="6px 12px" alignItems="center" justifyContent="space-between">
            <Flex align="center">
                {/*<Image src="/images/redditFace2.svg" height="30px" />*/}
            </Flex>

            <Spacer /> {/* This will push the following content to the right */}

            <Flex align="center">

                <RightContent user={user} />
                <AuthModal />
            </Flex>
        </Flex>
    );
};

export default Navbar;
