import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";

import config from "./configurations/config.json";

import Snow from "./components/effects/snow";

import Home from "./routes/home";
import Optout from "./routes/emails/optout/optout";
import ConfirmOptout from "./routes/emails/confirm_optout/confirm_optout";

function App() {
  useEffect(() => {
    import(`./themes/${config.customization.theme}.css`);
    import(`./layouts/${config.customization.layout}.css`)

    document.title = config.settings.tab_title;

    const link = document.createElement("link")
    link.rel = "icon";
    link.type = "image/png";
    link.href = config.settings.tab_img;
    document.head.append(link);
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/emails/optout" Component={Optout} />
        <Route path="/emails/confirm_optout/:email" Component={ConfirmOptout} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
