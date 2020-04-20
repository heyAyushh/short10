import * as React from "react";
import {
  Checkbox,
  ColorPicker,
  createTheme,
  Customizer,
  Dropdown,
  Fabric,
  initializeIcons,
  PrimaryButton,
  Slider,
  TextField,
  Toggle,
} from "office-ui-fabric-react";

initializeIcons();

// Go to aka.ms/themedesigner for more control over theme.
const theme = createTheme({
  palette: {
    themePrimary: "red"
  }
});

const About = () => (
  <Customizer settings={{ theme }}>
    <Fabric applyTheme>
      <div>
        <PrimaryButton>Hello, world</PrimaryButton>
        <Toggle defaultChecked label="Hello" />
        <TextField defaultValue="hello" />
        <Dropdown disabled />
        <Checkbox defaultChecked label="Hello" />
        <Slider defaultValue={50} max={100} />
        <ColorPicker />
      </div>
    </Fabric>
  </Customizer>
);

export default About;