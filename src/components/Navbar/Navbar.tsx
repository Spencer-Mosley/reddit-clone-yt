import React from 'react';
import { Flex, Image } from '@chakra-ui/react';

const Navbar: React.FC = () => {
    return (
        <Flex bg="white" height="44px" padding="6px 12px">
            <Flex align="center">
                <Image src="/images/redditFace.svg" height="30px" />
                <Image src="/images/redditText.svg" height="46px" display={{ base: 'none', md: 'unset' }} />
            </Flex>
        </Flex>
    );
};

export default Navbar;