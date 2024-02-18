import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, setDoc, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { firestore } from "../../firebase/devclientApp";
import { auth } from "../../firebase/devclientApp";
import { useAuthState } from 'react-firebase-hooks/auth';


// Firebase client-side configuration

// Initialize Firebase


function ClassroomComponent() {
  //const [classNames, setClassNames] = useState(['name']);
  const [tenantID, setTenantID] = useState('Freemium');
  const [statusMessages, setStatusMessages] = useState<string[]>([]);
  const [classroomName, setClassroomName] = useState('');
  const [classrooms, setClassrooms] = useState<{name: string, code: string}[]>([]);

  const [user, loading, error] = useAuthState(auth);

  const authorizedEmails = ["cs.sdm2487@gmail.com", "herdsyndicate@gmail.com", "hj171231@gmail.com"];

  useEffect(() => {
    handleCreateClassrooms();
  }, []);


  if (!user || !user.email || !authorizedEmails.includes(user.email)) {
    return <div>You are not a tenant admin</div>; // Message for unauthorized users
  }
  


  // Function to get user data
  async function getUserData(emailList: string[]) {
    const uidList: string[] = []; // Explicitly defining uidList as an array of strings
    const userTokenList: string[] = []; // Similarly for userTokenList, if it's an array of strings
    const userNamesList: string[] = [];



    for (const email of emailList) {
      try {
        // Define a query against the 'users' collection where the 'email' field matches the current email
        const usersColRef = collection(firestore, 'users');
        const q = query(usersColRef, where('email', '==', email));

        // Execute the query and get the result set
        const querySnapshot = await getDocs(q);

        // Loop through the result set and add the uid, userToken, and username to their respective lists
        querySnapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          uidList.push(docSnapshot.id); // Assuming the doc ID is the user's UID
          userTokenList.push(data.userToken); // Replace 'userToken' with the correct field name for user tokens
          userNamesList.push(data.username); // Replace 'username' with the correct field name for user names
        });
      } catch (error) {
        console.error('Error getting user data for email:', email, error);
      }
    }

    return { uidList, userTokenList, userNamesList };
  }


  // Function to generate a six-digit code
  function generateSixDigitCode() {
    const min = 100000; // smallest 6 digit number
    const max = 999999; // largest 6 digit number
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Function to add classroom with ID field
  async function addClassroomWithIdField(userEmails: string[], classroomName: string, jc: string, tenantID: string): Promise<{name: string, code: string} | undefined> {
    // Validate inputs
    console.log("creatign classroom")




    if (!Array.isArray(userEmails) || !classroomName || !jc || !tenantID) {
      console.error("Invalid inputs");
      return;
    }

    let uids, tokens, names;
    try {
      // Get user data
      const { uidList, userTokenList, userNamesList } = await getUserData(userEmails);
      uids = uidList;
      tokens = userTokenList;
      names = userNamesList;
    } catch (error) {
      console.error('Error in getUserData:', error);
      return; // Exit if there's an error in fetching user data
    }

    const classroomData = {
      title: classroomName,
      userEmails: userEmails,
      joinCode: jc.toString(),
      tenantId: tenantID,
      userTokens: tokens,
      users: uids,
      classMemberNames: names
    };

    try {
      // Step 1: Create the classroom document
      const classroomsColRef = collection(firestore, 'classrooms');
      const docRef = await addDoc(classroomsColRef, classroomData);

      // Step 2: Retrieve the auto-generated ID and update the document
      const docId = docRef.id;
      await updateDoc(docRef, { id: docId });

      // Step 3: Create a mapping object
      const mappingRef = doc(firestore, 'classmappings', jc.toString());
      const mappingObject = { classroomID: docId };
      await setDoc(mappingRef, mappingObject);

      console.log("Classroom added with ID:", docId);
      return { name: classroomName, code: jc };
    } catch (error) {
      console.error("Error adding classroom:", error);
    }
  };

  // Function to handle the creation of classrooms
  const handleCreateClassrooms = async () => {
    try {
      const code = generateSixDigitCode();
      const newClassroom = await addClassroomWithIdField([], classroomName, code.toString(), tenantID);
      if (newClassroom) {
        setClassrooms(prev => [...prev, newClassroom]);
        setStatusMessages(prev => [...prev, `${classroomName} created with join code ${code}`]);
      }
    } catch (error) {
      console.error(`Error creating classroom ${classroomName}:`, error);
      setStatusMessages(prev => [...prev, `Error creating classroom ${classroomName}`]);
    }
  };
  

  // Handle change in the input field
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Rest of your change handling logic
};


  // Handle form submission
  // Handle form submission
  /*
const handleSubmit = async (event) => {
  event.preventDefault();
  if (classroomName) {
      const code = generateSixDigitCode();
      
      // Call addClassroomWithIdField to create the classroom
      await addClassroomWithIdField([], classroomName, code, tenantID);

      // Add status message or handle the classroom creation UI update
      setStatusMessages(prev => [...prev, `${classroomName} created with join code ${code}`]);
      setClassroomName(''); // Reset the input field after adding
  }
};
*/

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (classroomName) {
      const code = generateSixDigitCode();
      try {
        const newClassroom = await addClassroomWithIdField([], classroomName, code.toString(), tenantID);
        setClassrooms(prev => newClassroom ? [...prev, newClassroom] : prev);
        setClassroomName('');
      } catch (error) {
        console.error(`Error creating classroom ${classroomName}:`, error);
      }
    }
  };


  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="classroomName">Enter Classroom Name:</label>
        <input
          type="text"
          id="classroomName"
          value={classroomName}
          onChange={handleInputChange}
        />
        <button type="submit">Add Classroom</button>
      </form>

      {classrooms.length > 0 && (
        <div>
          <h3>Take a screenshot or somehting once you refresh this will go away buti can look it up in the backend so not too big of a deal</h3>
          <h3>This is only set up to crfeate freemium tanat classes right now</h3>


          <h3>Created Classrooms:</h3>
          <ul>
            {classrooms.map((classroom, index) => (
              <li key={index}>
                {classroom.name} - Code: {classroom.code}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ClassroomComponent;
