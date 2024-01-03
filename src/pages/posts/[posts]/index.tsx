import React, { useState, useEffect } from "react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getDoc, doc, collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../../firebase/devclientApp";
import { Post as PostType } from "../../../atoms/postAtom";
import safeJsonStringify from "safe-json-stringify";
import {
    Box, Spinner, Heading, Text, Flex, Table, Thead, Tbody, Tr, Th, Td, Button,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton
} from '@chakra-ui/react';
import moment from 'moment';
import CommentsPage from "../../comments";

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
    postId: string;
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
        isPosted: boolean;
        read: number;
    }>;
};

type PostPageProps = {
    postData: PostType;
};

const PostPage: React.FC<PostPageProps> = ({ postData }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInfo, setSelectedInfo] = useState(null);
    const [modalConfirmationType, setModalConfirmationType] = useState('');
    const [modalConfirmationText, setModalConfirmationText] = useState('');
    const [allComments, setAllComments] = useState<Post[]>([]);
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
    const [filteredComments, setFilteredComments] = useState([]);

    useEffect(() => {
        console.log("use effect getting post data");
        console.log("postData", postData);

        const id = "id-20230410230491";
        console.log("postData", postData);
        if (id) {
            //getUser(postData.createdBy);
        } else {
            // history.push('/admin/posts');
        }

        return () => {
            // Unsubscribe or cleanup logic
        };
    }, []);

    /*
    useEffect(() => {
        const fetchPosts = async () => {
            const fetchedPosts = await getPosts();
            setAllPosts(fetchedPosts);
        };

        fetchPosts();
    }, []);

    */

    /*
    probably needs to be get comments
    const getPosts = async () => {
        try {
            const postsCollectionRef = collection(firestore, 'posts');
            const q = query(postsCollectionRef, where("id", "==", "id-1681186451902"));
            //const q = query(postsCollectionRef);

            const querySnapshot = await getDocs(q);
            const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Post) }));
            console.log("posts", posts);
            return posts;
        } catch (error) {
            console.error("Error fetching posts:", error);
            return [];
        }
    };
    */


        
    useEffect(() => {
        const fetchComments = async () => {
            const fetchedComments = await getComments();
            setAllComments(fetchedComments);
        };

        fetchComments();
    }, []);

   
    const getComments = async () => {
        try {
            const postsCollectionRef = collection(firestore, 'comments');
            const q = query(postsCollectionRef, where("postId", "==", postData.id));
            //const q = query(postsCollectionRef);

            const querySnapshot = await getDocs(q);
            const comments = querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Post) }));
            console.log("comments", comments);
            return comments;
        } catch (error) {
            console.error("Error fetching comments:", error);
            return [];
        }
    };
    

    const applyFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        const filterValue = event.target.value.toLowerCase();
        const filteredData = allComments.filter(comment => comment.title && comment.title.toLowerCase().includes(filterValue));
        setFilteredComments(filteredData);
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

    return (
        <>
          <Flex mb="4" align="center">
            <Box flex="1">
              <Heading as="h1" size="lg">Post Details</Heading>
            </Box>
          </Flex>
      
          <Box borderWidth="1px" borderRadius="lg" overflowX="auto">
            <Table variant="simple">
              <Tbody>
                <Tr>
                  <Th>ID</Th>
                  <Td>{postData.id}</Td>
                </Tr>
                <Tr>
                  <Th>Title</Th>
                    <Td>{postData.postName}</Td>
                </Tr>
                <Tr>
                  <Th>Posted By</Th>
                    <Td>{postData.postAddedByName}</Td>
                </Tr>
                <Tr>
                  <Th>classroom Name</Th>
                    <Td>{postData.classroomName}</Td>
                </Tr>
                <Tr>
                  <Th>Date Posted</Th>
                    <Td>{postData.dateAdded}</Td>
                </Tr>
              </Tbody>
            </Table>
            
          </Box>

          <CommentsPage filterCondition={{ field: 'postId', operator: '==', value: postData.id }} />
          
          

         
        </>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    try {

               // const commentDocRef = doc(firestore, "comments", context.query.comment as string);
       console.log("contexttPost", context.query);
       const postDocRef = doc(firestore, "posts", context.query.posts as string);
       const postDocSnap = await getDoc(postDocRef);


        console.log("Fetching post with ID:", context.query.posts);

        const postData = postDocSnap.data();
       
        if (!postData) {
            console.log("No post found for ID:");
            return { props: {} };
        }

        if(postData){
            //const classroomDocRef = doc(firestore, "classrooms", commentData.classroomId);
            console.log("classroomId", postData.classroomId);
            const classroomDocRef = doc(firestore, "classrooms", postData.classroomId);
        const classroomDocSnap = await getDoc(classroomDocRef);
            const classroomData = classroomDocSnap.data();
            const classroomName = classroomData?.title;
            console.log("Fetching classroom with Title:", classroomData?.title);  


/*
probably needs to be the comment data
            console.log("postclassroomId", postData.postdId);           
             const postDocRef = doc(firestore, "posts", commentData.postId);
             const postDocSnap = await getDoc(postDocRef);
             const postData = postDocSnap.data();
                const postName = postData?.postName;
            console.log("Fetching post with ID:", postData?.postName);

*/
            console.log("Fetched post data:", postData);

        
        
            if (postData?.timestamp) {
                postData.timestamp = postData.timestamp.toMillis();
            }
    
            return {
                props: {
                  postData: {
                    ...postData,
                    id: postDocSnap.id,
                  },
                },
              };




        }


       
        
    
    } catch (error) {
        console.error("Error in getServerSideProps:", error);
        return { props: {} };
    }
}


export default PostPage;
