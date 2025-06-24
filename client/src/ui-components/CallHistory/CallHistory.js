import {
    Grid, Column, Card
} from '@twilio-paste/core'

import CallList from './CallList'

const CallHistory = () => {
    let layout =  (
        <div  style={{margin: '20px'}}>
            <Grid gutter="space100">
                <Column span={12}>
                    <CallList />
                </Column>
            </Grid>
        </div>
    )
    return layout
}
export default CallHistory;