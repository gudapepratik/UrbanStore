const ErrorHandler = (error) => {
    if (error.response) {
        // Extract the custom error details from the server
        const { status, data } = error.response
    
        // Optionally return or re-throw for further handling
        throw {
            success: false,
            status: status,
            message: data.message,
            errors: data.errors || [],
        }
    } else {
        console.error("Axios Error:", error.message);
        throw error; // Re-throw unexpected errors
    }
}

export default ErrorHandler;