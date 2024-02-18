import Layout from "../components/Layout.tsx/Layout";
import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { theme } from "../chakra/theme";
import { RecoilRoot } from "recoil";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/devclientApp'; // Adjust this import to the actual path
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  doc,
  getDoc
} from "firebase/firestore";
import { firestore } from '../firebase/devclientApp';



function MyApp({ Component, pageProps }: AppProps) {
  const [user, loading, error] = useAuthState(auth);
  const router = useRouter();



  interface TenantAdminData {
    id: string;
    tenants: string[]; // Adjust the type according to your data structure
    // ... any other properties of tenantAdminData
  }
  




  const [tenant, setTenant] = useState<string | undefined>(undefined);



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
      } else {
        console.log('No matching tenant admin document found');
        console.log('return a ui pop up that this user is not a tenant admin');
      }
    } catch (error) {
      console.error('Error fetching tenant admin data:', error);
    }
  };


  useEffect(() => {
    // Add condition based on whether tenant is an array or a single value
    const shouldRedirect = !loading && !user && router.pathname !== '/login' || 
                           !loading && tenant?.length === 0; // If tenant is an array
    // or
    // const shouldRedirect = !loading && !user && router.pathname !== '/login' || 
    //                         !loading && !tenant; // If tenant is a single value
  
    if (shouldRedirect) {
      router.push('/login');
    }
  }, [user, loading, router, tenant]);
  



  if (loading) {
    return <div>Loading...</div>; // Or your loading component/spinner
  }

  



  // Determine if the current page is the login page
  const isLoginPage = router.pathname === '/login';

  return (
    <RecoilRoot>
      <ChakraProvider theme={theme}>
        {/* Only wrap with Layout if the user is logged in and it's not the login page */}
        {!user || isLoginPage ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </ChakraProvider>
    </RecoilRoot>
  );
}

export default MyApp;
