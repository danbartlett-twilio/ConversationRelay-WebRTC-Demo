import { useState, useEffect } from 'react';
import { 
    Card, Box, Input, TextArea, Heading,
    Button, Label, HelpText, Form, FormControl, 
 } from '@twilio-paste/core';

import UseCaseCombo from './UseCaseCombo';

import { v4 as uuidv4 } from 'uuid';

const AddUseCaseForm = (props) => {


        const [mode, setMode] = useState(props.mode);           // form mode ( edit, clone )
        const [title, setTitle] = useState('');
        const [description, setDescription] = useState('');
        const [welcomeGreeting, setWelcomeGreeting] = useState('');
        const [prompt, setPrompt] = useState('');


        const [selectedSttProvider, setSelectedSttProvider] = useState(null);
        const [selectedTtsProvider, setSelectedTtsProvider] = useState(null);
        const [selectedVoice, setSelectedVoice] = useState(null);
        const [speechModel, setSpeechModel] = useState(null);
        
        const [crParamsOverride, setCrParamsOverride] = useState('');
        const[typeUpdate, setTypeUpdate] = useState(false);
        const[uiChange, setUiChange] = useState(false);

        //  initialize local state for form and currently selected user
        useEffect(() => {
            // if (props.mode === 'edit') {
                setTitle(props.selectedUseCase?.value.title || '')
                setDescription(props.selectedUseCase?.value.description || '');
                setWelcomeGreeting(props.selectedUseCase?.value.conversationRelayParams?.welcomeGreeting || '')
                setPrompt(JSON.parse(props.selectedUseCase?.value.prompt) || '');

                setSelectedSttProvider(props.selectedUseCase?.value.conversationRelayParams?.transcriptionProvider || null);
                setSelectedTtsProvider(props.selectedUseCase?.value.conversationRelayParams?.ttsProvider || null);
                setSelectedVoice(props.selectedUseCase?.value.conversationRelayParams?.voice || null);

                if(props.selectedUseCase?.value.conversationRelayParams?.transcriptionProvider==='Google'){
                    setSpeechModel('telephony')
                } else { setSpeechModel('nova-2-general')}

                setCrParamsOverride(props.selectedUseCase?.value.conversationRelayParams);
            // }
        },[props.selectedUseCase])

    //  handler to clear the form - props in Users component
    const handleClearForm = () => { 
        props.clearForm()
        setUiChange(false) 
    }

    //  handlers to update local state for first name
    const handleTitleChange = (e) => { 
        setUiChange(true)
        setTitle(e.target.value) 
    }

    //  handler to update local state for last name
    const handleDescriptionChange = (e) => { 
        setUiChange(true)
        setDescription(e.target.value)
    }

    const handleWelcomeGreetingChange = (e) => { 
    setUiChange(true)
    setWelcomeGreeting(e.target.value)
    }

    const handlePromptChange = (e) => {
        setUiChange(true)
        setPrompt(e.target.value)
    }


    // handler to update local state for email
    const handleUiChange = (value) => {
        setUiChange(value)
    }

    const handlePropertyChange = (property, value) => {
        setUiChange(true)
        console.log('handlePropertyChange', property, value)
        switch (property) {
            case 'sttProvider':
                setSelectedSttProvider(value);
                break;
            case 'ttsProvider':
                setSelectedTtsProvider(value);
                break;
            case 'voice':
                setSelectedVoice(value);
                break;
            case 'speechModel':
                setSpeechModel(value);
                break;
            default:
                console.warn(`Unknown property: ${property}`);
        }
    }

    // handler to update user - pass user object to parent Users component
    const handleUpdateUseCase = () => {

        let role = ''
        let key = ''
        if(props.mode==='edit') { 
            key = props.selectedUseCase.key;
            role = props.selectedUseCase.value.role;
        } else {
            key = uuidv4()
            role = 'user' 
        }
        const useCase = {
            mode: props.mode,
            key: key,
            value: {
                name: title.trim().toLowerCase(),
                title: title.trim(),
                description: description.trim(),
                role: role,
                prompt: JSON.stringify(prompt.trim()),
                tools: props.selectedUseCase.value.tools,
                dtmf: props.selectedUseCase.value.dtmf,
                conversationRelayParams: {
                    dtmfDetection: true,
                    interruptByDtmf: true,
                    interruptible: true,
                    ttsProvider: selectedTtsProvider,
                    voice: selectedVoice,
                    speechModel: speechModel,
                    transcriptionProvider: selectedSttProvider,
                    welcomeGreeting: welcomeGreeting,
                }
            }
        }
        console.log('useCase', useCase)
        props.updateUseCase(useCase)
        setUiChange(false)
    }


    // content to render
    let layout = (
        <Box padding="space60">
            <Form padding="space60" >
                <Card width="100%">
                    <Heading as="h2" htmlFor="title" marginBottom="space100">
                        { (props.mode === 'edit')? ' Edit/View existing use case': ' Cloning system use case'}
                    </Heading>
                    <FormControl >
                        <Label htmlFor="title" required>Title of Use Case</Label>
                                <Input
                                    type="text"
                                    id={'title'}
                                    name="title"
                                    value={title}
                                    disabled={props.disabled}
                                    onChange={(e) => handleTitleChange(e)}
                                    placeholder="Title of use case"
                                    required
                                />
                        <HelpText as="div" color="colorTextWeak">
                        A brief title for the use case 
                        </HelpText>
                        <div style={{marginBottom: '15px'}}></div>
                    </FormControl>
                    <FormControl>
                        <Label htmlFor="email" required>Use Case Description</Label>
                        <TextArea 
                            onChange={(e)=>{handleDescriptionChange(e)}} 
                            aria-describedby="message_help_text" 
                            id="description" 
                            name="description"
                            value={description}
                            disabled={props.disabled}
                            resize="vertical"
                            required />

                        <HelpText as="div" color="colorTextWeak">
                        A brief description of the use case 
                        </HelpText>
                        <div style={{marginBottom: '15px'}}></div>
                    </FormControl>  

                    <FormControl >
                        <Label htmlFor="welcomeGreeting" required>Welcome Greeting</Label>
                                <Input
                                    type="text"
                                    id={'welcomeGreeting'}
                                    name="welcomeGreeting"
                                    value={ welcomeGreeting}
                                    disabled={props.disabled}
                                    onChange={(e) => handleWelcomeGreetingChange(e)}
                                    placeholder="Simple greeting for the use case"
                                    required
                                />
                        <HelpText as="div" color="colorTextWeak">
                        A brief title for the use case 
                        </HelpText>
                        <div style={{marginBottom: '15px'}}></div>
                    </FormControl>  



                    <FormControl>
                        <Label htmlFor="email" required>Ai Prompt</Label>
                        <TextArea 
                            onChange={(e)=>{handlePromptChange(e)}} 
                            aria-describedby="message_help_text" 
                            id="prompt" 
                            name="prompt" 
                            resize="vertical"
                            value={prompt}
                            disabled={props.disabled}
                            required />

                        <HelpText as="div" color="colorTextWeak">
                        Descriptive prompting for your AI use case 
                        </HelpText>
                        <div style={{marginBottom: '15px'}}></div>
                    </FormControl>

                    <UseCaseCombo 
                        disabled={props.disabled}
                        uiChange={handleUiChange} 
                        selectedUseCase={props.selectedUseCase}
                        propertyChange={handlePropertyChange} 
                        />

                    <div style={{marginBottom: '25px'}}></div>
                    <FormControl>
                        <Box as={'div'} marginTop="20px" marginBottom="20px">
                            { uiChange && (
                                <Label><span style={{color:'red'}}>Configuration has changed</span></Label>
                            )}
                        </Box>
                        <div>
                            <div>
                            

                                    <div>
                                        <Button variant="secondary" type="button" style={{marginLeft: '10px'}} onClick={() => handleClearForm()}>
                                        Clear Form
                                        </Button> 
                                        <span style={{float: "right"}}>
                                            <Button
                                            disabled={!uiChange}
                                            variant={uiChange ? "destructive" : "primary"}
                                            onClick={(e) => handleUpdateUseCase(e)}
                                            >
                                            Save Configuration
                                            </Button>
                                        </span>
                                    </div>
                            
                            </div>
                        </div>
                    </FormControl>
                </Card>
            </Form>
        </Box>
    )
    return layout
}
export default AddUseCaseForm;

