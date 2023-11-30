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
} from "firebase/firestore";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";


import React, { useState,  useContext } from 'react';
//import { Link } from 'react-router-dom';

import { firestore } from 'src/firebase/devclientApp';






const Home: NextPage = () => {
  const [users, setUsers] = useState<{ id: string; }[] | null>(null);
  const [classrooms, setClassrooms] = useState<{ id: string; }[] | null>(null);
  const [posts, setPosts] = useState(null);
  const [comments, setComments] = useState(null);
  const [userStatsCounts, setUserStatsCounts] = useState([]);
  const [classesStatsCounts, setClassesStatsCounts] = useState([]);
  const [postsStatsCounts, setPostsStatsCounts] = useState([]);
  const [commentsStatsCounts, setCommentsStatsCounts] = useState([]);
  const [isChartLoaded, setIsChartLoaded] = useState(false);
  const [currentFilterType, setCurrentFilterType] = useState('yearly');
  const [tenantDetail, setTenantDetail] = useState(null);


  const tenantID = "yourTenantId"; // Replace with actual tenant ID



  const fetchUsers = async () => {
    try {
      let q;
      //if (tenantID) {
        //q = query(collection(firestore, "users"), where('tenantId', '==', tenantID));
      //} else {
        q = query(collection(firestore, "users"));
      //}
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
      //if (tenantID) {
        //q = query(collection(firestore, "users"), where('tenantId', '==', tenantID));
      //} else {
        q = query(collection(firestore, "classrooms"));
      //}
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

  useEffect(() => {
    fetchUsers();
    fetchClassrooms();
  }, []); 







  return (
    <>
      <div className="row mb-4 align-items-center">
        <div className="col-6">
          <h1 className="m-0">
            {'commonService.tenantID' && <span>{'tenantDetail?.name'}</span>}
            Dashboard
          </h1>
        </div>
        <div className="col-6 text-end">
          {/* Additional elements if needed */}
        </div>
      </div>

      <div className="row counts-container mb-5">
        {/* User Count Section */}
        <div className="col-md-6 col-lg-3 counts-wrapper cursor-pointer">
            <div className="counts-inner-wrapper">
              <div>
                <p className="number">
                  classes: 123 {/* Hardcoded number for users */}
                  {/* Conditional rendering for loading spinner */}
                </p>
                <p className="desc">USERS : 100+ {users?.length}</p>
              </div>
              {/* SVG or icon here */}
            </div>
        </div>

        {/* Classes Count Section */}
        {/* Similar structure as Users section, with link and hardcoded values */}

        {/* Posts Count Section */}
        {/* Similar structure as above sections, with link and hardcoded values */}

        {/* Comments Count Section */}
        {/* Similar structure as above sections, with link and hardcoded values */}
      </div>

      <div className="row">
        <div className="col-md-12 mb-3">
          <div className="card">
            <div className="card-header fw-bolder fs-6 d-flex align-items-center justify-content-between">
              <h3 className="m-0">Statistics</h3>
              <div>
                {/* Buttons for filter options */}
               
                {/* ... other buttons for 'weekly', 'monthly', 'yearly' */}
              </div>
            </div>

            <div className="card-body">
              {/* User Stats Section */}
              <div className="row align-items-center">
                <div className="col-md-2">Users</div>
                <div className="col-md-9">
                  <div className="progress" style={{ height: "10px" }}>
                    
                  </div>
                </div>
                <div className="col-md-1 text-center">50 {/* Hardcoded totalCount */}</div>
              </div>
              {/* Similar structure for Classes, Posts, Comments sections */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
