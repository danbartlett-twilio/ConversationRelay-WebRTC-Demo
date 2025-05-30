

import { 
  Stack, Card, Heading, Paragraph, Button,
  TabPanels, Tabs,TabList, Tab,TabPanel,  
} from '@twilio-paste/core';
import UseCaseCombo from './UseCaseCombo';

const BotProperties = (props) => {

	//	layout for the bot properties
    let layout = (
            <Stack orientation="vertical" spacing="space40">
						<Card padding="space120">
            <Tabs baseId="voiceClientTabs">
				<TabList aria-label="Horizontal product tabs">
					<Tab>Default Use Case</Tab>
					<Tab>Build an Agent</Tab>
				</TabList>
				<TabPanels>
					<TabPanel>
						<UseCaseCombo 
							useCases={props.useCases} 
							selectedUser={props.selectedUser}
							updateUser={props.updateUser}
						/>
					</TabPanel>
					<TabPanel>
						<Paragraph >We can't wait to see what you'll build.</Paragraph>
					</TabPanel>
				</TabPanels>  
            </Tabs>
			</Card>
    </Stack>
    )
    return layout
}
export default BotProperties;


