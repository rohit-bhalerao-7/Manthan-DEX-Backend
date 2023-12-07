import React, { useState } from "react";
import Axios from "axios";

const App = () => {
  const [accessToken, setAccessToken] = useState("");
  const [appCreated, setAppCreated] = useState(false);
  const [appID, setAppID] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [appDetails, setAppDetails] = useState(null);
  const [walletID, setWalletID] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const handleSignup = async (email, password) => {
    try {
      const response = await Axios.post("https://dev.neucron.io/auth/signup", {
        email,
        password,
      });

      setAccessToken(response.data.data.access_token);
      setSignupSuccess(true);
      console.log(response.data);
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await Axios.post("https://dev.neucron.io/auth/login", {
        email,
        password,
      });

      setAccessToken(response.data.data.access_token);
      setLoginSuccess(true);
      // console.log(response.data.data);
      console.log(response.data.data.wallet_id);

      // You might want to set the app ID or other relevant data here
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleCreateApp = async (appName) => {
    try {
      const response = await Axios.post(
        "https://dev.neucron.io/develop/app/create",
        { app_name: appName },
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );

      // Display app details from the response
      console.log("App created:", response.data.data.app);

      // Set appCreated to true upon successful app creation
      setAppCreated(true);
    } catch (error) {
      console.error("Create app error:", error);
    }
  };
  const handleFetchDetails = async () => {
    try {
      const response = await Axios.get(
        `https://dev.neucron.io/develop/app/appdetails?appID=${appID}`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );
      console.log(response.data);
      setAppDetails(response.data.data.app);
    } catch (error) {
      console.error("Fetch app details error:", error);
    }
  };

  const getMnemonic = async (walletID) => {
    try {
      const response = await Axios.get(
        `https://dev.neucron.io/wallet/mnemonic?walletID=${walletID}`,
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );

      // Assuming the response contains a 'mnemonic' field, you can set it to state or display it as needed
      console.log("Mnemonic:", response.data);
    } catch (error) {
      console.error("Get mnemonic error:", error);
    }
  };
  const createWallet = async (mnemonic) => {
    try {
      const response = await Axios.post(
        "https://dev.neucron.io/wallet/create",
        {
          mnemonic: mnemonic,
        },
        {
          headers: {
            Authorization: accessToken,
          },
        }
      );

      // Assuming the response contains wallet creation details, you can process the response here
      console.log("Wallet created:", response.data);
    } catch (error) {
      console.error("Create wallet error:", error);
    }
  };
  return (
    <div>
      {signupSuccess && <p>Signup successful! You can now log in.</p>}
      {loginSuccess && <p>Login successful! You're now logged in.</p>}
      {appCreated && <p>App created successfully!</p>}
      {/* Signup Component */}
      <SignupForm onSignup={handleSignup} />

      {/* Login Component */}
      <LoginForm onLogin={handleLogin} />

      {/* Create App Component */}
      <CreateAppForm onCreateApp={handleCreateApp} />
      <h2>View App Details</h2>
      <input
        type="text"
        placeholder="Enter App ID"
        value={appID}
        onChange={(e) => setAppID(e.target.value)}
      />
      <button onClick={handleFetchDetails}>Fetch Details</button>
      <br />
      <input
        type="text"
        placeholder="Enter Wallet ID"
        value={walletID}
        onChange={(e) => setWalletID(e.target.value)}
      />
      <button onClick={() => getMnemonic(walletID)}>Get Mnemonic</button>
      <input
        type="text"
        placeholder="Enter Mnemonic"
        value={mnemonic}
        onChange={(e) => setMnemonic(e.target.value)}
      />
      <button onClick={() => createWallet(mnemonic)}>Create Wallet</button>
    </div>
  );
};

const SignupForm = ({ onSignup }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSignup(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Signup</button>
    </form>
  );
};

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
};

const CreateAppForm = ({ onCreateApp }) => {
  const [appName, setAppName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateApp(appName);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="App Name"
        value={appName}
        onChange={(e) => setAppName(e.target.value)}
      />
      <button type="submit">Create App</button>
    </form>
  );
};

export default App;
