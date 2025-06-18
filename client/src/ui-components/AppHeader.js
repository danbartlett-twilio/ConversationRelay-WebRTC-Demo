import { useState } from "react";
import {
  Box, Heading, Topbar, TopbarActions, Button,
  MenuButton, useMenuState, Menu, MenuItem

 } from "@twilio-paste/core";

import { LogoTwilioIcon } from "@twilio-paste/icons/esm/LogoTwilioIcon";
import { MenuIcon } from "@twilio-paste/icons/esm/MenuIcon";
import { CallActiveIcon } from "@twilio-paste/icons/esm/CallActiveIcon";
import { UsersIcon } from "@twilio-paste/icons/esm/UsersIcon";
import { HistoryIcon } from "@twilio-paste/icons/esm/HistoryIcon";
import { DirectoryIcon } from "@twilio-paste/icons/esm/DirectoryIcon";

const styles = {
    wrapper: { width: '100%',},
  headTwoColumnLayout: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width:'100%',
    padding:'20px'
  },
  headLeftColumn: {
    width: '200px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
  },
  headRightColumn: {
    flex: 1,
    textAlign: 'left',
    color: '#ffffff',
  },
};


const AppHeader = (props) => {
  const menu = useMenuState();

  const handlePageClick = (page) => {
    props.setCurrentPage(page);
    menu.hide()
  }

    let layout = (
      <Box>
        <Topbar id="header">
          <TopbarActions justify="start">
            <Box display="flex" alignItems="center">
              <Box marginRight="space50">
                  <MenuButton {...menu} variant="primary_icon">
                      <MenuIcon decorative={false} size="sizeIcon80" title="AppMenu" />
                  </MenuButton>
                  <Menu {...menu} aria-label="App Menu">
                    <MenuItem {...menu}>
                      <Button 
                        variant={"primary_icon"} 
                        onClick={() => handlePageClick('demo')}
                        disabled={props.currentPage === "demo"}
                        >
                        <CallActiveIcon decorative />
                        Demo
                      </Button>
                    </MenuItem>
                    <MenuItem {...menu}>
                    <Button
                      variant={"primary_icon"}
                      disabled={props.currentPage === "users"}
                      onClick={() => handlePageClick('users')}
                    >
                      <UsersIcon decorative />
                      Users
                    </Button>
                    </MenuItem>
                    <MenuItem {...menu}>
                      <Button
                      variant={"primary_icon"}
                      disabled={props.currentPage === "useCases"}
                      onClick={() => handlePageClick("useCases")}
                    >
                      <DirectoryIcon decorative />
                      UseCases
                    </Button>
                    </MenuItem>
                    <MenuItem {...menu}>
                      <Button
                        variant={"primary_icon"}
                        disabled={props.currentPage === "calls"}
                        onClick={() => handlePageClick("calls")}
                      >
                        <DirectoryIcon decorative />
                        Call History
                      </Button>
                    </MenuItem>
                  </Menu>
              </Box>

              <Box paddingRight="space20">
                <LogoTwilioIcon size={'sizeIcon50'} color="red" decorative={false} title="Description of icon" />
              </Box>
              <Heading
                marginBottom="space0"
                paddingLeft="space30"
                as="h2"
                variant="heading20"
                color={{ color: "#ffffff" }}
              >
                ConversationRelay - WebRTC Demo
              </Heading>
            </Box>
          </TopbarActions>
        </Topbar>
      </Box>

      // TODO: Old Header - Remove
        // <div style={styles.wrapper}>
        // <div style={styles.headTwoColumnLayout} >
        //     <div style={styles.headLeftColumn} >
        //         <img src="/images/twilio_logo.jpg" alt="Twilio Logo" width="100" height="50" /> </div>
        //     <div style={styles.headRightColumn}>                                        
        //         <Heading 
        //             marginBottom='space0'
        //             as="h2" 
        //                 variant="heading8"
        //             color={{color:'#ffffff'}}
        //             >Conversation Relay - Cloud Intelligence
        //         </Heading>
                
        //     </div>
        // </div>
        // </div>
    )
    return layout
}
export default AppHeader;