import React from "react";
import { Flex, InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
import { PhoneIcon } from "@chakra-ui/icons";

type SearchInputProps = {   
};

const SearchInput: React.FC<SearchInputProps> = ({}) => {
  return (
    <Flex flexGrow={1} mr={2} align='center'>
        <InputGroup>
            <InputLeftElement pointerEvents='none'>
                <PhoneIcon color='gray.300' />
            </InputLeftElement>
            <Input 
                type='tel' 
                placeholder='Search' 
                fontSize="10pt"
                _placeholder={{ color: 'gray.500' }}
                _hover={{
                    bg: 'white',
                    border: '1px solid',
                    borderColor: 'blue.500',
                }}
                _focus={{
                    outline: 'none',
                    border: '1px solid',
                    borderColor: 'blue.500',
                }}
            />
        </InputGroup>
    </Flex> 
  );
};

export default SearchInput;