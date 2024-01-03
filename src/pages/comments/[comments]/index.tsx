import React, { useState, useEffect } from "react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getDoc, doc, collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../../firebase/devclientApp";
import { Comment } from "../../../atoms/commentAtom";
import safeJsonStringify from "safe-json-stringify";
import {
    Box, Spinner, Heading, Text, Flex, Table, Thead, Tbody, Tr, Th, Td, Button,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton
} from '@chakra-ui/react';
import moment from 'moment';

type UserInfo = {
    id?: string;
    tenantId: string;
    title?: string;
    users: any[];
    addedByEmail: string;
    addedBy: string;
    createdAt: string;
    updatedAt: string;
};

type Post = {
    id: string;
    title?: string;
    addedDate: number;
    commentId: string;
    dateAdded: string;
    isDeleted: boolean;
    postAddedBy: string;
    postAddedByName: string;
    postName: string;
    tenantId: string;
    classroomId: string;
    classroomName: string;
    total: number;
    updatedDate: string;
    users: Array<{
        email: string;
        userToken?: string;
        isCommented: boolean;
        read: number;
    }>;
};

type CommentPageProps = {
    commentData: Comment;
};

const CommentPage: React.FC<CommentPageProps> = ({ commentData, postName, threadName }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState(null);
    const [modalConfirmationType, setModalConfirmationType] = useState('');
    const [modalConfirmationText, setModalConfirmationText] = useState('');
    const [allPosts, setAllPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo>({
        tenantId: '',
        title: '',
        users: [],
        addedByEmail: '',
        addedBy: '',
        createdAt: moment().format(),
        updatedAt: moment().format()
    });
    const [filteredPosts, setFilteredPosts] = useState([]);



    useEffect(() => {
        const fetchPosts = async () => {
            const fetchedPosts = await getPosts();
            setAllPosts(fetchedPosts);
        };

        fetchPosts();
    }, []);

    const getPosts = async () => {
        try {
            const postsCollectionRef = collection(firestore, 'comments');
            const q = query(postsCollectionRef, where("id", "==", commentData.postId));
            //const q = query(postsCollectionRef);


            const querySnapshot = await getDocs(q);
            const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Post) }));
            console.log("comments", posts);
            return posts;
        } catch (error) {
            console.error("Error fetching posts:", error);
            return [];
        }
    };

    const applyFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        const filterValue = event.target.value.toLowerCase();
        const filteredData = allPosts.filter(post => post.title && post.title.toLowerCase().includes(filterValue));
        setFilteredPosts(filteredData);
    };

    const getUser = async (id: string) => {
        setIsDataLoading(true);
        const docRef = doc(firestore, 'users', id);
        console.log("id::", id);
        console.log("docRef", docRef);

        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log("get data:", docSnap.data());
                setUserInfo({
                    ...docSnap.data() as UserInfo,
                    id: docSnap.id,
                });
            } else {
                console.log("No such document!");
            }
        } catch (error) {
            console.error("Error getting document:", error);
        } finally {
            setIsDataLoading(false);
        }
    };

    const confirmedModalAction = () => {
        setIsLoading(true);
        // Update and fetch logic
    };

    const openConfirmationModal = (modalType: string, data: any) => {
        setSelectedInfo(data);
        setModalConfirmationType(modalType);
        // Modal opening logic
    };

    const onModalClose = () => {
        setIsModalOpen(false);
    };

    //if (!commentData) {
     //   return <div>No comment exists</div>;
    //}

    return (
        <>
          <Flex mb="4" align="center">
            <Box flex="1">
              <Heading as="h1" size="lg">Comment Details</Heading>
            </Box>
          </Flex>
      
          <Box borderWidth="1px" borderRadius="lg" overflowX="auto">
            <Table variant="simple">
              <Tbody>
                <Tr>
                  <Th>ID</Th>
                  <Td>{commentData.id}</Td>
                </Tr>
                <Tr>
                  <Th>Text</Th>
                  <Td>{commentData.commentText}</Td>
                </Tr>
                <Tr>
                  <Th>Sent By</Th>
                  <Td>{commentData.senderEmail}</Td>
                </Tr>
                <Tr>
                  <Th>Classroom Name</Th>
                  <Td>{commentData.classroomName}</Td>
                </Tr>
                <Tr>
                  <Th>Post Name</Th>
                  <Td>{postName}</Td>
                </Tr>
                <Tr>
                  <Th>Date Sent</Th>
                  <Td>{moment(commentData.dateSent).format('YYYY-MM-DD HH:mm')}</Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </>
      );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    try {

       // const commentDocRef = doc(firestore, "comments", context.query.comment as string);
       //console.log("contextt", context);
       console.log("context.querry.comment", context.query.comments);
       const commentDocRef = doc(firestore, "comments", context.query.comments as string);
        const commentDocSnap = await getDoc(commentDocRef);


        console.log("Fetching comment with ID:", context.query.comments as string);

       
       
       
       
       
       
        const commentData = commentDocSnap.data();

        if (!commentData) {
            console.log("No comment found for ID:");
            return { props: {} };
        }

        if(commentData){
            console.log("classroomId", commentData.classroomId);
            const classroomDocRef = doc(firestore, "classrooms", commentData.classroomId);
        const classroomDocSnap = await getDoc(classroomDocRef);
            const classroomData = classroomDocSnap.data();
            const classroomName = classroomData?.title;
            console.log("Fetching classroom :", classroomData);
            console.log("Fetching classroom with ID:", classroomData?.title);  



             const postDocRef = doc(firestore, "posts", commentData.postId);
             const postDocSnap = await getDoc(postDocRef);
             const postData = postDocSnap.data();
                const postName = postData?.postName;
            console.log("Fetching post with ID:", postData?.postName);


            console.log("Fetched comment data:", commentData);

        
        
            if (commentData?.timestamp) {
                commentData.timestamp = commentData.timestamp.toMillis();
            }
    
            return {
                props: {
                  commentData: {
                    ...commentData,
                    id: commentDocSnap.id,
                  },
                  postName: postData?.postName,
                  classroomName: classroomData?.title,
                },
              };




        }


  
       } catch (error) {
          console.error("Error in getServerSideProps for comments:", error);
          console.error("Context query:", context.query);
          return { props: {} };
      }
}


export default CommentPage;
