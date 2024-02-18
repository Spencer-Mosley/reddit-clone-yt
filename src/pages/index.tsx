import { useEffect } from "react";
import { Stack } from "@chakra-ui/react";
import {
  collection,
  DocumentData,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  where,
  doc,
  getDoc
} from "firebase/firestore";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";


import React, { useState,  useContext } from 'react';
//import { Link } from 'react-router-dom';

import { firestore } from '../firebase/devclientApp';
import { auth } from '../firebase/devclientApp';
import { Query } from "firebase/firestore";





import { Box, Text, Flex, Progress, VStack, Heading } from '@chakra-ui/react';
import { cp } from "fs";


interface TenantAdminData {
  id: string;
  tenants?: string[];  // Assuming tenants is an optional array of strings
}




const Home: NextPage = () => {
  const [users, setUsers] = useState<{ id: string; }[] | null>(null);
  const [classrooms, setClassrooms] = useState<{ id: string; }[] | null>(null);
  const [posts, setPosts] = useState<{ id: string; }[] | null>(null);
  const [tenants, setTenants] = useState<{ id: string; }[] | null>(null);

  const [comments, setComments] = useState<{ id: string; }[] | null>(null);
  const [userStatsCounts, setUserStatsCounts] = useState([]);
  const [classesStatsCounts, setClassesStatsCounts] = useState([]);
  const [postsStatsCounts, setPostsStatsCounts] = useState([]);
  const [commentsStatsCounts, setCommentsStatsCounts] = useState([]);
  const [isChartLoaded, setIsChartLoaded] = useState(false);
  const [currentFilterType, setCurrentFilterType] = useState('yearly');
  const [tenantDetail, setTenantDetail] = useState(null);





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
        const tenantAdminData = {  ...docSnapshot.data() };
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


  const fetchUsers = async () => {
    try {
      let q: Query<DocumentData>;;
      if (tenant) {
        console.log('fetch userstenantID', tenant);
        q = query(collection(firestore, "users"), where('tenantId', '==', tenant));
      } else {
        q = query(collection(firestore, "users"));
      }
      const querySnapshot = await getDocs(q);
      const userData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(userData);
      console.log('userData', userData);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Handle error appropriately
    }
  };

  const fetchClassrooms = async () => {
    try {
      let q;
      if (tenant) {
        q = query(collection(firestore, "classrooms"), where('tenantId', '==', tenant));
      } else {
        q = query(collection(firestore, "classrooms"));
      }
      const querySnapshot = await getDocs(q);
      const classroomData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setClassrooms(classroomData);
      console.log('classroomData', classroomData);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Handle error appropriately
    }
  };

  /*
  const fetchPosts = async () => {
    try {

      let q;
      if (tenant) {
        q = query(collection(firestore, "posts"), where('tenantId', '==', tenant));
      } 

      const querySnapshot = await getDocs(q);
      const postData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postData);
      console.log('postData', postData);
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Handle error appropriately
    }
  };
  
  const fetchComments = async () => {
    try {

      let q;
      if (tenant) {
        q = query(collection(firestore, "comments"), where('tenantId', '==', tenant));
        console.log('comemnts tennant', tenant);
      }
      const querySnapshot = await getDocs(q);
      const commentData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentData);
      console.log('commentData', commentData);
    } catch (error) {
      console.error('Error fetching comments:', error);
      // Handle error appropriately
    }
  };

  */
  const fetchPosts = async () => {
    try {
      let q: Query<DocumentData>;
      if (tenant) {
        q = query(collection(firestore, "posts"), where('tenantId', '==', tenant));
      } else {
        q = query(collection(firestore, "posts"));
      }
      const querySnapshot = await getDocs(q);
      // rest of your code
    } catch (error) {
      console.error('Error fetching posts:', error);
      // Handle error appropriately
    }
  };
  
  const fetchComments = async () => {
    try {
      let q: Query<DocumentData>;
      if (tenant) {
        q = query(collection(firestore, "comments"), where('tenantId', '==', tenant));
      } else {
        q = query(collection(firestore, "comments"));
      }
      const querySnapshot = await getDocs(q);
      // rest of your code
    } catch (error) {
      console.error('Error fetching comments:', error);
      // Handle error appropriately
    }
  };



  
  useEffect(() => {
     fetchTenantAdminList();


    //fetchComments();
  }, []);

  useEffect(() => {
    if (tenant) {
      // Call other functions here
      fetchUsers();
      fetchClassrooms();
      fetchPosts();
      fetchComments();
    }
  }, [tenant]);







  return (
    <>
      <Flex justifyContent="space-between" mb="4">
        <Heading as="h1">Dashboard</Heading>
        {/* Additional elements if needed */}
      </Flex>

      <Flex wrap="wrap" justifyContent="space-between" mb="5">
        {/* User Count Section */}
        <Box
          p="5"
          boxShadow="base"
          borderRadius="lg"
          mb="5"
          flex="1"
          minW="250px"
          maxW="300px"
          bg="white"
          textAlign="center"
        >
          <Text fontSize="xl" mb="2">USERS</Text>
          <Text fontSize="3xl">{users?.length}</Text>
          {/* SVG or icon here */}
        </Box>

        {/* Classes Count Section */}
        <Box
          p="5"
          boxShadow="base"
          borderRadius="lg"
          mb="5"
          flex="1"
          minW="250px"
          maxW="300px"
          bg="white"
          textAlign="center"
        >
          <Text fontSize="xl" mb="2">CLASSES</Text>
          <Text fontSize="3xl">{classrooms?.length}</Text>
          {/* SVG or icon here */}
        </Box>

        {/* Posts Count Section */}
        <Box
          p="5"
          boxShadow="base"
          borderRadius="lg"
          mb="5"
          flex="1"
          minW="250px"
          maxW="300px"
          bg="white"
          textAlign="center"
        >
          <Text fontSize="xl" mb="2">POSTS</Text>
          <Text fontSize="3xl">{posts?.length}</Text>
          {/* SVG or icon here */}
        </Box>

        {/* Comments Count Section */}
        <Box
          p="5"
          boxShadow="base"
          borderRadius="lg"
          mb="5"
          flex="1"
          minW="250px"
          maxW="300px"
          bg="white"
          textAlign="center"
        >
          <Text fontSize="xl" mb="2">COMMENTS</Text>
          <Text fontSize="3xl">{comments?.length}</Text>
          {/* SVG or icon here */}
        </Box>
      </Flex>

      
    </>
  );
};

export default Home;
