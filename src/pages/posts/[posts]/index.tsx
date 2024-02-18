import React, { useState, useEffect } from "react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getDoc, doc, collection, getDocs, query, where } from "firebase/firestore";
import { firestore, auth } from "../../../firebase/devclientApp";
//import { Post as PostType } from "../../../atoms/postAtom";
import safeJsonStringify from "safe-json-stringify";
import {
    Box, Spinner, Heading, Text, Flex, Table, Thead, Tbody, Tr, Th, Td, Button,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton
} from '@chakra-ui/react';
import moment from 'moment';
import CommentsPage from "../../comments";

import { useAuthState } from "react-firebase-hooks/auth";

import { useRouter } from "next/router";


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
    postData: Post;
};

const PostPage: React.FC<PostPageProps> = () => {
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
    const [filteredComments, setFilteredComments] = useState<Post[]>([]);
    const [user] = useAuthState(auth);
    const router = useRouter();
    const [postData, setPostData] = useState<Post | null>(null);    const postId = router.query.posts;
    console.log("router", router.query);

    //
    //const [postName, setPostName] = useState('');
    //const [classroomName, setClassroomName] = useState('');











    useEffect(() => {
        console.log("getting here postId", postId);


        const fetchPostData = async () => {
            // Ensure postId is a string
            const validPostId = Array.isArray(postId) ? postId[0] : postId;
            console.log("validPostId", validPostId);
    
            if (validPostId) {
                try {



                    const postDocRef = doc(firestore, "posts", validPostId);
                    const postDocSnap = await getDoc(postDocRef);
    
                    if (postDocSnap.exists()) {
                        const data = postDocSnap.data() as Post;;
                        if ('id' in data && 'addedDate' in data /* check other properties as needed */) {
                            setPostData(data as Post);
                          } else {
                            console.error('Post data is missing required properties');
                          }

                        // Process postData as needed
                    } else {
                        console.log("No post found for ID:", validPostId);
                    }
                } catch (error) {
                    console.error("Error fetching post:", error);
                }
            }
        };
    
        fetchPostData();
    }, [postId]);
    

    


    

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
            if (postData) {
                const q = query(postsCollectionRef, where("postId", "==", postData.id));
    
                const querySnapshot = await getDocs(q);
                const comments = querySnapshot.docs.map(doc => ({  ...(doc.data() as Post) }));
                console.log("comments", comments);
                return comments;
            }
            return [];
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
      

        {postData ? (
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
            <CommentsPage filterCondition={{ field: 'postId', operator: '==', value: postData.id }} />
          </Box>
          

          
        ) : (
            <div>Loading...</div>
        )}

          
          

         
        </>
    );
};




export default PostPage;
