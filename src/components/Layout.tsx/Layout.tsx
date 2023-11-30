import React, { ReactNode } from 'react';
import Navbar from '../Navbar/Navbar';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";


import { useNavigate } from 'react-router-dom';
import Link from 'next/link';




interface LayoutProps {
  children: ReactNode;
}

const Layout : React.FC<LayoutProps> = ({ children }) => {


    return (
        <>
        <Navbar />
        <Box display="flex">
          <Tabs orientation="vertical" variant="soft-rounded" colorScheme="green">
            <TabList>
            <Tab><Link href="/">Dashboard</Link></Tab>
              <Tab><Link href="/users">Users</Link></Tab>
              <Tab><Link href="/classrooms">Classes</Link></Tab>
              <Tab><Link href="/posts">Posts</Link></Tab>
              <Tab><Link href="/comments">Comments</Link></Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {/* Content for Option 1 */}
              </TabPanel>
              <TabPanel>
                {/* Content for Option 2 */}
              </TabPanel>
              <TabPanel>
                {/* Content for Option 3 */}
              </TabPanel>
              <TabPanel>
                {/* Content for Option 4 */}
              </TabPanel>
              <TabPanel>
                {/* Content for Option 5 */}
              </TabPanel>
            </TabPanels>
          </Tabs>
          <main>{children}</main>
        </Box>
        <Box as="footer" mt={5} textAlign="center">
          <Text>Need Help?</Text>
          <Text>Contact: 713-295-1188</Text>
          <Text>or</Text>
          <Text>herdsyndicate@gmail.com</Text>
        </Box>
        </>
    );
};

export default Layout;