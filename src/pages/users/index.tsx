import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  Flex,
} from '@chakra-ui/react';

import { firestore, auth } from "../../firebase/devclientApp";
import { getDocs, collection, query, limit, startAfter, updateDoc, doc, where, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import Link from 'next/link';




// Assuming you have a User type defined somewhere
type User = {
  username: string;
  email: string;
  dateAdded: string;
  isBlocked: boolean;
  id: string;
};

type UserListProps = {
  filterCondition?: any; // Define a more specific type based on your filtering needs

};

const UserList: React.FC = ({ filterCondition }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);


  const [tenant, setTenant] =  useState([]);
  const [user] = useAuthState(auth);


  const fetchTenantAdminList = async () => {
    try {
      // Get the currently logged-in user  
      if (!user) {
        console.log('No user logged in');
        return;
      }

      console.log('User:', user.uid);
  
      // Get the document from TenantAdmins collection with the ID of the logged-in user
      const tenantAdminRef = doc(firestore, "tenantAdmins", user.uid);
      const docSnapshot = await getDoc(tenantAdminRef);
  
      if (docSnapshot.exists()) {
        const tenantAdminData = { id: docSnapshot.id, ...docSnapshot.data() };
        console.log('Tenant Admin data:', tenantAdminData);
        console.log('Tenant ID:', tenant);
        setTenant(tenantAdminData.tenants[0]);
      } else {
        console.log('No matching tenant admin document found');
      }
    } catch (error) {
      console.error('Error fetching tenant admin data:', error);
    }
  };

  const fetchUsers = async (tenantId) => {
    try {
      // Check if tenantId is provided, if not, throw an error or return early
      if (!tenantId) {
        console.error('No tenantId provided');
        throw new Error('Tenant ID is required');
        // or simply return; to exit the function without an error
      }
  
      const usersCollectionRef = collection(firestore, 'users');
      let q = query(usersCollectionRef, where('tenantId', '==', tenantId));
  
      // Apply any additional search filters if they exist
      if (filterCondition) {
        q = query(q, where(filterCondition.field, filterCondition.operator, filterCondition.value));
      }

      console.log("q", q);
  
      const querySnapshot = await getDocs(q);
      const fetchedUsers = querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as User) }));
      setAllUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
      console.log("Fetched users:", fetchedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      // Handle error case here
    }
  };
  


  /*
  const fetchUsers = async () => {
    try {
      const usersCollectionRef = collection(firestore, 'users');
      let q;

      if (filterCondition) {
        q = query(usersCollectionRef, where(filterCondition.field, filterCondition.operator, filterCondition.value));
      } else {
        q = query(usersCollectionRef);
      }



      const querySnapshot = await getDocs(q);
      const fetchedUsers = querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as User) }));
      setAllUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers); // Initialize filteredUsers with all users
      console.log("users", allUsers);
    } catch (error) {
      console.error("Error fetching usesr:", error);
      return [];
    }
  };
*/


  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    fetchTenantAdminList();


   //fetchComments();
 }, []);

 useEffect(() => {
   if (tenant) {
     // Call other functions here
     fetchUsers(tenant);
   }
 }, [tenant]);


  useEffect(() => {
    const filtered = allUsers.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, allUsers]);


  // Function to toggle the isBlocked status of a user
  const handleToggleBlockUser = async (user: User) => {
    const userRef = doc(firestore, "users", user.id);
    try {
      await updateDoc(userRef, {
        isBlocked: !user.isBlocked
      });

      // Update the local state to reflect the change
      setAllUsers(allUsers.map(u => u.id === user.id ? { ...u, isBlocked: !u.isBlocked } : u));
      setFilteredUsers(filteredUsers.map(u => u.id === user.id ? { ...u, isBlocked: !u.isBlocked } : u));

      console.log(`User ${user.id} is now ${user.isBlocked ? 'unblocked' : 'blocked'}.`);
    } catch (error) {
      console.error(`Error toggling block status for user ${user.id}:`, error);
    }
  };






  // Example function for making a user an admin
  const handleMakeAdmin = (id: string) => {
    console.log(`Make ${id} an admin`);

    // Implement your logic to make a user an admin
  };

// Example function for blocking a user
const handleBlockUser = async (id: string) => {
  // Reference to the user's document in the 'users' collection
  const userRef = doc(firestore, "users", id);

  try {
    // Update the 'isBlocked' field of the user document
    await updateDoc(userRef, {
      isBlocked: true
    });
    console.log(`User ${id} is now blocked.`);
  } catch (error) {
    console.error(`Error blocking user ${id}:`, error);
  }
};

  

  return (
    <Box>
      <Flex mb="4" justify="space-between" align="center">
        <Heading as="h1" size="lg">Users</Heading>

      </Flex>

      <Box mb="4">
        <Input
          placeholder="Search posts"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Box>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>Email</Th>
            <Th>Date Added</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredUsers.map((user, index) => (
            <Tr key={index}>
              <Td>{user.username}</Td>
              <Td>{user.email}</Td>
              <Td>{user.dateAdded}</Td>
              <Td>
                {/*<Button colorScheme="blue" mr="2" onClick={() => handleMakeAdmin(user.id)}>
                  Make Admin
                </Button>
                */}
                             {/*   <Link href={`/classrooms/${user.id}`}>
  <Button colorScheme="blue">Details</Button>
</Link>
              */}
              
                <Button
                  colorScheme={user.isBlocked ? 'green' : 'red'}
                  onClick={() => handleToggleBlockUser(user)}
                >
                  {user.isBlocked ? 'Unblock this user' : 'Block this user'}
                </Button>


              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default UserList;
