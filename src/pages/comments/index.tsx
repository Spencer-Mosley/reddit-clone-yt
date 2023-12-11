import React, { useState, useEffect, useCallback, useRef } from "react";
import {Comment } from "../../atoms/commentAtom";
import { getDocs, collection, query, limit, startAfter, updateDoc, doc, where  } from "firebase/firestore";
import { firestore } from "../../firebase/devclientApp";
import { Flex, Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Button, Input } from '@chakra-ui/react';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';




type CommentsPageProps = {};


type User = {
  email: string;
  // other properties...
};



const CommentsPage: React.FC<CommentsPageProps> = () => {
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const commentsPerPage = 10;

  const [searchTerm, setSearchTerm] = useState('');
  const [originalComments, setOriginalComments] = useState<Comment[]>([]);
  const [filteredComments, setFilteredComments] = useState<Comment[]>([]);

  const [comments, setComments] = useState<Comment[]>([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const loader = useRef(null);



  




  /*const fetchComments = async (page: number) => {

    console.log("Fetching comments for page:", page);

    try {
      console.log("fetchComments page", page);
      const commentCollectionRef = collection(firestore, 'comments');
      let q;
      if (page === 0) {
        q = query(commentCollectionRef, limit(commentsPerPage));
      } else {
        const lastVisible = allComments[allComments.length - 1];
        q = query(commentCollectionRef, startAfter(lastVisible), limit(commentsPerPage));
      }
      const querySnapshot = await getDocs(q);
      const comments = querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Comment) }));

      setAllComments(comments);
      setPageCount(Math.ceil(querySnapshot.size / commentsPerPage));
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  */






  const fetchComments = async () => {
    setLoading(true);
    try {
      const commentCollectionRef = collection(firestore, 'comments');
      const querySnapshot = await getDocs(commentCollectionRef);
      const fetchedComments = querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Comment) }));
      setComments(fetchedComments);
      setFilteredComments(fetchedComments); // Initialize filteredComments with all comments
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  




  const toggleCommentActivation = async (commentId: string, isActive: boolean) => {
    if (window.confirm(`Are you sure you want to ${isActive ? "activate" : "deactivate"} this comment?`)) {
        try {
            const commentRef = doc(firestore, "comments", commentId);
            await updateDoc(commentRef, { isActive: !isActive });
            fetchComments(currentPage); // Refresh the comments list
        } catch (error) {
            console.error("Error updating comment:", error);
        }
    }
};



useEffect(() => {
  fetchComments();
}, []);

useEffect(() => {
  const filtered = comments.filter(comment =>
    comment.commentText?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  setFilteredComments(filtered);
  console.log("filtered", filtered);
}, [searchTerm, comments]);





  // JSX layout for displaying comments
  return (
    <>
      <Flex mb="4" align="center">
        <Box flex="1">
          <Heading as="h1" size="lg">Comments</Heading>
        </Box>
      </Flex>

      <Box mb="4">
        <Input
          placeholder="Search comments"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Box>

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
            {filteredComments.map(comment => (
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
<Button 
                                        colorScheme={comment.isActive ? "red" : "green"} 
                                        ml="2"
                                        onClick={() => toggleCommentActivation(comment.id, comment.isActive)}
                                    >
                                        {!comment.isActive ?  "Deactivate" : "Activate" }
                                    </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <div ref={loader} />
    </>
  );
};

export default CommentsPage;
