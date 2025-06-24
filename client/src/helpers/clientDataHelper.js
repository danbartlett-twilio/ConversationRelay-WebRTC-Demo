

import axios from "axios";

export const updateUserHelper = async(userAttributes) => {

    //  call backend to update user configuration ( server > data > users.json )
    try {
        // Fetch all voices from the backend
        const updateUserURL = process.env.REACT_APP_UPDATE_USER_URL; 
        return await axios.post(updateUserURL,  userAttributes )
        .then((resp) => {
            return resp.data
        })
    } catch (error) {
        return { status: "error", message: error.message };
    }
}


export const createUserHelper = async(userAttributes) => { 

            // //  Call server API to create the user
        const createUrl = process.env.REACT_APP_CREATE_USER_URL
        try {
            return await axios.post(createUrl,  userAttributes )
            .then((resp) => {
                console.log('User created', resp.data);
                return resp.data
                })

            }
         catch (error) {
            console.error('Error creating user', error);
            return { status: "error", message: error.message };
        }
}

export const deleteUserHelper = async(identity) => {
        const deleteUrl = process.env.REACT_APP_DELETE_USER_URL
        try {
            return await axios.post(deleteUrl,  identity )
            .then((resp) => {
                console.log('User deleted', resp.data);
                return resp.data
            })
        } catch (error) {
            console.error('Error creating user', error);
            return { status: "error", message: error.message };
        }    
}


export const deleteCallHelper = async (callSid) => {
    const deleteCallUrl = process.env.REACT_APP_DELETE_SESSION_URL
    console.log('deleteCallHelper', deleteCallUrl, callSid)
    try {
        return await axios.post(deleteCallUrl,  callSid )
        .then((resp) => {
            console.log('Call deleted', resp.data);
            return resp.data
        })
    } catch (error) {
        console.error('Error deleting call', error);
        return { status: "error", message: error.message };
    }
}


export const updateUseCaseHelper = async(useCaseAttributes) => {

    //  call backend to update user configuration ( server > data > users.json )
    try {
        // Fetch all voices from the backend
        const updateUseCaseURL = process.env.REACT_APP_UPDATE_USE_CASE_URL; 
        console.log('updateUseCaseHelper', updateUseCaseURL, useCaseAttributes)
        return await axios.post(updateUseCaseURL,  useCaseAttributes )
        .then((resp) => {
            return resp.data
        })
    } catch (error) {
        return { status: "error", message: error.message };
    }
}

export const deleteUseCaseHelper = async(useCaseAttributes) => {

    //  call backend to update user configuration ( server > data > users.json )
    try {
        // Fetch all voices from the backend
        const deleteUseCaseURL = process.env.REACT_APP_DELETE_USE_CASE_URL; 
        console.log('deleteUseCaseHelper', deleteUseCaseURL, useCaseAttributes)
        return await axios.post(deleteUseCaseURL,  useCaseAttributes )
        .then((resp) => {
            return resp.data
        })
    } catch (error) {
        return { status: "error", message: error.message };
    }
}