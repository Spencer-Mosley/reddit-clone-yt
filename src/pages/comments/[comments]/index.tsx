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
    threadId: string;
    threadName: string;
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

const CommentPage: React.FC<CommentPageProps> = ({ commentData }) => {
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
        console.log("use effect getting comment data");
        console.log("commentData", commentData);

        const id = "id-20230410230491";
        console.log("commentData", commentData);
        if (id) {
            //getUser(commentData.createdBy);
        } else {
            // history.push('/admin/comments');
        }

        return () => {
            // Unsubscribe or cleanup logic
        };
    }, []);

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
            const q = query(postsCollectionRef, where("id", "==", "id-20230410230491"));
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
      <Td>{commentData.threadId}</Td>
    </Tr>
    <Tr>
      <Th>Post Name</Th>
      <Td>{commentData.postId}</Td>
    </Tr>
    <Tr>
      <Th>Date Sent</Th>
      <Td>{moment(commentData.dateSent).format('YYYY-MM-DD HH:mm')}</Td>
    </Tr>
  </Tbody>
</Table>
    );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
    try {

       // const commentDocRef = doc(firestore, "comments", context.query.comment as string);
       console.log("contextt", context);
       const commentDocRef = doc(firestore, "comments", context.query.comments as string);
        const commentDocSnap = await getDoc(commentDocRef);


        console.log("Fetching comment with ID:", context.query.comment);

       
       
       
       
       
       
        const commentData = commentDocSnap.data();

        if (!commentData) {
            console.log("No comment found for ID:");
            //return { props: {} };
        }


        console.log("Fetched comment data:", commentData);

        
        
        if (commentData?.timestamp) {
            commentData.timestamp = commentData.timestamp.toMillis();
        }

        return {
            props: {
                commentData: {
                    ...commentData,
                    id: commentDocSnap.id
                }
            }
        };
    } catch (error) {
        console.error("Error in getServerSideProps:", error);
        return { props: {} };
    }
}


export default CommentPage;
