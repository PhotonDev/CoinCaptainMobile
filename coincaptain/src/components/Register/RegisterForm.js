import React, { Component } from 'react';
import { AppRegistry, View, Text, TextInput, TouchableOpacity, StatusBar, StyleSheet } from 'react-native';

import Spinner from 'react-native-loading-spinner-overlay';

import Database from '../../database/Database';
import { genericAlert, genericErrorAlert, genericErrorDescriptionAlert, genericRequiredFieldAlert } from '../../utils/genericAlerts';

export default class RegisterForm extends Component {

    constructor () {
        super();
        this.state = {
            username        : '',
            password        : '',
            confirmPassword : '',
            loading         : false,
        };
    }

    async componentWillUnmount () {
        this.mounted = false;
    }

    async componentDidMount () {
        this.mounted = true;
    }

    _register = async () => {
        try {
            this.setState ({
                loading : true
            });

            const { username, password, confirmPassword } = this.state;
            console.log (username);
            console.log (password);
            console.log (confirmPassword);

            if (username === "" && password === "" && confirmPassword === "") {
                genericRequiredFieldAlert ("Please enter an username, password and confirm password");
                return;
            } else {
                field = "";

                if (username === "") {
                    field = "username";
                } else if (password === "") {
                    field = "password";
                } else if (confirmPassword === "") {
                   field = "confirm password";
                } else if (password !== confirmPassword) {
                   genericAlert ("Mismatch", "Password and confirm password do not match");
                   return;
                }

                if (field !== "") {
                    genericRequiredFieldAlert (field);
                    return;
                }
            }

            await Database.signup (username, password, (user) => {
                console.log ('success function');
                console.log (user);
            }, () => {
                console.log ('failure function');
                setTimeout(() => {
                    genericErrorAlert ("Could not create the account");
                }, 100);
            });
        } catch (error) {
            console.warn (error);
            genericErrorDescriptionAlert (error);
            // throw error;
        } finally {
            if (this.mounted)
                this.setState ({
                    loading : false
                })
        }
    }

    render () {
        return (
            <View style = { styles.container }>

                <Spinner
                    visible = { this.state.loading }
                    textContent = { "Loading..." }
                    textStyle = {
                        { color : '#FFF' }
                    } 
                />


                <TextInput
                    placeholder = 'username or email'
                    placeholderTextColor = 'rgba(255, 255, 255, 0.7)'
                    returnKeyType = 'next'
                    value = { this.state.username }
                    onChangeText = { username => this.setState ( { username } ) }
                    onSubmitEditing = { () => this.passwordInput.focus () }
                    keyboardType = 'email-address'
                    autoCapitalize = 'none'
                    autoCorrect = { false }
                    style = { styles.input } />
                    
                <TextInput
                    placeholder = 'password'
                    placeholderTextColor = 'rgba(255, 255, 255, 0.7)'
                    returnKeyType = 'go'
                    value = { this.state.password }
                    onChangeText = { password => this.setState ( { password } ) }
                    onSubmitEditing = { () => this.confirmPasswordInput.focus () }
                    style = { styles.input } 
                    ref = { (input) => this.passwordInput = input }
                    secureTextEntry />

                <TextInput
                    placeholder = 'confirm password'
                    placeholderTextColor = 'rgba(255, 255, 255, 0.7)'
                    returnKeyType = 'go'
                    value = { this.state.confirmPassword }
                    onChangeText = { confirmPassword => this.setState ( { confirmPassword } ) }
                    onSubmitEditing = { this.registerUser }
                    style = { styles.input } 
                    ref = { (input) => this.confirmPasswordInput = input }
                    secureTextEntry />

                <TouchableOpacity onPress = { this._register } style = { styles.buttonContainer }>
                    <Text style = { styles.buttonText }>Register</Text>
                </TouchableOpacity>

            </View>
        );
    }
}

const styles = StyleSheet.create ({
    container : {
        padding : 20
    },
    input : {
        height : 40,
        backgroundColor : 'rgba(255, 255, 255, 0.2)',
        marginBottom : 10,
        color : '#FFF',
        paddingHorizontal : 10
    },
    buttonContainer : {
        backgroundColor : '#2980b9',
        paddingVertical : 15
    },
    buttonText : {
        textAlign : 'center',
        color : '#FFFFFF',
        fontWeight : '700'
    }
})

AppRegistry.registerComponent ('RegisterForm', () => RegisterForm);