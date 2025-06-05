

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