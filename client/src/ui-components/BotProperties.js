import { 
  Stack, Card 
} from '@twilio-paste/core';
import UseCaseCombo from './UseCaseCombo';

const BotProperties = (props) => {
	//	layout for the bot properties
    let layout = (
            <Stack orientation="vertical" spacing="space40">
				<Card padding="space120">
				<UseCaseCombo 
					useCases={props.useCases} 
					selectedUser={props.selectedUser}
					updateUser={props.updateUser}
				/>
			</Card>
    </Stack>
    )
    return layout
}
export default BotProperties;


