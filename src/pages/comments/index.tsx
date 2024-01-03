import React, { useState, useEffect, useCallback, useRef } from "react";
import {Comment } from "../../atoms/commentAtom";
import { getDocs, collection, query, limit, startAfter, updateDoc, doc, where, getDoc } from "firebase/firestore";
import { firestore, auth } from "../../firebase/devclientApp";
import { Flex, Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Button, Input } from '@chakra-ui/react';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';
import { useAuthState } from "react-firebase-hooks/auth";





type CommentsPageProps = {
  filterCondition?: any;
};


type User = {
  email: string;
  // other properties...
};



const CommentsPage: React.FC<CommentsPageProps> =  ({ filterCondition }) => {
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



  


  const [tenant, setTenant] =  useState([]);
  const [user] = useAuthState(auth);
  //getDoc





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
        return tenantAdminData.tenants[0];
      } else {
        console.log('No matching tenant admin document found');
        return null;
      }
    } catch (error) {
      console.error('Error fetching tenant admin data:', error);
    }
  };


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






  const fetchComments = async (tenantId) => {
    setLoading(true);
    try {


      if (!tenantId) {
        console.error('No tenantId provided');
        throw new Error('Tenant ID is required');
        // or simply return; to exit the function without an error
      }


      const commentCollectionRef = collection(firestore, 'comments');
      let q = query(commentCollectionRef, where('tenantId', '==', tenantId));
  
      /*
      if (filterCondition) {
        q = query(commentCollectionRef, where(filterCondition.field, filterCondition.operator, filterCondition.value));
      } else {
        q = query(commentCollectionRef);
      }
      */
  
      const querySnapshot = await getDocs(q); // Use the query 'q' here
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
  fetchTenantAdminList();


 //fetchComments();
}, []);





const setupData = async () => {
const tenantId = await fetchTenantAdminList();
if (tenantId) {
  fetchComments(tenantId);
}
};

useEffect(() => {
setupData();
}, []); 

/*useEffect(() => {
  if (tenant) {
    // Call other functions here
    console.log('fethcing posts');
    console.log('Tenant ID:', tenant);
    fetchPosts(tenant);
  }
}, [tenant]);
*/

useEffect(() => {
  const setupData = async () => {
    const tenantId = await fetchTenantAdminList();
    if (tenantId) {
      fetchComments(tenantId);
    }
  };

  setupData();
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
                <Td>{comment.classroomName}</Td>
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
