
import { useState, useEffect } from 'react';
import axios from "axios";
import { 
    Grid, Column, Alert, Tooltip, Heading, Text, DetailText,
     Card, Box, Input, AlertDialog,
    Button, Table, THead, TBody, Tr, Th, Label,
    SideModalContainer, SideModal, SideModalHeader, SideModalHeading, SideModalBody, Paragraph,
    useSideModalState
 } from '@twilio-paste/core';

import { SearchIcon } from "@twilio-paste/icons/esm/SearchIcon";

import AddUserForm from './AddUserForm';
import UserRecord from './UserRecord';

import { updateUserHelper, createUserHelper, deleteUserHelper } from '../../helpers/clientDataHelper';

//  DEV only - locally set users
// const usersData = [
//     { "key": 'Alice', "value" : { role: "system", firstName: "Alice", lastName:"Jones", type:'webRtc', identity: 'ajones', phone: '+13035551111', email: 'test'}} ,
//      { "key" : 'Bob', "value" : { role: "user", firstName: "Bob", lastName:"Jones", type:'webRtc', identity: 'bjones', phone: '+13035552222', email: 'test'}} ,
//      { "key" :'Charlie', "value": { role: "system", firstName: "Charlie", lastName:"Avila", type:'sip', identity: 'sip:cavila@domain.com', phone: '+13035553333',email: 'test'}} ,
//      { "key" :'David', "value": { role: "user", firstName: "David", lastName:"James", type:'phone', identity: '+13035551212', phone: '+13035554444', email: 'test'}} ,
//      { "key" :'Eve', "value": { role: "user", firstName: "Eve", lastName:"Smith", type:'sip', identity: 'sip:esmith@domain.com', phone: '+13035555555', email: 'test'}}
//     ]


const Users = () => {
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [reload, setReload] = useState(false);

    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteUser, setDeleteUser] = useState(null);

    // Alert state alert state for updating current user configuration
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("neutral");


    // State for the side modal dialog
    const dialog = useSideModalState({})


    // Fetch all users from the backend when the component mounts or reload state changes
    useEffect(() => {
        //   get all users from the backend
        const fetchUsers = async () => {
            const usersURL = process.env.REACT_APP_GET_ALL_USERS_URL;
            try {
                const response = await axios.get(usersURL);
                setUsers(response.data);
                setFilteredUsers(response.data);
            } catch (error) {
                console.error("Error fetching users: ", error);
            }
        }
        fetchUsers();   
    },[reload])

    //  DEV only - locally set users
    // useEffect(() => {
    //     // Simulate fetching users from an API
    //     setUsers(users);
    //     setFilteredUsers(users);
    // }
    // , []);

    // handler to clear search input and reset filtered users
    const clearSearch = () => {
        setSearch('');
        setFilteredUsers(users);
    }

    // handler to filter users based on search input
    const handleSearchChange = (event) => {
        setSearch( event.target.value.toLowerCase())
        setFilteredUsers(Object.values(users).filter(user => user.value.firstName.toLowerCase().includes(event.target.value.toLowerCase())))
    }

    // handler to select a user from the list and display their details
    const handleUserSelect = (user) => { 
        console.log('handleUserSelect', user)
        setSelectedUser(user)
    }

    // handler to clear user detail form
    const clearSelectedUser = () => { 
        setSelectedUser(null)
    }

    // handler to display side drawer to a new user
    const handleAddUser = () => {   
        setSelectedUser(null);
        dialog.show()
    }

    // handler to refresh the user list
    const handleRefresh = () => { 
        setSelectedUser(null);
        setReload(!reload) 
        setAlertMessage('User list reloaded');
        setAlertType("neutral")
        setShowAlert(true)
    }


    // handler to update a selected user from the list
    const updateUser = async (userAttributes) => {
        let resp = await updateUserHelper(userAttributes);
        if(resp.status==='success'){
            setAlertMessage('User configuration was successfully updated');
            setAlertType("neutral")
            setShowAlert(true)
        } else {
            setAlertMessage('An error has occurred updating this user.');
            setAlertType("error")
            setShowAlert(true)
        }
        setShowDeleteDialog(false);
        clearSelectedUser()
        setReload(!reload);
    }

    // handler to display the delete user dialog
    const dialogDeleteUser = (user) => { 
        setShowDeleteDialog(true)
        setDeleteUser(user);
    }

    // handler to delete a user from the list
    const handleUserDelete = async () => {
        console.log('handleUserDelete', deleteUser)
        const identity = {identity: deleteUser.key}
       //  Call server API to create the user
       let resp = await deleteUserHelper(identity);

        if(resp.status==='success'){
            setAlertMessage('User configuration was successfully deleted');
            setAlertType("neutral")
            setShowAlert(true)
        } else {
            setAlertMessage('An error has occurred deleting this user.');
            setAlertType("error")
            setShowAlert(true)
        }
        setShowDeleteDialog(false);
        setDeleteUser(null);
        setReload(!reload);
        dialog.hide()
    }

    // handler to create new application users
    const createUser = async (user) => {
        let from = '';
        switch (user.type) {
            case 'webRtc':
                from = `client:${user.identity}`;
                break;
            case 'sip':
                from = `sip:${user.identity}`;
                break;
            case 'phone':
                from = user.identity; // phone number
                break;
            default:
        }

        // structure the submitted user attributes
        const userAttributes = {
            identity: user.identity,
            from : from,
            role: 'user',
            type: user.type,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            email: user.email,
        }
        let resp = await createUserHelper(userAttributes);
        if(resp.status==='success'){
            setAlertMessage('User configuration created successfully');
            setAlertType("neutral")
            setShowAlert(true)
            setReload(!reload);
        } else {
                setAlertMessage('An error has occurred creating this user.');
            setAlertType("error")
            setShowAlert(true)
        }
        dialog.hide()   
    }

    // Render the users page
    let layout =  (
        <div>
            <Box style={{marginTop:10, }} height="100vh">
                <Grid gutter="space40">
                    <Column span={12}>
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
                    <Column span={4}>
                        <Card marginLeft={'100px'}width="100%" >
                            <Heading as="h3" variant="heading30" marginBottom="space40">Application Users</Heading>
                            <Paragraph marginBottom="space40">Manage users for your application. Users can be added, deleted, and updated.</Paragraph>
                            
                            <Box overflowY="auto" height="auto" maxHeight="500px">
                                <Box style={{marginBottom: '20px'}} padding="space20">
                                    <Label htmlFor="search">Filter</Label>
                                    <Input 
                                        aria-describedby="search" 
                                        id="search" 
                                        name="email_address" 
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
                                            <Th>Delete</Th>
                                            <Th>User</Th>
                                            <Th>View</Th>
                                        </Tr>
                                    </THead>
                                    <TBody>
                                        {
                                            Object.values(filteredUsers).filter(user => user.value.role === 'user').map((user, index) => (
                                                <UserRecord key={index} user={user} deleteUser={dialogDeleteUser} userSelect={handleUserSelect}/>
                                            ))
                                        }
                                    </TBody>
                                </Table>

                            </Box>
                                <Box as="div" style={{marginLeft: '10px', marginRight:'10px', marginTop:'20px'}}  >
                                    <Button variant="secondary" size="small" onClick={()=> handleRefresh()} fullWidth>Refresh</Button>
                                </Box>

                            <Box as="div" style={{marginBottom: '10px'}} padding="space60" >
                                <Button variant="primary"  onClick={()=> handleAddUser()} fullWidth>Add User</Button>
                            </Box>
                        </Card>
                    </Column>
                    <Column span={8}>
                        <Card>
                            <Heading as="h3" variant="heading30" marginBottom="space40">User Details</Heading>
                            <Paragraph marginBottom="space40">Update a selected user's details.</Paragraph>                        
                            <AddUserForm mode={'edit'} selectedUser={selectedUser} updateUser={updateUser} clearForm={clearSelectedUser} />
                        </Card>
                    </Column>

                </Grid>

                {/* Side modal for add user features */}
                <SideModalContainer state={dialog}>
                    {/* Place this button wherever you want to trigger the modal */}
                    <SideModal aria-label="Add User Modal" width="400px">
                        <SideModalHeader>
                        <SideModalHeading>Add User</SideModalHeading>
                        </SideModalHeader>
                        <SideModalBody>
                        {/* Modal content here */}
                            <AddUserForm mode={'add'} createUser={createUser}/>
                        </SideModalBody>
                    </SideModal>
                </SideModalContainer>

                
                {/* Alert visualization for user deletion */}
                <AlertDialog
                    heading="Delete User"
                    isOpen={showDeleteDialog}
                    onConfirm={handleUserDelete}
                    onConfirmLabel="Delete"
                    onDismiss={() => setShowDeleteDialog(false)}
                    onDismissLabel="Cancel"
                >
                    <Paragraph>Are you sure you want to delete this user?</Paragraph>
                    <Text>Name: {deleteUser?.value.firstName} {deleteUser?.value.lastName}</Text>
                    <DetailText>Identity: {deleteUser?.value.identity} ({deleteUser?.value.type})</DetailText>
                </AlertDialog>
            </Box>
        </div>
    )
    return layout
}
export default Users;