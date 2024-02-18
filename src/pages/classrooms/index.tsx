import React, { useState, useEffect } from "react";
//import { Classroom } from "../../atoms/classroomAtom";
import { getDocs, collection, query, doc, getDoc, where } from "firebase/firestore";
import { firestore,auth } from "../../firebase/devclientApp";
import { Flex, Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Button, Input } from '@chakra-ui/react';
import Link from 'next/link';
import { useAuthState } from "react-firebase-hooks/auth";


type ClassroomsPageProps = {};

type User = {
  email: string;
  // other properties...
};

type UserData = {
  id: string;
  tenants: string[]; // Assuming 'tenants' is an array of strings
  // Include other properties as necessary
};

type UserType = {
  id: string;
  tenants: string[]; // Add this line if 'tenants' is an array of strings
  // ... any other properties
};

type Classroom = {
  // ... other properties of Classroom
  users: User[]; // Assuming Classroom has a users property
  id: string;
    name: string;
    classMemberNames: string[];
    joincode: string;
    tenantId: string;
    title: string;
    userEmailAddress: string[];
    userTokens: string[];
    createdBy: string;
    dateAdded: string;
};




const ClassroomsPage: React.FC<ClassroomsPageProps> = () => {
  const [allClassrooms, setAllClassrooms] = useState<Classroom[]>([]);
  const [filteredClassrooms, setFilteredClassrooms] = useState<Classroom[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  //const [tenant, setTenant] =  useState([]);
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState<UserData>({ id: '', tenants: [] });

//import { useAuthState } from "react-firebase-hooks/auth";
//, auth 
//import { firestore,auth } from "../../firebase/devclientApp";


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
        const tenantAdminData: UserData = docSnapshot.data() as UserData;
        console.log('Tenant Admin data:', tenantAdminData);
        setUserData(tenantAdminData); // Set the fetched data
      } else {
        console.log('No matching tenant admin document found');
      }
    } catch (error) {
      console.error('Error fetching tenant admin data:', error);
    }
  };




  useEffect(() => {
    if (userData.tenants.length > 0) {
      // Use the first tenant ID or loop through all if necessary
      const tenantId = userData.tenants[0];
      fetchClassrooms(tenantId);
    }
  }, [userData]);
  

  useEffect(() => {
    const filtered = allClassrooms.filter(classroom =>
      classroom.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClassrooms(filtered);
  }, [searchTerm, allClassrooms]);

  const fetchClassrooms = async (tenantId: string) => {
    try {

      if (!tenantId) {
        console.error('No tenantId provided');
        throw new Error('Tenant ID is required');
        // or simply return; to exit the function without an error
      }
  
      const classroomCollectionRef = collection(firestore, 'classrooms');
      const q = query(classroomCollectionRef, where('tenantId', '==', 'Freemium'));
      const querySnapshot = await getDocs(q);
      const classrooms = querySnapshot.docs.map(doc => ({  ...(doc.data() as Classroom) }));
      console.log("classrooms", classrooms);


      setAllClassrooms(classrooms);
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      return [];
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // JSX layout for displaying classrooms
  return (
    <>
      <Flex mb="4" align="center">
        <Box flex="1">
          <Heading as="h1" size="lg">Classrooms</Heading>
        </Box>
      </Flex>

      <Box mb="4">
        <Input
          placeholder="Search posts"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Box>

      <Box borderWidth="1px" borderRadius="lg" overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Date Added</Th>
              <Th>User count</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredClassrooms.map(classroom => (
              <Tr key={classroom.id}>
                <Td>{classroom.title}</Td>
                <Td>{classroom.dateAdded}</Td>
                <Td>{classroom.users.length}</Td>

                               <Td>
                <Link href={`/classrooms/${classroom.id}`}>
  <Button colorScheme="blue">Details</Button>
</Link>
                  {/*<Button colorScheme="red" ml="2">Deactivate</Button>*/}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </>
  );
};

export default ClassroomsPage;
