export function validateEmail(email) {
    const re = new RegExp(['^(([^<>()\\[\\]\\,;:\\s@"]+(\\.[^<>()\\[\\]\\,;:\\s@"]+)*)',
        '|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])',
        '|(([a-zA-ZÀÈÌÒÙàèìòùÁÉÍÓÚÝáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄËÏÖÜŸäëïöüŸ¡¿çÇŒœßØøÅåÆæÞþÐð:\\-0-9]+\\.)',
        '+[a-zA-ZÀÈÌÒÙàèìòùÁÉÍÓÚÝáéíóúýÂÊÎÔÛâêîôûÃÑÕãñõÄËÏÖÜŸäëïöüŸ¡¿çÇŒœßØøÅåÆæÞþÐð:]{2,}))$'
    ].join(''));

    return re.test(email);
}

// Check if the string is empty, return boolean (`true` if field is empty) /^[A-Za-z]+$/
export function isEmpty(str) {
    return !str.replace(/^\s+/g, '').length;
}

/**Validate name, should not have any space in sting */
export const validateNames = (val) => {
        if (val && /^\S*$/i.test(val)) {
            return true;
        }
        return false
    }
    /***Validate phone number */
export const validPhonenumber = (val) => {
    if (val && /^[0-9]{10}$/i.test(val)) {
        return true;
    }
    return false;
};

export function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
/**Function to get serach value from url */
export const getUrlValue = (val) => {
    if (val) {
        const val1 = val.split('=');
        const data = val1[val1.length - 1];
        if (data) {
            return data;
        } else {
            return false;
        }
    } else {
        return false;
    }

}

export const getPriceCommaSeprated = (val) => {
    if (val) {
        return val.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    return false
}

export function parseGraphQLErrorMessage(error) {
    let errorMessage;
    errorMessage = error.toString().replace('Error: GraphQL error: ', '');
    errorMessage = errorMessage.toString().replace('400 - ', '');
    errorMessage = errorMessage.toString().replace('401 - ', '');

    //If the error message is a valid JSON then, retrieve the error message from the object
    if (IsJsonString(errorMessage)) {
        let errorObj = JSON.parse(errorMessage);
        errorMessage = errorObj.error.message;
    }

    // If the message contains network error
    if (errorMessage.toLowerCase().indexOf("network error") !== -1) {
        //errorMessage = errorMessage.toString().replace('Error: Network error: ', '');
        //Error: Network error: Response not successful: Received status code 400
        errorMessage = "Network issue. Please try again.";
    }
    return errorMessage;
}