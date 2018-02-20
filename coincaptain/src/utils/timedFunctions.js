var Promise = require("bluebird");
console.log(Promise.version);

const ASYNC_TIMEOUT = 5000;

export const asyncTimeoutFunction = (timeoutTime, func, successCallback, failureCallback) => {
    /* new Promise (function (resolve, reject) {
        func (function (error, result) {
            if (error) {
                return reject (error);
            }
            return resolve (result);
        });

        setTimeout ( () => {
            reject ('timeout')
        }, 1000);
    }).then (() => {
        successCallback ();
    }).catch (error => {
        failureCallback (error);
    }); */

    return new Promise ((resolve, reject) => {
        try { 
            func ();
            successCallback ();
            resolve ("success");
        } catch (error) {
            failureCallback ();
            reject (error);
        }
    }).timeout (timeoutTime);
}

export const asyncTimeoutFunctionDefault = (func, successCallback, failureCallback) => {
    asyncTimeoutFunction (ASYNC_TIMEOUT, func, successCallback, failureCallback);
}