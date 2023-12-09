import React, { useState, useEffect } from "react";
import {Comment } from "../../atoms/commentAtom";
import { getDocs, collection, query, limit } from "firebase/firestore";
import { firestore } from "../../firebase/devclientApp";
import { Flex, Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';
import Link from 'next/link';


type CommentsPageProps = {};

type User = {
  email: string;
  // other properties...
};



const CommentsPage: React.FC<CommentsPageProps> = () => {
  const [allComments, setAllComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      const fetchedComments = await getComments();
      setAllComments(fetchedComments);
    };

    fetchComments();
  }, []);

  const getComments = async () => {
    try {
      const commentCollectionRef = collection(firestore, 'comments');
      const q = query(commentCollectionRef, limit(10));
      const querySnapshot = await getDocs(q);
      const comments = querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Comment) }));
      console.log("comments", comments);
      return comments;
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
  };

  // JSX layout for displaying comments
  return (
    <>
      <Flex mb="4" align="center">
        <Box flex="1">
          <Heading as="h1" size="lg">Comments</Heading>
        </Box>
      </Flex>

      <Box borderWidth="1px" borderRadius="lg" overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Comment</Th>
              <Th>Post</Th>
              <Th>Classroom</Th>
              <Th>Sender</Th>
              <Th>Sent Time</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {allComments.map(comment => (
              <Tr key={comment.id}>
                <Td>{comment.commentText}</Td>
                <Td>{comment.postId}</Td>
                <Td>{comment.threadId}</Td>
                <Td>{comment.senderEmail}</Td>
                <Td>{comment.dateAdded}</Td>


            
                                <Td>
                <Link href={`/comments/${comment.id}`}>
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

export default CommentsPage;
