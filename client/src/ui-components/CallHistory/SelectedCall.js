
import {
    Box, Tabs, TabList, Tab, TabPanels, TabPanel,
    Table, THead, Tr, Th, TBody, Td, Paragraph
} from '@twilio-paste/core';

import {useUID} from '@twilio-paste/core/uid-library'
import MessageLog from './MessageLog';

import "../../styles/MessageLog.css"; // Import the CSS styles


const getTimeDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

const SelectedCall = (props) => {
    const selectedId = useUID();

    let layout = (
    <div className="selected-call">
      {props ? (
        <div width="100%" height="100%">

            <Tabs selectedId={selectedId} baseId="horizontal-tabs-example">
            <TabList aria-label="My tabs">
                <Tab id={selectedId}>Details</Tab>
                <Tab >Transcript</Tab>

            </TabList>
            <TabPanels paddingTop="space20">
                <TabPanel>
                    { props.selectedCall ? (
                    <div>
                        <Box overflowY="auto" height="auto" maxHeight="500px" maxWidth="800px" overflowX="auto" >

                                <Table tableLayout='fixed' variant="default" striped >
                                    <THead  stickyHeader top={0}>
                                        <Tr verticalAlign="middle">
                                        <Th width="size40" textAlign="left">
                                            Metric
                                        </Th>
                                        <Th>Value</Th>
                                        </Tr>
                                    </THead>
                                    <TBody>
                                        <Tr>
                                        <Td>Call Id</Td><Td>{ props.selectedCall?.key }</Td>
                                        </Tr>
                                        <Tr>
                                        <Td>Caller</Td><Td>{props.selectedCall?.value.userContext.firstName} { props.selectedCall?.value.userContext.lastName}</Td>
                                        </Tr>
                                        <Tr>
                                        <Td>Channel</Td><Td>{ props.selectedCall?.value.userContext.from } ({props.selectedCall?.value.userContext.type})</Td>
                                        </Tr>                                        
                                        <Tr>
                                        <Td>Date</Td><Td>{ getTimeDate( props.selectedCall?.value.timeStamp) }</Td>
                                        </Tr>
                                        <Tr><Td></Td><Td></Td></Tr>
                                        <Tr>
                                        
                                        <Td>Use Case</Td>
                                        <Td>{props.selectedCall?.value.userContext.useCase}</Td>
                                        </Tr>
                                        <Tr>
                                        <Td>LLM Model</Td><Td>{props.selectedCall?.value.llmModel}</Td>
                                        </Tr>
                                        <Tr>
                                        <Td>TTS Provider</Td><Td>{props.selectedCall?.value.userContext?.conversationRelayParamsOverride?.ttsProvider}</Td>
                                        </Tr>
                                        <Tr>
                                        <Td>Language</Td><Td>{ props.selectedCall?.value.userContext?.conversationRelayParamsOverride?.language}</Td>
                                        </Tr> 

                                        <Tr>
                                        <Td>Voice</Td><Td>{ props.selectedCall?.value.userContext?.conversationRelayParamsOverride?.voice}</Td>
                                        </Tr>
                                        <Tr>
                                        <Td>Transcription Provider</Td><Td>{ props.selectedCall?.value.userContext?.conversationRelayParamsOverride?.transcriptionProvider}</Td>
                                        </Tr>
                                        <Tr>
                                        <Td>Speech Model</Td><Td>{ props.selectedCall?.value.userContext?.conversationRelayParamsOverride?.speechModel}</Td>
                                        </Tr>                              
                                    </TBody>
                                </Table>
                        </Box>
                    </div>
                    ) : (
                    <div style={{textAlign:'center'}}><Paragraph style={{color:"red"}}>No selected call</Paragraph></div>
                    )}

                </TabPanel>
                <TabPanel>

                    { props.selectedCall ? (
                        <div>
                            <Paragraph>Scroll to see the full transcript.</Paragraph>   
                            <Box border="solid 1px #ccc" borderRadius={'10px'} overflowY="auto" maxHeight={'500px'} maxWidth={'800px'}>
                                { 
                                props.selectedCallChat && (
                                    <MessageLog events={props.selectedCallChat} />
                                )}
                            </Box>
                        </div>

                        ) : (
                            <div style={{textAlign:'center'}}><Paragraph>No selected call</Paragraph></div>
                        
                    )}

                </TabPanel>

            </TabPanels>
            </Tabs>


        </div>
      ) : (
        <p>No call selected.</p>
      )}
    </div>
    )
  return layout

}
export default SelectedCall;