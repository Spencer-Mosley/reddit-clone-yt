import React, { ReactNode } from 'react';
import Navbar from '../Navbar/Navbar';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";



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
              <Tab>Dashbaord</Tab>
              <Tab>Users</Tab>
              <Tab>Classes</Tab>
              <Tab>Posts</Tab>
              <Tab>Comments</Tab>
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