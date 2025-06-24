
import { Th, Tr, Td, Text, DetailText, Button } from '@twilio-paste/core'
import { DeleteIcon } from "@twilio-paste/icons/esm/DeleteIcon";
import { EditIcon } from "@twilio-paste/icons/esm/EditIcon";
import { CopyIcon } from "@twilio-paste/icons/esm/CopyIcon";

const UseCaseRecord = (props) => {

    //  handler for user selection to edit/update
    const handleUseCaseEdit = () => {
        props.useCase.value.role === 'system' ? props.isDisabled(true) : props.isDisabled(false);
        props.useCaseSelect(props.useCase);
    }

    //  handler for user deletion
    const handleDeleteUseCase = () => {
      props.deleteUseCase(props.useCase);
    }

    // handler for user copy
    const handleCopyUseCase = () => {
      props.isDisabled(false);
      props.cloneUseCase(props.useCase);
    } 


    let layout = (
        <Tr>
          <Td>
            <Button 
              variant="secondary_icon" 
              size="icon_small" 
              aria-label="View UseCase" 
              onClick={ () => handleUseCaseEdit()}
            >
              <EditIcon decorative={false} title="View UseCase"/>
            </Button>
          </Td>
          <Td>
            <Button 
              variant="secondary_icon" 
              size="icon_small" 
              aria-label="Copy UseCase" 
              onClick={ () => handleCopyUseCase()}
            >
              <CopyIcon decorative={false} title="Copy UseCase"/>
            </Button>
            </Td>
          <Th scope="row">
              <Text 
              as="span"
               color="blue"
              style={{cursor: 'pointer'}} onClick={ () => handleUseCaseEdit()}
              >
                {props.useCase.value.title}
            </Text>
              <DetailText marginTop='space0'>({props.useCase.value.role}-template)</DetailText>
          </Th>

          <Td>
            {
              props.useCase.value.role !=='system'&&(
                <Button variant="secondary_icon" size="icon_small" aria-label="Delete UseCase" onClick={() => handleDeleteUseCase()}>
                  <DeleteIcon decorative={false} title="Delete UseCase" />
                </Button>
              )
            }
          </Td>
        </Tr>
    )
    return layout
}
export default UseCaseRecord;