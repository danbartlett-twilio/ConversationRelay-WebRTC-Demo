import { useState, useEffect } from 'react';
import { 
    Card, Box, Input,
    Button, Label, HelpText, Form, FormControl, RadioGroup, Radio, 
 } from '@twilio-paste/core';

import { useUID } from '@twilio-paste/core/uid-library';

const AddUserForm = (props) => {
        const [userType, setUserType] = useState('webRtc');
        const [userRole, setUserRole] = useState('user');       // default role is user
        const [mode, setMode] = useState(props.mode);           // form mode ( add, edit )
        const [firstName, setFirstName] = useState('');
        const [lastName, setLastName] = useState('');
        const [email, setEmail] = useState('');
        const [phone, setPhone] = useState('');
        const [demoPhone, setDemoPhone] = useState('');
        const [sipAddress, setSipAddress] = useState('');
        const [webRtcIdentity, setWebRtcIdentity] = useState('');
        const [crParamsOverride, setCrParamsOverride] = useState('');
        const[typeUpdate, setTypeUpdate] = useState(false);
        const[uiChange, setUiChange] = useState(false);

        //  initialize local state for form and currently selected user
        useEffect(() => {
            if (props.mode === 'edit') {
                setUserType(props.selectedUser?.value.type || 'webRtc');
                setUserRole(props.selectedUser?.value.role || 'user');
                setFirstName(props.selectedUser?.value.firstName || '');
                setLastName(props.selectedUser?.value.lastName || '');
                setEmail(props.selectedUser?.value.email || '');
                setPhone(props.selectedUser?.value.phone || '');
                
                props.selectedUser?.value.type === 'webRtc' ? setWebRtcIdentity(props.selectedUser?.value.identity) : setWebRtcIdentity('');
                props.selectedUser?.value.type === 'phone' ? 
                    setDemoPhone(props.selectedUser?.value.identity ) : setDemoPhone('');
                props.selectedUser?.type === 'sip' ? 
                    setSipAddress(props.selectedUser?.value.identity) : setSipAddress('');

                setCrParamsOverride(props.selectedUser?.value.conversationRelayParamsOverride);
            }
        },[props.selectedUser])

    // use effect to auto-generate the webRTC identity and SIP user parts when adding a new user
    useEffect(() => { 
        if(mode=='add'){
            if(userType === 'webRtc') { setWebRtcIdentity(composeIdentity()) }
            if(userType === 'sip') {
                let domain = process.env.REACT_APP_PV_SIP_DOMAIN
                let sipaddress = `${composeIdentity()}@${domain}`;
                setSipAddress(sipaddress) 
            }
        }
    },[firstName, lastName, typeUpdate])

    //  handler to clear the form - props in Users component
    const handleClearForm = () => { 
        props.clearForm()
        setUiChange(false) 
    }

    // handler to auto-create webRTC and SIP identities based on first and last name
    const composeIdentity = () => { 
        if (firstName === '' || lastName === '') { return '' } else {
            return (firstName[0] + lastName).toLowerCase() 
        } 
    }

    //  handlers to update local state for first name
    const handleFirstNameChange = (e) => { 
        setUiChange(true)
        setFirstName(e.target.value) 
    }

    //  handler to update local state for last name
    const handleLastNameChange = (e) => { 
        setUiChange(true)
        setLastName(e.target.value)
    }

    // handler to update user type
    const handleUserTypeChange = (newValue) => {
        setUserType(newValue);
        setTypeUpdate(!typeUpdate)
    }

    //  handler to update local state for phone
    const handlePhoneChange = (e) => {
        setUiChange(true)
        setPhone(e.target.value);
    }

    // handler to update local state for email
    const handleEmailChange = (e) => {
        setUiChange(true)
        setEmail(e.target.value);
    }

    // handler to update user - pass user object to parent Users component
    const handleUpdateUser = () => {
        const user = {
            identity: userType === 'webRtc' ? webRtcIdentity : (userType === 'sip' ? sipAddress : demoPhone),
            type: userType, // webRtc, sip, phone
            role: userRole,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: phone.trim(),
            email: email.trim(),
            conversationRelayParamsOverride: crParamsOverride
        }
        props.updateUser(user)
    }

    // handler to add a new user - pass user object to parent Users component
    const handleAddUser = () => {
        const user = {
            identity: userType === 'webRtc' ? webRtcIdentity : (userType === 'sip' ? sipAddress : demoPhone),
            type: userType, // webRtc, sip, phone
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            phone: phone.trim(),
            email: email.trim(),
            conversationRelayParamsOverride: crParamsOverride
        }        
        props.createUser(user)
    }

    // content to render
    let layout = (
        <Box padding="space60">
            <Form maxWidth="size70">
                <Card>
                    <FormControl >
                        <Label htmlFor="firstName" required>First name</Label>
                                <Input
                                    type="text"
                                    id={'firstName'}
                                    name="firstName"
                                    value={ firstName}
                                    onChange={(e) => handleFirstNameChange(e)}
                                    placeholder="First name"
                                    required
                                />
                        <HelpText as="div" color="colorTextWeak">
                        Enter your first name 
                        </HelpText>
                        <div style={{marginBottom: '15px'}}></div>
                    </FormControl>
                    <FormControl>
                        <Label htmlFor="lastName" required>Last name</Label>
                                <Input
                                    type="text"
                                    id={'lastName'}
                                    name="lastName"
                                    value={lastName}
                                    onChange={(e) => handleLastNameChange(e)}
                                    placeholder="Last name"
                                    required
                                />
                        <HelpText as="div" color="colorTextWeak">
                        Enter your last name 
                        </HelpText>
                        <div style={{marginBottom: '15px'}}></div>
                    </FormControl>
                    <FormControl>
                        <Label htmlFor="phone" required>Mobile Number (e.164)</Label>
                                <Input
                                    type="text"
                                    id={'phone'}
                                    name="phone"
                                    value={phone}
                                    onChange={(e) => handlePhoneChange(e)}
                                    placeholder="Mobile Number"
                                    required
                                />
                        <HelpText as="div" color="colorTextWeak">
                        Enter your mobile number (e.164 format)
                        </HelpText>
                        <div style={{marginBottom: '15px'}}></div>
                    </FormControl>
                    <FormControl>
                        <Label htmlFor="email" required>Email Address</Label>
                            <Input
                                type="text"
                                id={'email'}
                                name="email"
                                value={email}
                                onChange={(e) => handleEmailChange(e)}
                                placeholder="Email address"
                                required
                            />
                        <HelpText as="div" color="colorTextWeak">
                        Enter your last name 
                        </HelpText>
                        <div style={{marginBottom: '15px'}}></div>
                    </FormControl>

                    <FormControl>
                        <RadioGroup
                        name="uncontrolled-radio-group"
                        legend="Select a User Type"
                        orientation='horizontal'
                        value={userType}
                        onChange={(newValue) => handleUserTypeChange(newValue)}
                        helpText="Choose the type of user for your use case."
                        disabled={props.mode === 'edit' ? true : false}
                        >
                        <Radio
                            id={useUID()}
                            value="webRtc"
                            name="userType"
                            defaultChecked
                        >
                            webRTC
                        </Radio>
                        <Radio
                            id={useUID()}
                            value="sip"
                            name="userType"
                        >
                            SIP
                        </Radio>
                        <Radio
                            id={useUID()}
                            value="phone"
                            name="userType"
                        >
                            Phone Number
                        </Radio>
                        </RadioGroup>                                        
                    </FormControl>

                    <div style={{marginBottom: '15px'}}></div>
                    {/* UserAddress */}
                    { userType === 'webRtc' && (
                    <FormControl>
                        <Label htmlFor="demoPhone" required>Web RTC Identity (auto-created)</Label>
                                <Input
                                    type="text"
                                    id={'demoPhone'}
                                    name="demoPhone"
                                    value={ webRtcIdentity}
                                    readOnly
                                />
                    </FormControl>
                    )}
                    { userType === 'sip' && (
                    <FormControl>
                        <Label htmlFor="demoPhone" required>SIP Address (auto-created)</Label>
                                <Input
                                    type="text"
                                    id={'demoPhone'}
                                    name="demoPhone"
                                    value={ sipAddress }
                                    readOnly
                                />
                    </FormControl>
                    )}

                    { userType === 'phone' && (
                    <FormControl>
                        <Label htmlFor="demoPhone" required>Demo Phone Number</Label>
                                <Input
                                    type="text"
                                    id={'demoPhone'}
                                    name="demoPhone"
                                    value={ demoPhone }
                                    onChange={(e) => setDemoPhone(e.target.value)}
                                    placeholder="Demo phone"
                                    required
                                />
                        <HelpText as="div" color="colorTextWeak">
                        Twilio phone number to use for demo purposes 
                        </HelpText>
                    </FormControl>
                    )}
                    <div style={{marginBottom: '25px'}}></div>
                    <FormControl>
                        <Box as={'div'} marginTop="20px" marginBottom="20px">
                            { uiChange && (
                                <Label><span style={{color:'red'}}>Configuration has changed</span></Label>
                            )}
                        </Box>
                        <div>
                            <div>
                            {
                                mode === 'edit' ?
                                    <Button variant="secondary" type="button" style={{marginLeft: '10px'}} onClick={() => handleClearForm()}>
                                    Clear Form
                                    </Button> : <></>
                            }
                            <span style={{float: 'right'}}>
                                { props.selectedUser  && (
                                <Button
                                    variant={ uiChange ? 'destructive' : 'primary'} 
                                    type="button"
                                    onClick={() => handleUpdateUser()} 
                                    >
                                    Update User
                                </Button>
                                )}

                                { mode === 'add' && (
                                    <Button
                                        variant={ uiChange ? 'destructive' : 'primary'} 
                                        type="button"
                                        onClick={() => handleAddUser() }
                                        >
                                        Add User
                                    </Button>
                                )}
                                </span>
                            </div>
                        </div>
                    </FormControl>
                </Card>
            </Form>
        </Box>
    )
    return layout
}
export default AddUserForm;

