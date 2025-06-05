
import {Box, Heading } from "@twilio-paste/core";

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


const AppHeader = () => {


    let layout = (
        <div style={styles.wrapper}>
        <div style={styles.headTwoColumnLayout} >
            <div style={styles.headLeftColumn} >
                <img src="/images/twilio_logo.jpg" alt="Twilio Logo" width="100" height="50" /> </div>
            <div style={styles.headRightColumn}>                                        
                <Heading 
                    marginBottom='space0'
                    as="h2" 
                        variant="heading8"
                    color={{color:'#ffffff'}}
                    >Conversation Relay - Cloud Intelligence
                </Heading>
                
            </div>
        </div>
        </div>
    )
    return layout
}
export default AppHeader;