import React, { useState, useEffect, useCallback, useRef } from "react";
import { getDocs, collection, query, limit, startAfter, updateDoc, doc, where, getDoc } from "firebase/firestore";
import { firestore, auth } from "../../firebase/devclientApp";
import { Flex, Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, Input } from '@chakra-ui/react';
import Link from 'next/link';
import CommentPage from "../comments/[comments]";
import { useAuthState } from "react-firebase-hooks/auth";



type Post = {
  id: string;
  title: string;
  content: string;
  postName: string;
  addedBy: string;
  postAddedBy: string;
  isActive: boolean;
  classroomName: string;
  // other properties...
};

type FilterCondition = {
  field: string;
  operator: string;
  value: string;
};

type PostsPageProps = {
  filterCondition?: FilterCondition; // Define a more specific type based on your filtering needs
};

type TenantAdminData = {
  id: string;
  tenants: string[];  // include other properties as needed
};


const PostsPage: React.FC<PostsPageProps> = ({ filterCondition }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);





  //const tenantAdminData: TenantAdminData = // fetch or define tenantAdminData



  const [tenant, setTenant] = useState<string>('');
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
      const tenantAdminData = docSnapshot.data() as TenantAdminData;
      console.log('Tenant Admin data:', tenantAdminData);
      console.log('Tenant ID:', tenant);
      setTenant(tenantAdminData.tenants[0]);
      return tenantAdminData.tenants[0];
    } else {
      console.log('No matching tenant admin document found');
    }
  } catch (error) {
    console.error('Error fetching tenant admin data:', error);
  }
};


const fetchPosts = async (tenantId: string) => {
  try {
      
      if (!tenantId) {
        console.error('No tenantId provided');
        throw new Error('Tenant ID is required');
        // or simply return; to exit the function without an error
      }


      const postsCollectionRef = collection(firestore, 'posts');
      let q = query(postsCollectionRef, where('tenantId', '==', tenantId));

/*
      if (filterCondition) {
        q = query(postsCollectionRef, where(filterCondition.field, filterCondition.operator, filterCondition.value));
      } else {
        q = query(postsCollectionRef);
      }
      */


    //  console.log("q", q);




      const querySnapshot = await getDocs(q);
      const fetchedPosts = querySnapshot.docs.map(doc => ({ ...(doc.data() as Post) }));
      console.log("Fetched posts:", fetchedPosts);

      setPosts(fetchedPosts);
      setFilteredPosts(fetchedPosts); // Initialize filteredPosts with all posts
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };


  useEffect(() => {
    fetchTenantAdminList();


   //fetchComments();
 }, []);





 const setupData = async () => {
  const tenantId = await fetchTenantAdminList();
  if (tenantId) {
    fetchPosts(tenantId);
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
        fetchPosts(tenantId);
      }
    };
  
    setupData();
  }, []);




  useEffect(() => {
    const filtered = posts.filter(post =>
      post.postName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchTerm, posts]);

  const togglePostActivation = async (postId: string, isActive: boolean) => {
    if (window.confirm(`Are you sure you want to ${isActive ? "activate" : "deactivate"} this post?`)) {
        try {
            const postRef = doc(firestore, "posts", postId);
            await updateDoc(postRef, { isActive: !isActive });
            fetchPosts(tenant); // Refresh the comments list
        } catch (error) {
            console.error("Error updating comment:", error);
        }
    }
};

  // Add or modify any other functions as needed, like togglePostActivation if relevant

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
              <Th>Author</Th>
              {/* Add more columns as needed */}
              <Th>Classroom</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredPosts.map(post => (
              <Tr key={post.id}>
                <Td>{post.postName}</Td>
                <Td>{post.postAddedBy}</Td>
                <Td>{post.classroomName}</Td>
                {/* Render more data as needed */}
                <Td>
                  <Link href={`/posts/${post.id}`}>
                    <Button colorScheme="blue">Details</Button>
                  </Link>
                  <Button 
                                        colorScheme={post.isActive ? "red" : "green"} 
                                        ml="2"
                                        onClick={() => togglePostActivation(post.id, post.isActive)}
                                    >
                                        {!post.isActive ?  "Deactivate" : "Activate" }
                                    </Button>
                  {/* Add more actions as needed */}
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
