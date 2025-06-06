
import { Th, Tr, Td, Text, DetailText, Button } from '@twilio-paste/core'
import { DeleteIcon } from "@twilio-paste/icons/esm/DeleteIcon";
import { EditIcon } from "@twilio-paste/icons/esm/EditIcon";

const UserRecord = (props) => {

    //  handler for user selection to edit/update
    const handleUserEdit = () => {
        props.userSelect(props.user);
    }

    //  handler for user deletion
    const handleDeleteUser = () => {
      props.deleteUser(props.user);
    }

    let layout = (
        <Tr>
          <Td>
                <Button variant="secondary_icon" size="icon_small" aria-label="Delete user" onClick={() => handleDeleteUser()}>
                  <DeleteIcon decorative={false} title="Delete user" />
                </Button>
          </Td>
          <Th scope="row">
              <Text as="span">{props.user.value.firstName} {props.user.value.lastName}</Text>
              <DetailText marginTop='space0'>{props.user.value.identity} ({props.user.value.type})</DetailText>
          </Th>
          <Td>
            <Button variant="secondary_icon" size="icon_small" aria-label="Edit user"  onClick={ () => handleUserEdit()}>
              <EditIcon decorative={false} title="Edit user"/>
            </Button>
          </Td>
        </Tr>
    )
    return layout
}
export default UserRecord;