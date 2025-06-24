import { useEffect } from "react";
import { useAtom } from "jotai";

import { appPage, appDevice, appCurrentCall } from "../jotaiState/appState"
import { Flex, Box } from "@twilio-paste/core";

import { Theme } from "@twilio-paste/core/dist/theme";

import Main from "./Main";
import Users from "./Users/Users";
import UseCases from './UseCases/UseCases'
import CallHistory from "./CallHistory/CallHistory";
import AppHeader from "./AppHeader";

const styles = {
  wrapper: { width: "100%" },

  headTwoColumnLayout: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "20px",
  },
  headLeftColumn: {
    width: "200px",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
  },
  headRightColumn: {
    flex: 1,
    textAlign: "left",
    color: "#ffffff",
  },
};

const Wrapper = () => {
  const [page, setPage] = useAtom(appPage);
  const [device, setDevice] = useAtom(appDevice);
  const [currentCall, setCurrentCall] = useAtom(appCurrentCall);


  // useEffect to handle device disconnection when page changes
  // This ensures that when the user navigates away from the 'demo' page,
  // the device disconnects from any ongoing calls or connections.
  useEffect(() => {
    if(page !='demo'&& device) {
      device.disconnectAll()
      setCurrentCall(null)

      ;}
  },[page]
)

  // handler to manage page selection
  const showPage = (page) => {
    switch (page) {
      case "demo":
        return <Main />;
      case "users":
        return <Users />;
      case "useCases":
        return <UseCases />;
      case "calls":
        return <CallHistory />;
      default:
        return <Main />;
    }
  };

  // handler to manage page selection
  const handlePageClick = (page) => {
    setPage(page);
  };

  // render component
  let layout = (
    <Theme.Provider theme="Twilio">
      <Flex>
        <Flex grow>
          <Box width="100%">
            <AppHeader currentPage={page} setCurrentPage={handlePageClick} />
            <Box>{showPage(page)}</Box>
          </Box>
        </Flex>
      </Flex>
    </Theme.Provider>
  );
  return layout;
};
export default Wrapper;
