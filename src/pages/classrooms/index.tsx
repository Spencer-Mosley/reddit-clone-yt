import React, { useState, useEffect } from "react";
import { Classroom } from "../../atoms/classroomAtom";
import { getDocs, collection, query } from "firebase/firestore";
import { firestore } from "../../firebase/devclientApp";
import { Flex, Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import Link from 'next/link';


type ClassroomsPageProps = {};

type User = {
  email: string;
  // other properties...
};



const ClassroomsPage: React.FC<ClassroomsPageProps> = () => {
  const [allClassrooms, setAllClassrooms] = useState<Classroom[]>([]);

  useEffect(() => {
    const fetchClassrooms = async () => {
      const fetchedClassrooms = await getClassrooms();
      setAllClassrooms(fetchedClassrooms);
    };

    fetchClassrooms();
  }, []);

  const getClassrooms = async () => {
    try {
      const classroomCollectionRef = collection(firestore, 'threads');
      const q = query(classroomCollectionRef);
      const querySnapshot = await getDocs(q);
      const classrooms = querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Classroom) }));
      console.log("classrooms", classrooms);
      return classrooms;
    } catch (error) {
      console.error("Error fetching classrooms:", error);
      return [];
    }
  };

  // JSX layout for displaying classrooms
  return (
    <>
      <Flex mb="4" align="center">
        <Box flex="1">
          <Heading as="h1" size="lg">Classrooms</Heading>
        </Box>
      </Flex>

      <Box borderWidth="1px" borderRadius="lg" overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Date Added</Th>
              <Th>User count</Th>
              <Th>move this to the details page</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {allClassrooms.map(classroom => (
              <Tr key={classroom.id}>
                <Td>{classroom.title}</Td>
                <Td>{classroom.dateAdded}</Td>
                <Td>{classroom.users.length}</Td>

                <Td>{classroom.users.map(user => user.email).join(", ")}</Td>                <Td>
                <Link href={`/classrooms/${classroom.id}`}>
  <Button colorScheme="blue">Details</Button>
</Link>
                  <Button colorScheme="red" ml="2">Deactivate</Button>
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
