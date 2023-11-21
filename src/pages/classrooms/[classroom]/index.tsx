import React from "react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import {getDoc, doc} from "firebase/firestore";
import {firestore} from "../../../firebase/devclientApp";
import { Classroom } from "../../../atoms/classroomAtom";
import safeJsonStringify from "safe-json-stringify";
import {
    Box, Spinner, Heading, Text, Flex, Table, Thead, Tbody, Tr, Th, Td, Button
  } from '@chakra-ui/react';
  



type ClassroomPageProps = {
    classroomData: Classroom;
};

const ClassroomPage: React.FC<ClassroomPageProps> = ( {classroomData,  isDataLoading, userInfo, allPosts }) => {
    if (!classroomData) {
      return <div>No classroom exists</div>;
    }
  
    return(
        <> 
    <div>Classroom individual Page {classroomData.title}</div>
    <div> link to posts and link to comments</div>
    <div> dispay deactivre button</div>
    <div> maybe display list of admins, number of students, number of posts, number of comments</div>
    <div> list of student emails</div>

    </>

    
    )
    ;

    console.log("classroomData", classroomData);
  };

export async function getServerSideProps(context: GetServerSidePropsContext) {
    try {
        const classroomDocRef = doc(firestore, "classrooms", context.query.classroom as string);
        const classroomDocSnap = await getDoc(classroomDocRef);

        //print this context.query.classroom
        console.log("context.query.classroom", context.query.classroom);

        //log the classroomDocSnap
        console.log("classroomDocSnap", safeJsonStringify(classroomDocSnap));
        //print the classroomDocSnap id
        console.log("classroomDocSnap.id", classroomDocSnap.id);

        //print the classroomDocSnap data title field
        const classroomData2 = classroomDocSnap.data();

        if (classroomData2) {
          console.log("classroomDocSnap.data().title", classroomData2.title);
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