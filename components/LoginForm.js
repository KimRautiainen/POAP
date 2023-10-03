import React from 'react';
import {Alert, StyleSheet} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import {useAuthentication} from '../hooks/ApiHooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useContext} from 'react';
import {MainContext} from '../contexts/MainContext';
import {Card, Input, Button} from '@rneui/themed';

const LoginForm = () => {
  const {postLogin} = useAuthentication();
  const {setIsLoggedIn, setUser} = useContext(MainContext);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const logIn = async (loginData) => {
    try {
      const loginResponse = await postLogin(loginData);
      console.log('login response', loginResponse);
      // TODO: fix dofetch() to display errors from API (e.g. when bad user/pw)
      // use loginResponse.user for storing token & userdata
      await AsyncStorage.setItem('userToken', loginResponse.token);
      setIsLoggedIn(true);
      setUser(loginResponse.user);
    } catch (error) {
      Alert.alert('Error', error.message);
      // TODO: notify user about failed login?
    }
  };

  return (
    <Card containerStyle={styles.card}>
      <Card.Title>Login</Card.Title>
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'Username is required'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="Username"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            autoCapitalize="none"
            errorMessage={errors.username?.message}
            inputStyle={styles.input}
          />
        )}
        name="username"
      />

      <Controller
        control={control}
        rules={{
          maxLength: 100,
          required: {value: true, message: 'Password is required'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <Input
            placeholder="password"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            errorMessage={errors.password?.message}
            inputStyle={styles.input}
          />
        )}
        name="password"
      />
      <Button
        title="Submit"
        onPress={handleSubmit(logIn)}
        buttonStyle={styles.button}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10, // match the card style
    shadowColor: '#000', // shadow properties
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
  button: {
    height: 50, // Increase button height
    backgroundColor: '#FF385C',
    borderRadius: 10, // border radius to match the button style
    marginTop: 20, // Increase top margin for spacing
  },
  input: {
    // Adjust input styles as needed
  },
});
export default LoginForm;
