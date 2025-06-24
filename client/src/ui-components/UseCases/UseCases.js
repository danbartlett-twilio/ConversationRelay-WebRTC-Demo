
import { useState, useEffect } from 'react';
import axios from "axios";
import { 
    Grid, Column, Alert, Tooltip, Heading, Text, DetailText,
    Card, Box, Input, AlertDialog,
    Button, Table, THead, TBody, Tr, Th, Label,Paragraph,
    useSideModalState
 } from '@twilio-paste/core';

import { SearchIcon } from "@twilio-paste/icons/esm/SearchIcon";

import AddUseCaseForm from './AddUseCaseForm'
import UseCaseRecord from './UseCaseRecord';

import { updateUseCaseHelper, deleteUseCaseHelper } from '../../helpers/clientDataHelper';

const UseCases = () => {
    const [search, setSearch] = useState('');
    const [useCases, setUseCases] = useState([]);
    const [filteredUseCases, setFilteredUseCases] = useState([]);
    const [selectedUseCase, setSelectedUseCase] = useState(null);
    const [mode, setMode] = useState(''); // 'edit', 'clone'
    const [disabled, setDisabled] = useState(false);
    const [reload, setReload] = useState(false);

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteUseCase, setDeleteUseCase] = useState(null);

    // Alert state alert state for updating current user configuration
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("neutral");


    const dialog = useSideModalState({});
    

    // Fetch all users from the backend when the component mounts or reload state changes
    useEffect(() => {
        //   get all users from the backend
        const fetchUseCases = async () => {
            const useCaseURL = process.env.REACT_APP_GET_ALL_USE_CASE_URL;
            try {
                const response = await axios.get(useCaseURL);
                setUseCases(response.data);
                setFilteredUseCases(response.data);
            } catch (error) {
                console.error("Error fetching users: ", error);
            }
        }
        fetchUseCases();   
    },[reload])

    // alert timeout effect to hide alert after 5 seconds
    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);
            }, 5000); // Hide alert after 5 seconds
            return () => clearTimeout(timer);
        }
    },[showAlert])


    // handler to clear search input and reset filtered users
    const clearSearch = () => {
        setSearch('');
        setFilteredUseCases(useCases);
    }

    // handler to filter users based on search input
    const handleSearchChange = (event) => {
        setSearch( event.target.value.toLowerCase())
        setFilteredUseCases(Object.values(useCases).filter(uCase => uCase.value.title.toLowerCase().includes(event.target.value.toLowerCase())))
    }

    // handler to select a user from the list and display their details
    const handleUseCaseSelect = (uCase) => { 
        setMode('edit')
        setSelectedUseCase(uCase)
    }

    // handler to clone a user from the list and display their details
    const handleUseCaseClone = (uCase) => {
        setMode('clone')
        setSelectedUseCase(uCase)
    }

    // handler to clear user detail form
    const clearSelectedUseCase = () => { 
        setSelectedUseCase(null)
        setMode('');
        setDisabled(false);
    }

    // handler to refresh the user list
    const handleRefresh = () => { 
        setSelectedUseCase(null);
        setReload(!reload) 
        setAlertMessage('User list reloaded');
        setAlertType("neutral")
        setShowAlert(true)
    }

    // handler to update a selected user from the list
    const updateUseCase = async (useCaseAttributes) => {
        console.log('updateUseCase', useCaseAttributes)
        let resp = await updateUseCaseHelper(useCaseAttributes);
        if(resp.status==='success'){
            setAlertMessage('Use Case configuration was successfully updated');
            setAlertType("neutral")
            setShowAlert(true)
        } else {
            setAlertMessage('An error has occurred updating this use case.');
            setAlertType("error")
            setShowAlert(true)
        }
        setSelectedUseCase(null);
        setMode('');
        setDisabled(false);
        setReload(!reload);
    }

    // handler to display the delete user dialog
    const dialogDeleteUseCase = (useCase) => { 
        console.log('dialogDeleteUseCase', useCase)
        setShowDeleteDialog(true)
        setDeleteUseCase(useCase);
    }

    // handler to set the disabled state for the AddUseCaseForm form
    const handleDisabled = (value) => {
        setDisabled(value);
    }

    // handler to delete a user from the list
    const handleUseCaseDelete = async () => {
        console.log('handleUseCaseDelete', deleteUseCase)
     const key = {key: deleteUseCase.key}
     console.log('key', key)
    //  Call server API to create the user
    let resp = await deleteUseCaseHelper(key);

    if(resp.status==='success'){
        setAlertMessage('Use case configuration was successfully deleted');
        setAlertType("neutral")
        setShowAlert(true)
    } else {
        setAlertMessage('An error has occurred deleting this use case.');
        setAlertType("error")
        setShowAlert(true)
    }
    setShowDeleteDialog(false);
    setDeleteUseCase(null);
    setSelectedUseCase(null);
    setMode('');
    setDisabled(false)
    setReload(!reload);
    dialog.hide()
    }

    // Render the users page
    let layout =  (
        <div style={{margin: '20px'}}>
            <Box style={{marginTop:10, }} height="100vh">
                <Grid gutter="space40">
                    <Column span={[12, 12, 12]}>
                        <div style={{marginBottom: '10px'}}>
                        {/* Display application alerts */}
                        { showAlert && (
                            <Alert
                                variant={alertType}
                                onDismiss={() => setShowAlert(false)}
                                marginBottom="space40"
                            >
                                {alertMessage}
                            </Alert>
                        )}
                        </div>
                    </Column>
                    <Column span={[12, 12, 4]}>
                        <Card padding="space100">
                            <Heading as="h3" variant="heading30" marginBottom="space40">Application UseCases</Heading>
                            <Paragraph marginBottom="space40">Manage use cases for your application. Custom Use cases can be added, updated, and deleted. </Paragraph>
                            <Paragraph marginBottom="space40">"System-Templates" can be "cloned" to create a quick use case.</Paragraph>
                            <Paragraph marginBottom="space100">"User-Templates" can be edited or "cloned" to modify or create a use case.</Paragraph>
                            
                            <Box overflowY="auto" height="auto" maxHeight="500px">
                                <Box style={{marginBottom: '20px'}} padding="space20">
                                    <Label htmlFor="search">Filter</Label>
                                    <Input 
                                        aria-describedby="search" 
                                        id="search" 
                                        name="search" 
                                        type="text"
                                        value={search} 
                                        insertAfter={
                                            <Tooltip text="Clear Search" placement="top">
                                            <Button variant="link" onClick={clearSearch}>
                                                <SearchIcon decorative={false} size="sizeIcon20" title="Get more info" onClick={clearSearch}/>
                                            </Button>
                                            </Tooltip>
                                            }
                                        onChange={(e)=>{handleSearchChange(e)}}
                                    />
                                </Box>
                                <Table  >
                                    <THead stickyHeader top={0}>
                                        <Tr>
                                            <Th>Edit</Th>
                                            <Th>Clone</Th>
                                            <Th>User</Th>
                                            <Th>Delete</Th>
                                        </Tr>
                                    </THead>
                                    <TBody>
                                        {
                                            Object.values(filteredUseCases).map((uCase, index) => (
                                                // Object.values(filteredUseCases).filter(uCase => uCase.value.role === 'user').map((uCase, index) => (
                                                <UseCaseRecord 
                                                    key={index} 
                                                    useCase={uCase} 
                                                    deleteUseCase={dialogDeleteUseCase} 
                                                    useCaseSelect={handleUseCaseSelect}
                                                    cloneUseCase = {handleUseCaseClone}
                                                    isDisabled={handleDisabled}
                                                    />
                                            ))
                                        }
                                    </TBody>
                                </Table>

                            </Box>
                                <Box as="div" style={{marginLeft: '10px', marginRight:'10px', marginTop:'20px'}}  >
                                    <Button variant="secondary" size="small" onClick={()=> handleRefresh()} fullWidth>Refresh</Button>
                                </Box>


                        </Card>
                    </Column>
                    <Column span={[12, 12, 8]}>
                        <Card padding="space100">
                            <Heading as="h3" variant="heading30" marginBottom="space40">UseCase Details</Heading>
                            <Paragraph marginBottom="space40">Update a selected UseCase's details.</Paragraph> 

                            { selectedUseCase ? 
                            <AddUseCaseForm 
                                mode={mode}
                                disabled={disabled} 
                                selectedUseCase={selectedUseCase} 
                                updateUseCase={updateUseCase} 
                                clearForm={clearSelectedUseCase} />
                            : 
                                <div style={{ marginTop: '100px', textAlign: "center" }}>
                                    <Paragraph><span style={{color: 'red'}}>No selected use case</span></Paragraph>
                                </div>
                            }                       
                        </Card>
                    </Column>

                </Grid>

                {/* Alert visualization for user deletion */}
                <AlertDialog
                    heading="Delete Use Case"
                    isOpen={showDeleteDialog}
                    onConfirm={handleUseCaseDelete}
                    onConfirmLabel="Delete"
                    onDismiss={() => setShowDeleteDialog(false)}
                    onDismissLabel="Cancel"
                >
                    <Paragraph>Are you sure you want to delete this useCase?</Paragraph>
                    <Text>Name: {deleteUseCase?.value.title}</Text>

                </AlertDialog>
            </Box>
        </div>
    )
    return layout
}
export default UseCases;