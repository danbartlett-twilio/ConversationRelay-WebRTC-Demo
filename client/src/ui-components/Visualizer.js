
import {useState} from 'react';
import { Box, Card } from '@twilio-paste/core';

const VisualizerComp = () => {

    let layout = (
      <Card padding="space40">
        <Box as="div" style={{backgroundColor: '#ccc', height: '20vh'}} >
          Vizualizer
        </Box>
      </Card>
    )

    return layout
}
export default VisualizerComp;


