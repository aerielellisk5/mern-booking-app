import { RegisterFormData } from "./pages/Register"
import { SignInFormData } from "./pages/SignIn";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
// how to import environment variables from a .env file

//when the the frontend and backend code is bundled, we dont need a api_base_url, so that why we added the pipes and then empty quotes

export const register = async (formData: RegisterFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: 'POST',
        credentials: "include", 
        // set the cookie with credentials
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(formData),
    });
    const responseBody = await response.json();

    if(!response.ok) {
        throw new Error(responseBody.message);
    }
};

export const signIn = async (formData: SignInFormData) => {
    // console.log("from the api-client")
    // console.log(formData)
    // console.log("from the api-client")
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
    });

    const body = await response.json();
    // console.log("returning body")
    // console.log(body)
    // console.log("returning body")
    if(!response.ok){
        throw new Error(body.message)
    }
    return body;
};

export const validateToken =  async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
        credentials: "include",
    });

    if(!response.ok) {
        throw new Error("Token invalid");
    }
    console.log(response)
    return response.json();
};

export const signOut = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        credentials: "include",
        method: "POST"
    });

    if(!response.ok) {
        throw new Error("Error during Sign Out");
    }
}


  