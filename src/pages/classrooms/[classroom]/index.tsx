import React, { useState, useEffect  } from "react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import {getDoc, doc, collection, getDocs, query, where} from "firebase/firestore";
import {firestore} from "../../../firebase/devclientApp";
import { Classroom } from "../../../atoms/classroomAtom";
import safeJsonStringify from "safe-json-stringify";
import {
    Box, Spinner, Heading, Text, Flex, Table, Thead, Tbody, Tr, Th, Td, Button
  } from '@chakra-ui/react';
  import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
  } from '@chakra-ui/react';

  import moment from 'moment';




  
  
  

  type UserInfo = {
    id?: string; // Include 'id' as an optional property
    tenantId: string;
    title?: string;
    users: any[]; // Define the correct type for 'users'
    addedByEmail: string;
    addedBy: string;
    createdAt: string;
    updatedAt: string;
    // ... any other properties you expect
  };

  type Post = {
    id: string;
    title?: string; // Optional title
    addedDate: number;
    classroomId: string;
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

  


type ClassroomPageProps = {
    classroomData: Classroom;
};

//const ClassroomPage: React.FC<ClassroomPageProps> = ( {classroomData, match, history }) => {
    const ClassroomPage: React.FC<ClassroomPageProps> = ( {classroomData }) => {


    const [isModalOpen, setIsModalOpen] = useState(false);

    const [selectedInfo, setSelectedInfo] = useState(null);
const [modalConfirmationType, setModalConfirmationType] = useState('');
const [modalConfirmationText, setModalConfirmationText] = useState('');
const [allPosts, setAllPosts] = useState<Post[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [isDataLoading, setIsDataLoading] = useState(false);
// ... other states
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
    console.log("use effect");
    const id = classroomData.createdBy;
    console.log("classroomData", classroomData);
    //replace with cladssroom id but ill hard code it for now

    if (id) {
      //getUser(classroomData.createdBy);
    } else {
      //history.push('/admin/classes');
    }
  
    // Cleanup function
    return () => {
      // Unsubscribe or cleanup logic
    };
  //}, [match.params.id, history]);
}, []);


useEffect(() => {
    // Replace this with your actual data fetching logic
    console.log("use effect 2");
    const fetchPosts = async () => {
      const fetchedPosts = await getPosts(); // Assume getPosts() fetches your data
      setAllPosts(fetchedPosts);
    };
  
    fetchPosts();
  }, []);



  const getPosts = async () => {
    try {
      const postsCollectionRef = collection(firestore, 'posts');
      const q = query(postsCollectionRef, where("threadId", "==", classroomData.id));

      const querySnapshot = await getDocs(q);
     // const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Post) }));      
      console.log("posts", posts);
      return posts;
    } catch (error) {
      console.error("Error fetching posts:", error);
      return [];
    }
  };

  


  const applyFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filterValue = event.target.value.toLowerCase();
  
    const filteredData = allPosts.filter(post =>
        post.title && post.title.toLowerCase().includes(filterValue) // Adjust this line based on how you want to filter
    );
  
    //setFilteredPosts(filteredData);
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
        ...docSnap.data() as UserInfo, // Cast the data to UserInfo type
        id: docSnap.id, // Add the id property
      });
    } else {
      console.log("No such document!");
      // Handle the case where the document doesn't exist
    }
  } catch (error) {
    console.error("Error getting document:", error);
    // Handle errors
  } finally {
    setIsDataLoading(false);
  }
};
  

//const applyFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
  //  const filterValue = event.target.value;
    // Filter logic
  //};
  
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


    if (!classroomData) {
      return <div>No classroom exists</div>;
    }
  
    return(
        <>  
                {/*isDataLoading && (
            <Flex justify="center" align="center" h="100px">
              <Spinner color="gray.800" size="xl" />
            </Flex>
        )*/}


{/*{!isDataLoading && ( 
    add this back in when the is loading logic is done
    */}

<div>Classroom Title is:  {classroomData.title}</div>



<Flex mb="4" align="center">
      <Box flex="1">
        <Heading as="h1" size="lg">{userInfo?.title}</Heading>
      </Box>
    </Flex>

     {/* Counts Container */}
     <Flex direction="row" mb="5">
      {/* User Count */}
      <Box flex="1" p="4" borderWidth="1px" borderRadius="lg">
        <Text fontSize="2xl">{userInfo?.users?.length || 0}</Text>
        <Text>USERS</Text>
      </Box>

      {/* Posts Count */}
      <Box flex="1" p="4" borderWidth="1px" borderRadius="lg">
        <Text fontSize="2xl">{allPosts?.length || 0}</Text>
        <Text>POSTS</Text>
      </Box>
    </Flex>


    

  {/* Personal Details */}
  <Box borderWidth="1px" borderRadius="lg" overflowX="auto">
    <Table variant="simple">
      <Tbody>
        <Tr>
          <Td>Added By</Td>
          <Td>:</Td>
          <Td>{classroomData.createdBy}</Td>
        </Tr>
        <Tr>
          <Td>Date Added</Td>
          <Td>:</Td>
          <Td>{}</Td>
        </Tr>
        {/* More rows */}
      </Tbody>
    </Table>
  </Box>

{/* Posts Table */}
<Box borderWidth="1px" borderRadius="lg" overflowX="auto">
  <Table variant="simple">
    <Thead>
      <Tr>
        <Th>Post Name</Th>
        <Th>Added By</Th>
        <Th>Date Added</Th>
        <Th>Actions</Th>
        {/* More headers if needed */}
      </Tr>
    </Thead>
    <Tbody>
      {allPosts.map(post => (
        <Tr key={post.id}>
          <Td>{post.postName}</Td>
          <Td>{post.postAddedByName}</Td>
          <Td>{post.dateAdded}</Td>
          <Td>
            {/* Actions like edit or delete */}
          </Td>
          {/* More columns if needed */}
        </Tr>
      ))}
    </Tbody>
  </Table>
</Box>

<Modal isOpen={isModalOpen} onClose={onModalClose}>
  <ModalOverlay />
  <ModalContent>
    <ModalHeader>Confirmation</ModalHeader>
    <ModalCloseButton />
    <ModalBody>
      <Text>{modalConfirmationText}</Text>
    </ModalBody>
    <ModalFooter>
      <Button colorScheme="blue" mr={3} onClick={onModalClose}>
        Close
      </Button>
      <Button variant="ghost">Secondary Action</Button>
    </ModalFooter>
  </ModalContent>
</Modal>











        
        <input
  type="text"
  placeholder="Search posts"
  onChange={applyFilter}
/>
      
    <div> dispay deactivre button</div>
    <div> maybe display list of admins, number of students, number of posts, number of comments</div>
    <div> list of student emails</div>
        </>
    );

  };

  
export async function getServerSideProps(context: GetServerSidePropsContext) {
    try {
        const classroomDocRef = doc(firestore, "threads", context.query.classroom as string);
        const classroomDocSnap = await getDoc(classroomDocRef);

        //print this context.query.classroom
        console.log("context.query.classroom", context.query.classroom);

        //log the classroomDocSnap
        //console.log("classroomDocSnap", safeJsonStringify(classroomDocSnap));
        //print the classroomDocSnap id
        console.log("classroomDocSnap.id", classroomDocSnap.id);

        //print the classroomDocSnap data title field
        const classroomData2 = classroomDocSnap.data();

        if (classroomData2) {
          console.log("classroomDocSnap.data().title", classroomData2.title);
          console.log("classroomDocSnap.data(). created by ", classroomData2.createdBy
          );


        } else {
          console.log("classroomDocSnap.data() is undefined");
        }
        if (!classroomDocSnap.exists()) {
            // Handle the case where the document does not exist
            return {
                props: {}
            }
        }

        const classroomData = classroomDocSnap.data();

        if (!classroomData) {
            // Handle the case where the document data is undefined
            return {
                props: {}
            }
        }

        return {
            props: {
                classroomData: {
                    ...classroomData,
                    id: classroomDocSnap.id // Add the document id to the data
                }
            }
        }
    } catch (error) {
        console.log("error server side props", error);
        return {
            props: {}

        }
    }
    
}


export default ClassroomPage;