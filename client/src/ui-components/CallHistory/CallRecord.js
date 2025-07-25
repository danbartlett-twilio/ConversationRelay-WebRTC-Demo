
import { Th, Tr, Td, Text, DetailText, Button } from '@twilio-paste/core'
import { DeleteIcon } from "@twilio-paste/icons/esm/DeleteIcon";
import { ShowIcon } from "@twilio-paste/icons/esm/ShowIcon";

const getTimeDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString('en-US', { month: 'short', day: "numeric" , hour: "numeric", minute: "numeric"});
}

const CallRecord = (props) => {

    //  handler for user selection to edit/update
    const handleViewCall = () => {
        props.callSelect(props.call);
    }

    //  handler for user deletion
    const handleDeleteCall = () => {
      props.deleteCall(props.call);
    }

    let layout = (
        <Tr>
          <Td>
            <Button variant="secondary_icon" size="icon_small" aria-label="View call"  onClick={ () => handleViewCall()}>
              <ShowIcon decorative={false} title="View call"/>
            </Button>
          </Td>
          <Th scope="row">
              <Text color="blue" style={{cursor: 'pointer'}} as="span" onClick={() => handleViewCall()}>{ getTimeDate( props.call?.value.timeStamp) }</Text>
              <DetailText marginTop='space0'>Use Case: <b>{props.call.value.useCaseTitle}</b></DetailText>
              <DetailText marginTop='space0'>LLM: <b>{props.call.value.llmModel}</b></DetailText>
              <DetailText marginTop='space0'>User: <b>{props.call.value.userContext.firstName} {props.call.value.userContext.lastName}</b></DetailText>
              
              
          </Th>
          <Td>
              <Button variant="secondary_icon" size="icon_small" aria-label="Delete call" onClick={() => handleDeleteCall()}>
                <DeleteIcon decorative={false} title="Delete call" />
              </Button>            
          </Td>
        </Tr>
    )
    return layout
}
export default CallRecord;