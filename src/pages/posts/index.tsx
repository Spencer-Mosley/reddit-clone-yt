import React, { useState, useEffect } from "react";
import { getDocs, collection, query, limit } from "firebase/firestore";
import { firestore } from "../../firebase/devclientApp";
import { Flex, Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Input } from '@chakra-ui/react';
import Link from 'next/link';
import ReactPaginate from 'react-paginate';

type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  isActive: boolean;
  postName: string;
  threadName: string;
  postAddedByName: string;
  dateAdded: string;
  // Add other post properties as needed
};

const PostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const postsPerPage = 10;

  const fetchPosts = async () => {
    try {
      const postCollectionRef = collection(firestore, 'posts');
      const q = query(postCollectionRef, limit(postsPerPage));
      const querySnapshot = await getDocs(q);
      const fetchedPosts = querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Post) }));
      setPosts(fetchedPosts);
      // Set pageCount based on total data
      console.log('Fetched Posts:', fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
    fetchPosts();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <>
      <Flex mb="4" align="center">
        <Box flex="1">
          <Heading as="h1" size="lg">Posts</Heading>
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
              <Th>Classroom</Th>
              <Th>Author</Th>
              <Th>Created At</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {posts.map(post => (
              <Tr key={post.id}>
                <Td>{post.postName}</Td>
                <Td>{post.threadName}</Td>
                <Td>{post.postAddedByName}</Td>
                <Td>{post.dateAdded}</Td>
                <Td>
                  {/* Add action buttons here */}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      
    </>
  );
};

export default PostsPage;
