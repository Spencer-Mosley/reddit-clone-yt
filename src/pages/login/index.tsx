import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../../firebase/devclientApp';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
} from '@chakra-ui/react';

const Login = () => {
    console.log("rendering login ");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const toast = useToast();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/'); // Redirect to the homepage or dashboard after login
    } catch (error: any) {
      toast({
        title: 'Login Failed',
        description: error.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing="4" p="8" boxShadow="lg" rounded="md">
      <Box textAlign="center">
        <h1>Login to Your Account</h1>
      </Box>
      <Box minW={{ base: '90%', md: '468px' }}>
        <form onSubmit={handleLogin}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </FormControl>
            <Button
              type="submit"
              variant="solid"
              colorScheme="blue"
              width="full"
            >
              Login
            </Button>
          </VStack>
        </form>
      </Box>
    </VStack>
  );
};

export default Login;
